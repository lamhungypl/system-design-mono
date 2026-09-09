# `app/mathgpt-port/` — MathGPT master-child, ported for the playground

Source: `/Users/harley/workspaces/gotit/auto_works/mathgpt-services/mathgpt_app` (read-only reference).
Surface: `/playground/master-child-review-changes`.
Plan: `tasks/2026-09-09-ui-ux-playground-master-child-review-changes-{plan,todo}.md`.

Paths mirror `mathgpt_app/src/` so the correspondence is checkable file-for-file and a later real port
is a diff rather than a translation. File **names** are kebab-cased to match this repo; **component and
type names are the MathGPT ones, unchanged**.

## Why this exists

MathGPT already ships master-child. Its `ReviewChangesModal` renders staged changes as a flat list of
prose labels. Figma frame `45938:34995` draws the same dialog as an `ITEM | CURRENT | NEW` diff table.
The two disagree, and the API payload can only feed one of them. This surface renders both off one
fixture so the gap is visible instead of argued about.

## Correspondence

| Here | `mathgpt_app/src/` | Treatment |
|---|---|---|
| `types/master-child.ts` | `types/masterChild.ts` | **copied field-for-field** + playground additions below the banner |
| `constants/master-child.ts` | `constants/masterChild.ts` | copied, plus copy lifted out of `ReviewChangesModal.tsx` / `StagedChangesCallout.tsx` |
| `mocks/data/master-child.ts` | `mocks/data/masterChild.ts` | adapted; rows reproduce Figma frame `45938:34995` |
| `components/Common/modals.tsx` | `components/Common/Modals.tsx` | shell rebuilt on this repo's `Dialog`; `FooterType` keeps every upstream member name |
| `components/Common/PublishOutcomeList/` | same | rebuilt; grouping and badge-collapsing rules preserved |
| `components/Common/SectionIdentityCard/` | same | rebuilt |
| `components/Common/SyncStateBadge/` | same | rebuilt; AhaUI `Badge` (a label chip) → this repo's `Tag`, since here `Badge` is a count/status dot |
| `components/Common/target-icons.tsx` | `components/Common/Icons/*` | lucide equivalents of `settings-01` / `book-open-01` / `file-check-02` |
| `components/Modals/MasterChild/review-changes-modal.tsx` | same | rebuilt; adds the demo-only `bodyVariant` and `demoState` props |
| `components/Common/ChangeDiffTable/` | — | **net-new.** Nothing upstream renders the designed table |
| `components/Authenticated/.../MasterChild/staged-changes-callout.tsx` | same | rebuilt; the Redux modal registry is replaced by page-owned open state |

## Deliberately not ported

- **AhaUI.** No `u-*` / `ut-*` utilities, no `styled-components`. Structure and naming are the bar;
  exact colour and spacing are not (same bar as the 2026-09-08 hr-port).
- **The Redux modal registry** (`modalMap`, `ModalKey`, `showModal`). One page owns one dialog here.
- **The service layer** (`services/masterChild.ts`) and MSW. Fixtures are static; the async states are
  page-level toggles instead of a network (plan Decision 3).
- **`SectionDriftModal`, `UpdatesFromMasterModal`.** The scanned node is the master-side button; the
  child-side dialog is out of scope.
- **Real question rendering.** `QuestionDiffCard` is presentational — math is styled text, options are
  static markup. No MathQuill, no MathLive, no real question components (plan Decision 7).

## Invented here (not MathGPT, not the API)

Everything below the `PLAYGROUND ADDITIONS` banner in `types/master-child.ts`:

- `DiffValue` (`scalar` | `question`), `QuestionDiffPayload`, `QuestionDiffOption`,
  `QuestionDiffSettings`
- `PublishChangeValueRow = PublishChangeRow & { previousValue, nextValue }`, `PublishValuePreview`
- `isDiffValueUnchanged` — the "hide unchanged rows" rule

**The API emits none of it.** `PublishChangeRow` supplies `changeLabel` (the ITEM column) and nothing
more. Whether the contract can grow these — the question snapshot especially — is open question 2 in
the plan, and is stated on the page itself.

## One change outside this tree

`app/components/ui/dialog.tsx` gained an optional `dismissible` prop (default `true`). The publishing
state needs a dialog Escape cannot close, which `<dialog>` only allows by preventing the `cancel`
event. Backwards compatible; every existing call site is unaffected.

## Focus restore lives in `components/Common/modals.tsx`

MathGPT opens a dialog by mounting it and closes it by unmounting, and this page does the same. A
native `<dialog>` restores focus only when it is *closed* — unmounting one while open drops focus on
`<body>`. `Modal` therefore remembers the trigger and refocuses it on unmount. The capture happens
**during the first render**, not in an effect: the child `<Dialog>` calls `showModal()` in its own
effect, and child effects run before the parent's, so an effect-based capture already reads an element
inside the dialog.

## Figma provenance

File `ZYT7o5Qqau7B6S252rMoP3`, section `45938:34994` "MASTER COURSE → PUBLISH CHANGES".

| Node | Frame | Used for |
|---|---|---|
| `45974:41480` | New Changes Banner | `StagedChangesCallout` — the "View changes" button |
| `45938:34995` | Review Changes (collapsed) | the diff table, group rows, italic `None` / `Created` |
| `45938:35275` | Review Changes (expanded) | `QuestionDiffCard` — options, Student answer pill, Question settings |

Frames not built: `45938:35552` / `45938:35654` (Master Management) and `45938:35757` (Drifted Items).

Two things the frames get wrong, resolved against the shipping code:

1. The visible intro reads *"…to all child courses."*, while a hidden sibling layer (`45938:34999`)
   reads *"…to all sections."*. Decision **D2** (`constants/masterChild.ts`) renames to Section, which
   is what ships. The hidden layer is current; the visible one is the older draft.
2. Question #16's stem is `12x³ + 18x²` in the collapsed frame and `4x² + 18x` in the expanded one. The
   fixture uses the expanded frame's values, since that is the frame carrying the settings detail.
