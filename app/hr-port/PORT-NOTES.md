# hr-port

Everything under `app/hr-port/**` is **copied from `dynamic-web-app/src/**`** (same relative
paths) to serve one route: `/playground/table-modal-changes`. It is the HR "Request
Approvals" screen — the Employment Profile Change Request and Salary Movement tables, and
the side-by-side employee-data diff modal behind the document icon in the *Changed data*
column.

Copy convention: `#/x/y` imports became `~/hr-port/x/y`, and `.ts` / `.tsx` extensions were
stripped from module specifiers (this repo has no `allowImportingTsExtensions`).

## What was verified working

- Both tables render with toolbar, search, filter dropdowns, sorting, row selection,
  column pinning and pagination.
- The compare modal opens from the document icon, shows **only the four sections that
  changed** (Employee Information, Contact Information, Work Experience, Salary
  Information), hides unchanged fields, and pairs grid rows by index — the deleted row is
  flagged, the added row appears only on the new side, and the old side is padded so the
  two tables stay aligned.
- Old side red-bordered, new side green-bordered, both inert.
- The two grid panes scroll horizontally in lockstep (`react-scroll-sync`).
- Confirm dialog → `PUT /change-data-request/approve` → success toast → selection cleared
  via the `EMPLOYEE_CHANGE_PROFILE_REQUEST_PROCESS` emitter event.
- Escape and the close button dismiss dialogs; tooltips, filter popovers and select menus
  open, position and close.

## Deviations from the source

| File | What changed | Why |
|---|---|---|
| `config/env.ts` | schema trimmed to `API_URL`, `APP_TA_URL`, `ENABLE_API_MOCKING`, `DEBUG_MODE` | the SSO and seven `FIREBASE_*` variables are only read by auth/notification code that stayed behind |
| `config/i18n.ts` | loads every local locale eagerly via `import.meta.glob` | the original fetches namespaces from the API through `LanguageProvider`; the resource shape is unchanged, so `t('<namespace>.…')` resolves as before |
| `lib/language/provider/language-provider.tsx` | **stubbed** to a context-only provider | the original fetches bundles from the API and caches them in IndexedDB; `useLanguage()` consumers (calendar, form-address-section) are unaffected |
| `components/ui/app-dialog/constants.ts` | **trimmed registry** — 8 dialogs instead of ~30 | the source registers every dialog in the app here, which is what makes its import closure span payroll, home and analytic-report |
| `components/ui/app-preview-dialog/app-preview-dialog.tsx` | **stubbed** | the original previews images and PDFs inline (`react-pdf`, IndexedDB, zoom/rotate); file preview is not what this screen demonstrates |
| `lib/mocks/handlers.ts` | focused subset of the source's 13k-line handlers, plus three write endpoints the source's HAR-generated mocks never captured (`change-data-request/approve`, `profile/process-salary`, `salary-movement/update-remark`) | without those, approve/reject spins forever |
| `components/ui/data-table/data-table.d.ts` | `ColumnMeta` given type parameters | `app/components/data-table/adapt-columns.ts` augments `ColumnMeta` too, and TS requires identical type parameters (TS2428) |
| `components/ui/data-table/types.ts` | `FilterProps` re-declared and exported here | the source declares it inside its `declare module '@tanstack/react-table'` block and imports it from there; TS does not surface type aliases added that way (TS2305) |
| `components/ui/data-table/hooks/use-app-table-params.ts` | `RefObject<Table<T> \| null>` | React 19 types `useRef<T>(null)` as `RefObject<T \| null>` |
| `components/base/form.tsx` | removed a `@ts-expect-error` | react-hook-form 7.87 typechecks what 7.53 could not, so the directive errored as unused |
| `features/hr-settings/.../api/*.query.ts`, `features/profiles/api/salary-movement/salary-movement.query.ts` | mutation `onSuccess` forwards args as a tuple | @tanstack/react-query 5.9x passes `(data, variables, onMutateResult, context)`; the source was written against the 3-arg signature |
| `components/ui/file-uploader/utils.ts` | accumulator typed as `Record<string, string[]>` | react-dropzone 20 widened `accept` to `Accept \| AcceptGroup[]`, which is not string-indexable |
| `features/profiles/constants.ts` | glob made relative | `import.meta.glob` rejects aliased patterns |
| `components/ui/data-table/components/SelectCheckbox.tsx` | `TooltipTrigger asChild` + span wrapper | the source nests a radix checkbox `<button>` inside a tooltip trigger `<button>` — invalid HTML, and React 19 warns |
| `components/ui/data-table/body/DataTableBodyLoading.tsx` | render function accepts and forwards `ref` | the source declares `forwardRef` but its render function takes only `props` |
| `components/form/form-text-field/form-text-field.tsx` | `isInGrid` destructured out | `form-dynamic-field` passes it, and `...rest` spread it onto the `<input>` |
| `features/hr-settings/.../section-details.tsx` | added a `key` | the source omits it when mapping `subsection_infos` |
| `features/hr-settings/request-approvals/components/salary-movement-requests-list.tsx` | date-filter params widened with an explicit cast | the source relies on a `@ts-expect-error` above a single-line call; prettier reflowed that call and moved the property accesses out from under the directive |

### Dropped (copied then removed as not on this screen's render path)

`components/ui/app-guide-line` (pulls faq + documents + permissions), `features/faq/components`,
`components/form/form-segmented-control`, `form-text-editor`, `form-upload-button`,
`salary-movement-notification-icon`, `salary-movement-navbar-link`,
`app-dialog/app-navigation-prompt-dialog`.

## Repo-level changes made for this port

- `tsconfig.json`: `verbatimModuleSyntax: false` — the copied tree imports types without the
  `type` keyword in hundreds of places, and nothing here emits.
- `vite.config.ts`: `vite-plugin-svgr` with the source's options (`exportType: "named"`), and
  an `optimizeDeps.include` list — the compare modal is lazy-loaded and its chunk is the
  first thing to pull in several of these dependencies, so without pre-bundling Vite
  re-optimizes mid-navigation and the dynamic import fails with `504 (Outdated Optimize Dep)`.
- `app/entry.client.tsx`: starts the MSW worker in dev before hydration, per
  https://github.com/remix-run/react-router/discussions/12651.
- `app/app.css`: layout-affecting tokens (`text-xxs`, form-control heights, `3xl` breakpoint)
  plus best-effort colour tokens and the source's `.dialog-*` / `.scrollbar-hidden` /
  `.asterisk` classes. **Colour fidelity was explicitly out of scope.**
- `.prettierignore`: `app/hr-port/` is excluded — it keeps the copied tree close to the
  source, and prettier's reflow moves `@ts-expect-error` directives off the lines they
  suppress (that is exactly how the salary-movement row above broke).
- `sass-embedded` added: two copied stylesheets are `.scss` (`data-table.scss` uses `@extend`,
  `calender.scss` uses `&__` nesting).

## Known deltas

- The source app runs at `html { font-size: 18px }`; this repo is at the browser default, so
  every `rem` is ~11% smaller. `rem` cannot be scoped to a subtree, so this was accepted.
- Colours come from this repo's `base-vega`/mist tokens, not the source palette.
- The list mocks are static: approving a row returns success and refetches, but the fixture
  still reports `WAITING_APPROVAL`.
- `PrivateCurrency` masks salary figures as `X,XXX.XX` (source behaviour).

## Re-copying from the source

There is no sync script — files were copied layer by layer and adapted. To refresh one file,
copy it from `dynamic-web-app/src/<same path>`, rewrite `#/` → `~/hr-port/`, strip `.ts`/`.tsx`
from specifiers, then re-apply any row above that names it.
