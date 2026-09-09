---
slug: ui-ux-playground-master-child-review-changes
date: 2026-09-09
status: done
supersedes:
superseded_by:
---

# Implementation Plan: `/playground/master-child-review-changes` — "View changes" → Review changes diff table

## Overview

Add a second card to the UI/UX Playground, under **Table + change modal**.

The starting hunch was: *the HR side-by-side compare modal looks like it fits a master-child change
preview.* The Figma scan (§Figma findings) turned that into something sharper:

> MathGPT's **Review changes** dialog is **already designed** as a side-by-side `ITEM | CURRENT | NEW`
> diff table. The code that ships today renders a **flat list of prose labels** instead. The design and
> the implementation disagree, and the payload the API returns cannot express the design.

So the card renders the dialog **twice off one fixture** — variant A exactly as `mathgpt_app` ships it,
variant B as frame `45938:34995` draws it — so the two can be put beside each other, and the payload gap
between them is visible rather than argued about.

**This is a playground demo, not a MathGPT change.** Nothing here is committed to `mathgpt_app`.

## Figma findings (Task 1 — scan complete, 2026-09-09)

Auth: `whoami` → handle `Engineers`, plan **Got It** (Dev seat) ✅.
File `ZYT7o5Qqau7B6S252rMoP3` · section `45938:34994` = **"MASTER COURSE → PUBLISH CHANGES"**, five frames:

| Node | Frame | Relevance |
|---|---|---|
| `45974:41480` | **New Changes Banner** | the "View changes" button — **master side** |
| `45938:34995` | **Review Changes** (collapsed) | the dialog under test |
| `45938:35275` | **Review Changes** (question rows expanded) | expand/collapse state |
| `45938:35552` | Course Settings — Master Management [Syncing] | adjacent, out of scope |
| `45938:35654` | Course Settings — Master Management [Synced / No changes] | adjacent, out of scope |
| `45938:35757` | Drifted Items | adjacent, out of scope |

Screenshots cached in the session scratchpad:
`figma-45974-41480-new-changes-banner.png`, `figma-45938-34995-review-changes-collapsed.png`,
`figma-45938-35275-review-changes-expanded.png`.

### Open question 1 — RESOLVED: it is the master side

`45974:41480` reads *"You have 8 staged course updates. / Would you like to apply them to all your child
courses?"* with **[🚀 Publish now] [View changes]**. That is `StagedChangesCallout` →
`ModalKey.MASTER_REVIEW_CHANGES` → `ReviewChangesModal`. The child-side `CourseUpdatedCard` /
`UpdatesFromMasterModal` is **not** what was linked; it drops out of scope.

*Delta vs shipped code:* the frame has two buttons; `StagedChangesCallout.tsx` ships a third,
**Dismiss**. Keep all three — Dismiss has a real dismissed-state branch in the code.

### What the dialog actually is

A single scrolling three-column table — **not** tabs, and **not** the HR modal's red/green panes:

```
Review changes                                                            ✕
You have staged 8 changes. Review them before publishing to all child courses.
┌──────────────────────┬──────────────────────────┬───┬──────────────────────────┐
│ ITEM         (240px) │ CURRENT          (551px) │ → │ NEW              (551px) │
├──────────────────────┴──────────────────────────┴───┴──────────────────────────┤
│ ⚙  Course settings                                          ← group header row  │
│ Updated course name  │ Master - AP Calculus AB… │ → │ AP Calculus AB           │
│ Updated due date     │ Sep 30, 2026             │ → │ Dec 31, 2026             │
│ 📖 Real Numbers: Algebra Essentials                                             │
│ Updated title        │ Algebra Essentials       │ → │ Real Numbers: Algebra…   │
│ 📖 Simplifying Algebraic Expressions & Properties                               │
│ Added new            │ None            (italic) │ → │ Created         (italic) │
│ Updated title        │ Simplifying Properties   │ → │ Simplifying Algebraic…   │
│ 📄 Late Final Exam Winter 2025                                                  │
│ Removed question #2  │ ┃question card, faded┃   │ → │ None                     │
│                      │ ┃    ↓ Expand       ┃   │   │                          │
│ Updated due date     │ Oct 15, 2026             │ → │ Oct 31, 2026             │
│ Updated question #16 │ ┃question card┃          │ → │ ┃question card┃          │
│ Added new questions  │ None                     │ → │ ┃question card┃          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                                            Cancel   🚀 Publish now
```

Confirmed against the frames:

- Modal is **`Modal - md`, 1392 wide**. Header *Review changes* + ✕. Footer **Cancel** / **🚀 Publish
  now** — identical to the shipped `FooterType.DOUBLE` footer.
- Intro sentence is **verbatim what the code already emits**: *"You have staged 8 changes. Review them
  before publishing to all …"*.
- Column grid `240 | 1 | 551 | 24(→) | 551`; header row 44px, data rows 53px, thin vertical rules
  between columns.
- **Group header rows**, not tabs — icon + target name on a `Gray/50` band, one per target, in API
  order with course settings first. Icons: `settings-01` (course), `book-open-01` (module item),
  `file-check-02` (exam).
- **No outcome badges anywhere in this table.** Consistent with the shipped code, which already passes
  `hideOutcomes` to `PublishOutcomeList` in this exact dialog.
- Absent values render as *None* / *Created* in **italic gray**, never blank.
- **Diff cells are polymorphic** — this is the part no existing component covers:
  - **scalar**: a title, a date, a name — one line of text.
  - **question card**: stem with inline math, lettered answer options with radios, a green
    *⊘ Student answer* pill, an *Explanation* chip, and a **Question settings** panel
    (AI Tutoring / AI step-by-step grading / Scores / Max attempts / Type).
    Truncated with a fade and an **↓ Expand** / **↑ Collapse** button; the two sides expand
    independently (frame `45938:35275` shows both expanded, revealing e.g. `Scores: 2 points → 1 point`
    and `AI Tutoring: Off → On`).
- Change labels carry add/remove/update semantics: *Added new*, *Removed question #2*,
  *Updated question #16*, *Added new questions*, *Updated title*, *Updated due date*.

### Copy: "sections" vs "child courses" — not a conflict

Both strings exist in the file; the frame keeps *"…to all sections."* as a **hidden** layer
(`45938:34999`) beside the visible *"…to all child courses."*. `constants/masterChild.ts` records
decision **D2**: the UI says **Section**. So the hidden layer is the current decision and the visible one
is the older draft. **Use `SECTION_NOUN_PLURAL`.** No flag needed.

### Tokens (`get_variable_defs` on `45938:34996`)

`Gray/900 #101828` · `Gray/700 #344054` · `Gray/600 #475467` · `Gray/500 #667085` · `Gray/300 #D0D5DD` ·
`Gray/200 #EAECF0` · `Gray/100 #F2F4F7` · `Gray/50 #F9FAFB` · `Primary/500 #375DE7` ·
`Primary/100 #E6EBFC` · `Primary/50 #EFF2FD` · `Success/700 #067647` · `Success/500 #17B26A` ·
`Success/50 #ECFDF3` · `radius-md 8` · spacing `2/4/8/12/16/24/240` · Inter 12/14/16, DM Sans 24 Bold
(title) · `shadow-xs/md/lg`.
Recorded for reference only — colour fidelity stays out of scope (see Decision 2).

## What already exists in code (the grounding)

MathGPT FE **already ships master-child**. Read before building:

| Concern | `mathgpt_app` file |
|---|---|
| The dialog under test | `src/components/Modals/MasterChild/ReviewChangesModal.tsx` (197 LOC) |
| Its siblings | `.../SectionDriftModal.tsx`, `.../UpdatesFromMasterModal.tsx` |
| The "View changes" button | `src/components/Authenticated/CourseDetails/MasterChild/StagedChangesCallout.tsx:69` |
| Today's list body | `src/components/Common/PublishOutcomeList/PublishOutcomeList.tsx` |
| Section header block | `src/components/Common/SectionIdentityCard/SectionIdentityCard.tsx` |
| Roster badge | `src/components/Common/SyncStateBadge/SyncStateBadge.tsx` |
| **Data schema** | `src/types/masterChild.ts` |
| Fixtures to adapt | `src/mocks/data/masterChild.ts` |
| Copy constants | `src/constants/masterChild.ts` |
| Modal shell + footer kinds | `src/components/Common/Modals.tsx` (`FooterType`, `ModalSizeType`) |
| Registry | `src/components/Modals/index.tsx`, `src/constants/modal.ts` |

And in **this** repo: `app/routes/playground/index.tsx`, `app/lib/playground-nav.tsx`, `app/routes.ts`,
`app/components/ui/*`, and the prior port's conventions in
`tasks/2026-09-08-ui-ux-playground-employee-change-review-plan.md` (status `done`).

## The payload gap this demo exposes

`PublishChangeRow` (`types/masterChild.ts`) is the change record:

```ts
settingKey, settingLabel, changeLabel, targetLabel, targetType,
targetKind, targetId, outcome, label, reason, reasonShort
```

`changeLabel` is **composed prose** — `'Updated late submission penalty'` — and maps cleanly onto the
design's **ITEM** column. But there is **no CURRENT value, no NEW value, and no question payload** in the
response. Two of the design's three columns have no data behind them.

The playground therefore carries a fixture-only extension:

```ts
// Playground-only. The API emits none of this today.
type DiffValue =
  | { kind: 'scalar'; text: string | null }        // null → renders italic "None"
  | { kind: 'question'; question: QuestionDiffPayload };

type PublishChangeValueRow = PublishChangeRow & {
  previousValue: DiffValue;
  nextValue: DiffValue;
};
```

Whether the BE can emit that — especially the question payload, which is a whole question snapshot per
side — is **the question this card exists to put in front of people**. It is stated on the page, not
buried here.

## Architecture Decisions

1. **New tree `app/mathgpt-port/`, mirroring `mathgpt_app/src/` paths.** `components/Common/…`,
   `components/Modals/MasterChild/…`, `types/master-child.ts`, `constants/master-child.ts`,
   `mocks/data/master-child.ts`. Same precedent as `app/hr-port/`, and it makes the user's core ask —
   *reuse the component names* — literally checkable, so a later real port is a diff, not a translation.

2. **Names and data schema copied verbatim; UI rebuilt.** `ReviewChangesModal`, `PublishOutcomeList`,
   `SectionIdentityCard`, `SyncStateBadge`, `StagedChangesCallout`, `FooterType`, `ModalKey.MASTER_*`
   and every type in `types/masterChild.ts` keep their names and prop shapes; bodies are rewritten on
   this repo's `Dialog` / `Alert` / `Badge` / `Button` / `Card`. AhaUI's `u-*` / `ut-*` classes and
   `styled-components` do not exist here and are **not** copied. Layout, structure and naming are the
   bar; exact colour and spacing are not (same bar as the 2026-09-08 port).

3. **Static in-file fixtures. No MSW, no TanStack Query.** Adapted from
   `mathgpt_app/src/mocks/data/masterChild.ts`. The async states the shipped dialog has (`isLoading`,
   `loadFailed`, `isPublishing`) become **page-level toggles**, so a reviewer can see each on demand
   instead of racing a network.

4. **Both variants ship, switchable.** Variant A (`PublishOutcomeList`) is what production renders;
   variant B (`ChangeDiffTable`) is what Figma specifies. One fixture, one footer, one header — only the
   body differs. Deleting A destroys the comparison the card is for.

5. **The Figma frame is authoritative on shape; the HR modal was only the prompt.** Three corrections
   the scan forced on the first draft of this plan:
   - **No tabs.** Targets are group header rows inside one scrolling table, not `SectionTabs`.
   - **No red/green panes.** A plain table with a `→` between the value columns. The HR modal's
     `border-action-red` / `border-action-green` treatment is *not* in this design.
   - **No outcome badges in the table.** Matches the shipped `hideOutcomes` call.

6. **The diff cell is a renderer registry, not a string.** `DiffValueCell` dispatches on
   `DiffValue.kind`: `scalar` → one line (italic *None* when null), `question` → `QuestionDiffCard` with
   independent expand/collapse. Adding a third kind later must not touch the table.

7. **`QuestionDiffCard` is presentational and faked.** Math renders as styled text, not MathQuill/
   MathLive — no vendored editor in a playground demo. Answer options, the *Student answer* pill, the
   *Explanation* chip and the *Question settings* panel are static markup driven by the fixture.

8. **Route:** `/playground/master-child-review-changes`, sibling of `table-modal-changes` under the
   existing `playground` layout, which already supplies the dialog container and providers.

## Task List

### Phase 0: Grounding
- [x] Task 1: Scan the Figma nodes and settle which "View changes" this is — **done 2026-09-09**

### Phase 1: Foundation
- [x] Task 2: Port the master-child schema, copy constants, and the diff fixtures
- [x] Task 3: Rebuild the shared display components

### Checkpoint: Foundation

### Phase 2: Surface + the shipped dialog (variant A)
- [x] Task 4: Route, playground card, nav entry, page shell with the banner
- [x] Task 5: `ReviewChangesModal` variant A — the as-built list body

### Checkpoint: Variant A renders

### Phase 3: The designed dialog (variant B)
- [x] Task 6: `ChangeDiffTable` — the `ITEM | CURRENT | NEW` table with group rows
- [x] Task 7: `DiffValueCell` + `QuestionDiffCard` — polymorphic cells with expand/collapse
- [x] Task 8: Wire variant B into `ReviewChangesModal` behind the variant switch

### Checkpoint: Both variants comparable side by side

### Phase 4: States, a11y, write-up
- [x] Task 9: State matrix toggles
- [x] Task 10: a11y + responsive pass, and the on-page note stating the payload gap

### Checkpoint: Complete

Acceptance criteria, verification and file lists:
`2026-09-09-ui-ux-playground-master-child-review-changes-todo.md`.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **The design needs data the API cannot supply** — two of three columns, plus a full question snapshot per side. | High | Fixture-only `DiffValue` extension, named as such, surfaced on the page. Do not imply the API supplies it. This gap *is* the deliverable. |
| **`QuestionDiffCard` becomes a rabbit hole** — real math rendering, real answer widgets, real settings. | High | Decision 7: presentational and faked, static markup off the fixture. If a task starts reaching for MathQuill/MathLive or the real question components, stop. |
| **The 1392px modal does not fit the playground viewport.** The shipped dialog is `size="medium"`; this table needs far more. | Medium | Size the dialog to the design at ≥1440 and let the table scroll horizontally inside its own container below that. The page must never scroll horizontally. |
| A literal copy of AhaUI markup renders unstyled here. | Medium | Decision 2 — names and props copied, bodies rewritten. Reviewer checks names and structure, not pixels. |
| Scope creep into the three adjacent frames (Master Management ×2, Drifted Items). | Medium | Explicitly out of scope. The page shell is the minimum that makes a "View changes" button make sense. |
| Variant B quietly replaces variant A because it is nicer. | Low | Decision 4. Both ship; the switch defaults to A. |

## Open Questions

1. ~~Which "View changes" is node `45974-41480`?~~ **Resolved by the scan — master side.**
2. **Can the BE emit `CURRENT` / `NEW` at all, and at what cost?** Scalars look tractable; a per-side
   question snapshot is a much larger ask. Splitting the design into *scalars now, question diffs later*
   is a real option the card should let people weigh.
3. **Is the compare per master edit, or per section?** `PublishChangeRow` is emitted **one row per
   section per setting**, and `ReviewChangesModal.tsx:44-57` already de-duplicates to master edits. The
   design shows **one row per edit**, so CURRENT must mean *the master's own previous value* — which
   holds only if every section shared that value. Sections that diverged are exactly the `SKIPPED /
   "Overridden by instructor"` rows, and the design has nowhere to show them. **Assumption taken:
   one row per master edit; divergence stays in the existing "View details" breakdown.** Worth
   confirming — it is the one place the design may be under-specified.
4. Does the table need `Removed`/`Added` styling beyond the italic *None* / *Created* convention?
   The frames use nothing else; a strikethrough or colour cue is a possible improvement, not a spec.
5. Does variant B replace variant A, or become a "details" view behind it? The card is the artefact for
   deciding that.
