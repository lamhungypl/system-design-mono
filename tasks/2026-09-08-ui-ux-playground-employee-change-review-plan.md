---
slug: ui-ux-playground-employee-change-review
date: 2026-09-08
status: done
supersedes:
superseded_by:
---

# Implementation Plan: `/playground/table-modal-changes` — port the employee change-request screens

## Overview

Copy the HR **Request Approvals** screens from `dynamic-web-app` into `system-design-mono-origin` at
`/playground/table-modal-changes`: both request tables (Employment Profile Change Request + Salary
Movement) and the side-by-side "Updated Employment Profile Data Preview" modal they open. Files are
**copied and then re-created to fit the target repo** — imports rewritten, whatever doesn't come across
gets stubbed. The i18n feature comes along wholesale.

## Definition of done for this port

This is a demo surface. **Fonts, colours and exact spacing don't matter.** What matters:

1. The page renders — no crash, no error boundary, no blank screen.
2. The **layout** holds: the table grid, the modal's 3-column compare grid, tabs, toolbar.
3. **Dialogs and popovers open, close and position correctly** — the compare modal, the confirm dialog,
   the filter dropdowns, the select menus. These are the things most likely to break in a port and the
   things this playground exists to exercise.

Anything beyond that (colour fidelity, the source's 18px root font, pixel spacing) is explicitly out of
scope. Behavioural fidelity of the diff logic is Phase 2, not a Phase 1 gate.

## Measured scope

Transitive import closure from the three entry components plus the tabbed page, with the app-wide dialog
registry (`components/ui/app-dialog/constants.ts` — it lazy-imports every dialog in the app) and the
`#/constants` barrel cut: **296 files · ~23.8k LOC**, 49 of them SVGs. Cutting those two edges is what
makes this tractable; the naive closure is 481 files and pulls in payroll, home and analytic-report.

| Layer | Files | Notes |
|---|---|---|
| infra: `utils`, `types`, `constants`, `config`, `lib`, `stores`, `hooks` | ~40 | axios, env, emitter, toast, app-loading, device |
| `components/base` | 22 | radix/shadcn primitives, one radix package per file |
| `components/ui` atoms | ~15 | app-input/money/number, app-checkbox, app-radio, select-option-list, truncated-text, untouchable, icon/loading buttons |
| `components/ui/app-dialog` | 9 | AppDialog + confirm dialogs + registry |
| `components/ui/data-table` | 40 | tanstack table stack: headers, body, filters, toolbars, pagination, hooks |
| `components/form` | 25 | RHF field wrappers, incl. form-data-table (grid editor) and form-address-section |
| `features/dynamic-form` | 9 | types, constants, `convert-profile-data`, `field`, `rule`, `attribute`, DynamicProvider |
| `features/profiles` | 23 | `form-dynamic-field` (490 LOC), FieldsInfoProvider, SectionSumProvider, profile types + APIs |
| `api/*` | 13 | options, region-setting, user, language |
| `features/hr-settings` | 25 | the screens under port |
| `assets/svgs` | 49 | imported via svgr's named `ReactComponent` export |

New external packages: `react-hook-form`, `zod`, `@hookform/resolvers`, `axios`, `zustand`, `ahooks`,
`lodash`, `immer`, `nanoid`, `qs`, `use-debounce`, `mathjs`, `js-cookie`, `eventemitter3`,
`@date-fns/tz`, `@tanstack/react-virtual`, `react-scroll-sync`, `i18next`, `react-i18next`,
`vite-plugin-svgr`, 16 `@radix-ui/*` + `@radix-ui/react-icons`, and `msw` (dev).

## Architecture Decisions

1. **Copy and re-create, layer by layer.** Files land in the target's own tree (`app/hr-port/...`) with
   imports rewritten from `#/` to `~/`. Copy in dependency order, lowest layer first, and typecheck after
   each layer, so a break is always in the layer just added. Expect some components not to come across —
   that's fine, they get stubbed and noted.
2. **Stub aggressively; don't chase completeness.** Anything off the render path for these two screens
   becomes a stub with a header comment: `form-file-uploader` / `file-uploader` / `features/documents` /
   `useFilePreview` (a read-only file-name list, dropping `react-dropzone`, `idb`, `file-saver`), the
   mobile `app-drawer` / `base/drawer` (dropping `vaul`), and the app-wide dialog registry (replaced by a
   4-entry local one). If a stub turns out to be on the render path, un-stub it — the source is right
   there.
3. **Copy the whole i18n feature.** `config/i18n.ts` + `locales/en/*.json` + the language provider come
   over as-is with `i18next` / `react-i18next` installed, so `useTranslation` and the `TFunction` type in
   the copied files need no edits and the screens show real labels. **Fallback if it fights** (SSR/init
   ordering, missing namespaces): swap in a 15-line `t` that returns the key — strings don't matter for
   this demo, and the type can become a local `(key: string, opts?: any) => string`.
4. **MSW started from `entry.client`**, per the react-router discussion the user linked
   ([#12651](https://github.com/remix-run/react-router/discussions/12651)): `react-router reveal
   entry.client`, then `await worker.start()` behind a dev guard before rendering `HydratedRouter`. The
   target is SPA mode (`ssr: false`), so the client entry is the right and only hook. This keeps
   `config/axios.ts` and every query hook working unmodified.
5. **Layout-affecting Tailwind bits only.** Add the source utilities that change layout —
   `--spacing-form-control-height` / `--spacing-form-label-height`, `text-xxs`, `breakpoint-3xl`, and the
   `.dialog-padding` / `.dialog-footer` / `.dialog-content-padding` / `.scrollbar-hidden` classes. Colour
   tokens (`action-red/green/blue`, `gray-border`, `danger`) get one-line best-effort definitions so
   classNames resolve to *something*; nobody checks the shade. No `.dwa-scope` colour-override system —
   dropped as unnecessary complexity.
6. **The vendored primitives keep radix.** Converting 22 primitives to base-ui is the single largest
   source of "the popover broke" risk, which is exactly what this demo is supposed to prove works. So:
   copied primitives stay on radix; anything **newly written** for the playground uses base-ui; and
   Phase 2 converts individual primitives only if there's appetite, one per commit. This is the radix
   fallback the brief allows, applied to a 296-file copy.
7. **Two DataTables coexist.** The target's Ant-style `app/components/data-table` is untouched; the
   copied tanstack stack lives under `app/hr-port/components/ui/data-table`. Different paths, no
   collision. The ported columns/filters/toolbar depend on the copied one's API.
8. **Route:** `/playground/table-modal-changes` under a `playground` layout, leaving room for more
   `/playground/<slug>` screens.

## Fixture data (already written, currently uncommitted in the source's `handlers.ts`)

`GET /hr/employee/change-data-request/detail/:id` — request 1184. Changed: `first_name` `123b`→`th11`,
`work_location` `ha_div1`→`ha_div2`, `employment_date` `1999-01-01`→`2025-01-01`, `phone`
`0900000001`→`0912345678`, bank account `TTB`→`KASIKORNBANK`, bank no `1234567890`→`9876543210`.
Unchanged (should stay hidden): `last_name`, `employee_no`, `gender`, `employment_type`. The
`work_experience` grid (31314) covers all three row states: 300001 edited (salary 30000→35000), 300002
deleted (`delete_flg`, values retained so panes stay aligned), one row added (`entity_data_id: null`,
old side padded with an invisible row). `POST /hr/employee/change-data-request/list` returns one row
(`th11 / WAITING_APPROVAL`); the salary-movement list mock is in the same generated file.

**Commit that handlers.ts change in the source repo before copying** — it's the whole fixture.

`useEmployeeProfileQuery()` supplies the structure that drives every rendered field
(`section_infos`, `subsection_infos`, `extracted_fields`, `field_map`); its mock lives in a 574 KB
generated file and needs trimming to the sections the modal shows.

## Behaviours to verify in Phase 2

- Only changed fields/subsections/tabs render; `EMPLOYEE`-uneditable fields skipped; first visible tab
  auto-opens.
- Grid rows pair **by index**: deleted rows stay in the new-side list, old side padded per added row;
  a grid counts as changed on differing row counts or any differing cell.
- Address sections roll sub-field visibility up; 2-column-old / stacked-new layout.
- Old side red-bordered, new side green-bordered, both inert (`Untouchable`).
- Grid panes scroll horizontally in lockstep.
- Tables: doc-icon opens the modal for its row; approve/reject + selection disabled once
  Approved/Rejected; `code` pinned left, action pinned right; `created_at desc` default; filters synced
  to the URL; bulk approve/reject through the confirm dialog, with the
  `EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS` emitter event clearing the selection.

## Task List

Tasks live in `2026-09-08-ui-ux-playground-employee-change-review-todo.md`.

### Phase 1: Make it render
- [x] Task 1: Deps, svgr, layout-affecting Tailwind bits
- [x] Task 2: Copy the i18n feature
- [x] Task 3: MSW via `entry.client` + env + axios
- [x] Task 4: Copy layer 0 — utils, types, constants, lib, stores, hooks
- [x] Task 5: Copy layer 1 — `components/base` primitives
- [x] Task 6: Copy layer 2 — `components/ui` atoms
- [x] Task 7: Copy layer 3 — app-dialog stack + local registry
- [x] Task 8: Copy layer 4 — data-table stack
- [x] Task 9: Copy layer 5 — form wrappers (uploader stubbed)
- [x] Task 10: Copy layer 6 — dynamic-form + profiles engine
- [x] Task 11: Copy layer 7 — API layer + MSW handlers + trimmed profile fixture
- [x] Task 12: Copy layer 8 — the hr-settings screens
- [x] Task 13: Playground route + providers, wire the page

### Checkpoint: Phase 1
- [x] `/playground/table-modal-changes` renders both tables with no crash
- [x] Compare modal opens from the doc icon and closes cleanly
- [x] Confirm dialog, filter dropdowns and select menus all open, position and close correctly
- [x] Layout holds: table grid, modal 3-column compare grid, tabs, toolbar
- [x] `pnpm typecheck` clean

### Phase 2: Fidelity and cleanup
- [x] Task 14: Modal behaviour pass
- [x] Task 15: Table behaviour pass
- [x] Task 16: Un-stub or delete, drop unused deps, playground index + notes

### Checkpoint: Phase 2
- [x] Behaviour list above verified side by side against the source app
- [x] No unimported dependency left in `package.json`; every remaining stub documented
- [x] Ready for review

## Verification

The target repo has no test runner. Every task verifies with `pnpm typecheck` plus a manual check at
`pnpm dev` (port 9000). Side-by-side reference: source repo `pnpm dev` with
`VITE_APP_ENABLE_API_MOCKING=true`, at `/hr/request-approvals`.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Radix primitives on React 19 (target) vs 18 (source) — popovers/dialogs are the likeliest break, and the thing the demo must prove | High | Layer 1 lands early and gets an explicit open/close/position check before anything is built on it; pin radix versions with React 19 peers |
| `verbatimModuleSyntax: true` + `strict` in the target rejects the copied files' value-imports of types | Med | Give the copied tree its own tsconfig project reference with the flag relaxed rather than editing hundreds of imports |
| Import rewriting `#/` → `~/` across 296 files by hand is error-prone | Med | One mechanical `sed` per layer, then typecheck that layer before moving on |
| i18next init ordering in a react-router SPA | Med | Decision 3's fallback: key-returning `t` |
| 574 KB profile-structure fixture | Med | Trim to the rendered sections; keep as JSON |
| `react-datepicker` 7 (source) vs 9 (target already has it) API drift in `base/calendar` | Med | Date fields render read-only here; stub the picker to a text display if it fights |
| Scope drift — the closure invites porting the whole app | High | The 296-file closure is the contract; anything outside it gets stubbed, not copied |
| Two DataTable implementations confuse future readers | Low | Copied tree isolated under `app/hr-port/` with a README |

## Open Questions

- None blocking. Decisions taken: faithful copy of the dynamic-form engine; full i18n feature copied
  (key-returning `t` as fallback); MSW from `entry.client`; both tables; two phases;
  `/playground/table-modal-changes`; layout + dialog/popover correctness is the bar, not styling.
