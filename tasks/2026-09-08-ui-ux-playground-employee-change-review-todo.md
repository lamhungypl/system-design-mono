---
slug: ui-ux-playground-employee-change-review
date: 2026-09-08
status: done
supersedes:
superseded_by:
---

# Tasks: `/playground/table-modal-changes`

> **Status: complete (2026-09-08).** Both phases landed and were verified in a real
> browser. Implementation notes, every deviation from the source and the known deltas
> live in `system-design-mono-origin/app/hr-port/PORT-NOTES.md` — read that, not this
> file, when touching the port.
>
> Departures from the plan as written:
> - `react-dropzone` / `idb` / `file-saver` / `vaul` were **kept**, not stubbed —
>   copying `file-uploader` + `features/documents` turned out cheaper than stubbing six
>   modules. Only `app-preview-dialog` and the language provider are stubs.
> - `verbatimModuleSyntax` was disabled repo-wide instead of via a project reference.
> - `sass-embedded` was added (two copied stylesheets are `.scss`).
> - `optimizeDeps.include` was needed so the lazy-loaded modal chunk does not trip
>   Vite's dep re-optimization (`504 Outdated Optimize Dep`).
> - Three write endpoints were added to the mocks; the source's HAR-generated handlers
>   never captured approve/reject.
> - `app/hr-port/` is in `.prettierignore`: prettier reflow moved a `@ts-expect-error`
>   off the line it suppressed.

Target: `/Users/harley/workspaces/git_repos/per/system-design-mono-origin`
Source: `/Users/harley/workspaces/git_repos/per/dynamic-web-app`
Plan: `2026-09-08-ui-ux-playground-employee-change-review-plan.md`

Verification for every task (no test runner in the target repo):

```bash
pnpm typecheck    # react-router typegen && tsc
pnpm dev          # port 9000, manual check
```

Reference: source repo `pnpm dev` with `VITE_APP_ENABLE_API_MOCKING=true`, at `/hr/request-approvals`.

**The bar for Phase 1:** renders without crashing, layout holds, dialogs and popovers open/close/position
correctly. Colours, fonts and spacing don't matter.

**Copy convention:** copied files go under `app/hr-port/<same relative path as in src/>`, and every
`#/x/y` import becomes `~/hr-port/x/y`. One mechanical rewrite per layer, then typecheck that layer
before starting the next.

---

# Phase 1: Make it render

## Task 1: Deps, svgr, layout-affecting Tailwind bits

**Description:** Install the external packages the copied tree needs, add `vite-plugin-svgr` with the
source's options (`exportType: 'named'`, `ref: true`, `svgo: false`, `titleProp: true`) plus the SVG
module declaration, and add only the Tailwind pieces that affect layout. Colour tokens get throwaway
definitions so classNames resolve to something.

**Acceptance criteria:**
- [x] `import { ReactComponent as X } from '~/hr-port/assets/svgs/document.svg'` compiles and renders
- [x] `@theme` gains `--text-xxs`, `--spacing-form-control-height`, `--spacing-form-label-height`, `--breakpoint-3xl`, and best-effort `--color-action-red|blue|gray|green`, `--color-gray-border`, `--color-danger`
- [x] `.dialog-padding`, `.dialog-footer`, `.dialog-content-padding`, `.scrollbar-hidden`, `.asterisk` exist as plain CSS
- [x] `pnpm dev` still serves the existing `/components/*` pages unchanged

**Dependencies:** None
**Files:** `package.json`, `vite.config.ts`, `app/app.css`, `app/hr-port/svg.d.ts`
**Scope:** Medium

---

## Task 2: Copy the i18n feature

**Description:** Bring the source's i18n across whole: `config/i18n.ts`, `locales/en/*.json`,
`lib/language/*` (provider, hooks, constants), with `i18next` + `react-i18next` installed, so copied
files keep `useTranslation` and `TFunction` untouched. If init ordering or missing namespaces fight
back, fall back to a ~15-line `t` that returns the key and a local
`type TFunction = (key: string, opts?: any) => string` — strings don't matter here.

**Acceptance criteria:**
- [x] `useTranslation(undefined, { keyPrefix: 'hr_request_approvals.employee_change_profile.compare_dialog' })` → `t('title')` returns the real string, or the key under the fallback
- [x] `getRequestApprovalStatusMapping(t)` typechecks without edits to the copied file
- [x] `idb` dependency dropped if the language provider's IndexedDB cache is stubbed
- [x] Which path was taken (real i18n or fallback) is noted in `app/hr-port/README.md`

**Dependencies:** Task 1
**Files:** `app/hr-port/config/i18n.ts`, `app/hr-port/locales/en/*.json`, `app/hr-port/lib/language/*`
**Scope:** Medium

---

## Task 3: MSW via `entry.client` + env + axios

**Description:** Reveal the client entry (`pnpm react-router reveal entry.client`) and start the MSW
worker there behind a dev guard before rendering `HydratedRouter`, per
[react-router#12651](https://github.com/remix-run/react-router/discussions/12651). Copy `config/env.ts`
and `config/axios.ts`, add the `VITE_APP_*` values the Zod env schema demands, and generate
`public/mockServiceWorker.js`. Handlers themselves land in Task 11 — this task only needs the worker
booting with an empty handler list.

**Acceptance criteria:**
- [x] `pnpm dev` boots, worker registers exactly once, existing routes unaffected
- [x] Production build does not register the worker
- [x] `apiPrivate` / `apiPublic` import and construct without throwing (env validation passes)
- [x] The 401/403 reload interceptor cannot loop against mocks (guard or disable it in the copy)

**Dependencies:** Task 1
**Files:** `app/entry.client.tsx`, `app/hr-port/config/{env,axios}.ts`, `app/hr-port/lib/mocks/browser.ts`, `public/mockServiceWorker.js`, `.env`
**Scope:** Medium

---

## Task 4: Copy layer 0 — utils, types, constants, lib, stores, hooks

**Description:** The leaf layer everything else imports: `utils/{style,object,date,date-utils,money,math,string}`,
`types/{common,react-query}`, `lib/emitter`, `stores/use-app-loading`, `hooks/lib/use-toast`,
`hooks/{use-get-device,use-has-hover,use-sync-app-loading,use-subscribe-event,use-payment-method-options}`,
`features/common/*`, and a **trimmed `constants/index.ts`** exporting only what the copied tree
references (`ControlType`, `PaymentMethods`, `Roles`, `TABLE_ANCESTOR_LAYOUT`, `QueryKey`,
`EmitterEvent`, …) — let typecheck tell you the list rather than guessing.

**Acceptance criteria:**
- [x] Layer typechecks standalone (nothing in it imports a layer above)
- [x] `cn()` from `utils/style` works alongside the target's own `~/lib/utils`
- [x] `useAppLoading` + `useSyncAppLoading` compile against zustand v5

**Dependencies:** Tasks 1–3
**Files:** `app/hr-port/{utils,types,lib,stores,hooks,constants,features/common}/**`
**Scope:** Medium

---

## Task 5: Copy layer 1 — `components/base` primitives

**Description:** Copy all 22 radix/shadcn primitives as-is (avatar, badge, button, calendar/*, dialog,
drawer, form, input, label, multi-select, pagination, popover, progress, separator, skeleton, switch,
table, tabs, toast, tooltip). **This is the highest-risk layer** — React 19 vs the source's 18 — so it
gets an explicit interaction check before anything is built on top. Stub `drawer` (drops `vaul`) and,
if `react-datepicker` 9 vs 7 fights, stub `calendar` to a read-only text display.

**Acceptance criteria:**
- [x] A scratch route mounts dialog, popover, tooltip, tabs, select and toast: each **opens, positions,
      closes on Escape and on outside click**, and traps focus where it should
- [x] No React 19 console warnings from these primitives (or each remaining one is noted)
- [x] `pnpm typecheck` clean

**Dependencies:** Task 4
**Files:** `app/hr-port/components/base/**`, a scratch route
**Scope:** Large — split per primitive family if breakage is widespread

---

## Task 6: Copy layer 2 — `components/ui` atoms

**Description:** `app-input` (+ money/number), `app-checkbox`, `app-radio`, `app-select-option-list`
(virtualized — needs `@tanstack/react-virtual`), `select/Select`, `truncated-text`, `untouchable`,
`icon-button`, `loading-button`, `footer-button-group`, `pagination-button`,
`app-loading/simple-app-loading`.

**Acceptance criteria:**
- [x] Scratch route renders each atom; the virtualized option list scrolls and selects
- [x] `Untouchable` children can't be focused or clicked
- [x] `pnpm typecheck` clean

**Dependencies:** Task 5
**Files:** `app/hr-port/components/ui/{app-input,app-checkbox,app-radio,app-select-option-list,select,truncated-text,untouchable,icon-button,loading-button,footer-button-group,pagination-button,app-loading}/**`
**Scope:** Medium

---

## Task 7: Copy layer 3 — app-dialog stack + local registry

**Description:** Copy `app-dialog`, `app-dialog-base-container`, the context/provider/hooks, and the
confirm dialogs actually used (`app-confirm-dialog`, `app-confirm-request`, `app-confirm-common-dialog`,
`app-confirm-update-dialog`). Replace the app-wide registry with a 4-entry local one
(`EmployeeChangeProfileCompareDialog`, `AppConfirmRequestDialog`, `AppConfirmCommonDialog`,
`ConfirmUpdateDataTableItemDialog`) keeping the `dialogRegister` / `DialogName` / `DialogProps` shape so
`useAppDialog(...)` call sites in copied components stay unchanged. The compare-dialog entry can point at
a placeholder until Task 12.

**Acceptance criteria:**
- [x] `openAppDialog('AppConfirmRequestDialog', {...})` opens a working confirm dialog with the base container mounted
- [x] Registry types resolve at call sites without `as any`
- [x] A 90% × 90% `AppDialog` renders with its body scrolling and header pinned
- [x] Unregistered names fail loudly in dev

**Dependencies:** Task 6
**Files:** `app/hr-port/components/ui/app-dialog/**`
**Scope:** Medium

---

## Task 8: Copy layer 4 — data-table stack

**Description:** All ~40 files: `DataTable`, headers, body, footers, filters
(`ColumnsFiltersList`, `FitlerMultiSelect`, `FitlerSingleSelect`, `GlobalFilterTextField`), toolbars,
pagination, the hooks (`use-app-table*`, `use-feature-columns`, `use-table-location-effect`,
`use-parsed-state-params`, `use-table-pagination`), utils and constants. Needs `ahooks`, `immer`,
`lodash`, `use-debounce`, `qs`, `@tanstack/react-virtual`.

**Acceptance criteria:**
- [x] A scratch route renders the copied `DataTable` with static rows, sorting, pagination and row selection
- [x] **Filter dropdowns open, position and close correctly** and apply their filter
- [x] Column pinning renders (left + right) without layout collapse
- [x] `use-app-table-params` URL sync works under react-router 7 in the target
- [x] `pnpm typecheck` clean

**Dependencies:** Task 7
**Files:** `app/hr-port/components/ui/data-table/**`
**Scope:** Large — split into (a) table + headers/body, (b) filters + toolbars, (c) hooks/URL sync

---

## Task 9: Copy layer 5 — form wrappers

**Description:** `components/form/*` — form-text-field(+with-checkbox), form-select(+with-checkbox),
form-multi-select(+with-checkbox), form-radio, form-switch, form-checkbox, form-calendar,
form-curency-field, form-textarea, form-layout, form-tooltip, form-field-view-only, form-address-section
(+ its API), form-data-table (grid editor + its two dialogs). **Stub** `form-file-uploader` as a
read-only file-name list, dropping `react-dropzone` / `idb` / `file-saver` and the `file-uploader` +
`features/documents` subtrees. Needs `react-hook-form`, `zod`, `@hookform/resolvers`.

**Acceptance criteria:**
- [x] Scratch route inside a `FormProvider` renders each wrapper with a value
- [x] `form-select` / `form-multi-select` menus open, position and close correctly
- [x] The file-uploader stub renders file names with no upload affordance and a header comment saying how to un-stub
- [x] `pnpm typecheck` clean

**Dependencies:** Task 8
**Files:** `app/hr-port/components/form/**`
**Scope:** Large — split into (a) simple wrappers, (b) select/multi-select, (c) form-data-table + address-section

---

## Task 10: Copy layer 6 — dynamic-form + profiles engine

**Description:** `features/dynamic-form` (types, constants, DynamicProvider, utils: `field`, `rule`,
`attribute`, `convert-form-data`, `convert-profile-data`, `extract-profile`) and the `features/profiles`
pieces the modal needs: `form-dynamic-field` (490 LOC), `FieldsInfoProvider`, `SectionSumProvider`,
`types/profile-{data,structure}`, `constants`.

**Acceptance criteria:**
- [x] `FormDynamicField` renders a hand-written field descriptor of each control type on a scratch route
- [x] `convertProfileDataToFormData` runs against a hand-made `entity_data` sample without throwing
- [x] Unsupported control types render a visible placeholder instead of crashing
- [x] `pnpm typecheck` clean

**Dependencies:** Task 9
**Files:** `app/hr-port/features/{dynamic-form,profiles}/**`
**Scope:** Large

---

## Task 11: Copy layer 7 — API layer, MSW handlers, profile fixture

**Description:** Copy the query/api layers: `api/{options,region-setting,user,language}`,
`features/profiles/api/{employee-profile,bank-category}`, plus the `hr-settings` API files. Then the
handlers this screen needs: change-data-request list/detail/count, salary-movement list/total, employee
profile structure, bank-category, options, region-setting, user, language, faq — and trim the source's
574 KB generated employee-profile mock down to the structure response for the sections the modal shows
(Employee Information, Contact Information, Work Experience, Education, Employment Contract, Social
Security, Taxation — the dialog filters out Deduction Settings).

**Acceptance criteria:**
- [x] Scratch route: `useEmployeeProfileQuery()` resolves and `isData(...)` passes
- [x] `useEmployeeChangeProfileRequestListQuery()` returns the `th11` row; detail query returns the diff
- [x] Every `field_id` in the detail fixture (31270–31293, grid 31314–31319) exists in `field_map`
- [x] Trimmed fixture is JSON, under ~150 KB; no unhandled-request warnings for these endpoints

**Dependencies:** Tasks 3, 10
**Files:** `app/hr-port/api/**`, `app/hr-port/features/profiles/api/**`, `app/hr-port/lib/mocks/**`
**Scope:** Large — split into (a) api/query files, (b) handlers + fixture trim

---

## Task 12: Copy layer 8 — the hr-settings screens

**Description:** Copy both features: `employee-change-profile-request-approvals` (compare dialog + its
4 files, requests list, approve/reject/toolbar buttons, hooks, constants, api) and
`request-approvals` (salary-movement list + buttons + toolbar + status button + constants + utils).
Point the dialog registry's compare-dialog entry at the real component.

**Acceptance criteria:**
- [x] Both list components compile and mount
- [x] The compare dialog opens for id 1184 and renders sections without crashing
- [x] `pnpm typecheck` clean

**Dependencies:** Task 11
**Files:** `app/hr-port/features/hr-settings/**`
**Scope:** Medium

---

## Task 13: Playground route + providers, wire the page

**Description:** Add `/playground` (layout + index) and `/playground/table-modal-changes` in
`app/routes.ts`, mirroring the `templates` block, with a playground nav and a "UI/UX Playground" entry in
the main sidebar. The layout provides what the copied tree expects: a QueryClient configured like the
source (`staleTime: 5s`, no refetch on focus, mutation-meta invalidation, error toasts), `Toaster`,
`LanguageProvider`, `AppDialogBaseContainer`, the app-loading overlay. Then port the two-tab
request-approvals page rendering both lists.

**Acceptance criteria:**
- [x] `/playground` lists the playground screens; `/playground/table-modal-changes` renders both tabs
- [x] Tab counts come from the count/total endpoints
- [x] `useSyncAppLoading` drives a visible loading overlay; toasts appear
- [x] Navigating in and out of the playground leaves the target's own pages working

**Dependencies:** Task 12
**Files:** `app/routes.ts`, `app/routes/playground-layout.tsx`, `app/routes/playground/index.tsx`,
`app/routes/playground/table-modal-changes.tsx`, `app/lib/playground-nav.tsx`, `app/lib/nav.tsx`
**Scope:** Medium

---

### Checkpoint: Phase 1
- [x] `/playground/table-modal-changes` renders both tables, no crash, no error boundary
- [x] Doc icon opens the compare modal; it closes cleanly; reopening works
- [x] Confirm dialog, filter dropdowns, select menus: open, position, close correctly
- [x] Layout holds — table grid, modal 3-column compare grid, tabs, toolbar
- [x] `pnpm typecheck` clean; stubs listed in `app/hr-port/README.md`

---

# Phase 2: Fidelity and cleanup

## Task 14: Modal behaviour pass

**Description:** Now that it renders, make it behave: changed-only visibility, auto-opened first tab,
grid row pairing with the padding rule, lockstep horizontal scroll, red/green inert sides, address-section
layout, salary section.

**Acceptance criteria:**
- [x] Only Employee Information / Contact Information / Work Experience / Salary Information tabs appear; the first opens automatically
- [x] The 4 unchanged fields hidden; the 6 changed ones shown, inert
- [x] Work Experience shows 3 aligned row pairs (edited / deleted / added); both panes scroll in lockstep
- [x] Salary Information shows Bank Account + Bank No only
- [x] Address-section layout matches the source

**Dependencies:** Task 13
**Files:** `app/hr-port/features/hr-settings/**`, `app/app.css`
**Scope:** Medium

---

## Task 15: Table behaviour pass

**Description:** Filters, global search, selection, single + bulk approve/reject through the confirm
dialog, the emitter event clearing selection, pinning, pagination, sorting, and the disabled rules for
Approved/Rejected rows — on both tabs.

**Acceptance criteria:**
- [x] Search + status/search-by filters narrow rows; reset clears them and the count returns to 0
- [x] Single and bulk approve/reject both confirm, then show the success toast
- [x] Approved/Rejected rows: actions disabled, not selectable
- [x] `code` pinned left and action column pinned right survive horizontal scroll
- [x] Pagination and `created_at desc` default sort behave as in the source

**Dependencies:** Task 13
**Files:** `app/hr-port/features/hr-settings/**`, `app/hr-port/components/ui/data-table/**`
**Scope:** Medium

---

## Task 16: Un-stub or delete, drop unused deps, document

**Description:** Decide each stub's fate (un-stub if it turned out to matter, otherwise keep with a
comment), remove every dependency nothing imports, fill in the `/playground` index card, and write
`app/hr-port/README.md`: what was copied, from which source paths, what's stubbed, which shims exist, and
what to re-copy if the source changes.

**Acceptance criteria:**
- [x] No dependency in `package.json` is unimported (verified by grep over `app/`)
- [x] `pnpm install` + `pnpm typecheck` + `pnpm dev` clean after removals
- [x] README names every stub and shim; index card links to the screen
- [x] `pnpm format` clean

**Dependencies:** Tasks 14, 15
**Files:** `package.json`, `app/hr-port/README.md`, `app/routes/playground/index.tsx`
**Scope:** Small

---

### Checkpoint: Phase 2
- [x] Behaviour lists verified side by side against the source app
- [x] Nothing modified in `dynamic-web-app`
- [x] Ready for review
