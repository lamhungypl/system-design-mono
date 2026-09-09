---
slug: ui-ux-playground-master-child-review-changes
date: 2026-09-09
status: done
supersedes:
superseded_by:
---

# Tasks: `/playground/master-child-review-changes`

Plan: `2026-09-09-ui-ux-playground-master-child-review-changes-plan.md`

**Repo:** `/Users/harley/workspaces/git_repos/per/system-design-mono-origin` (branch `features/agents`)
**Reference repo (read-only, never edit):** `/Users/harley/workspaces/gotit/auto_works/mathgpt-services/mathgpt_app`
**Figma:** file `ZYT7o5Qqau7B6S252rMoP3` · banner `45974:41480` · dialog `45938:34995` (collapsed) /
`45938:35275` (expanded). Screenshots cached in the session scratchpad.

**Standing bar for every task:** `pnpm build` clean (typecheck + vite), no console errors on the route,
no unused imports. Colour/spacing fidelity is *not* a gate — structure, dialog behaviour and component
naming are.

---

## Phase 0: Grounding

### Task 1: Scan the Figma nodes and settle which "View changes" this is ✅ DONE (2026-09-09)

**Outcome:**
- `whoami` → `Engineers`, plan **Got It** (Dev seat) — authed.
- Node `45974:41480` = **New Changes Banner**, master side → `StagedChangesCallout` →
  `ModalKey.MASTER_REVIEW_CHANGES` → `ReviewChangesModal`. Child-side `UpdatesFromMasterModal` is out
  of scope. **Open question 1 resolved.**
- Node `45938:34994` = section **"MASTER COURSE → PUBLISH CHANGES"**; the dialog is frames
  `45938:34995` / `45938:35275`.
- The dialog is a single scrolling `ITEM | CURRENT | NEW` table with target **group header rows** —
  **not** tabs, **not** red/green panes, **no** outcome badges. Diff cells are polymorphic
  (scalar | question card with expand/collapse).
- Copy: intro sentence matches the shipped code verbatim; the *"sections"* vs *"child courses"* pair is
  a hidden-layer artefact, resolved in favour of `SECTION_NOUN_PLURAL` (decision D2). Not a conflict.
- Tokens recorded in the plan; colour fidelity stays out of scope.

Full findings: plan → **§Figma findings**.

---

## Phase 1: Foundation

### Task 2: Port the master-child schema, copy constants, and the diff fixtures

**Description:** Bring `types/masterChild.ts` and `constants/masterChild.ts` across verbatim (plain TS;
inline `CourseStatus` as a local enum), then build the fixture the diff table needs — including the
`DiffValue` extension the API does not supply.

**Acceptance criteria:**
- [x] `app/mathgpt-port/types/master-child.ts` exports `PublishOutcome`, `SettingTargetKind`,
      `SectionSyncStatus`, `deriveSectionSyncStatus`, `PublishChangeRow`, `PublishPreview`,
      `PublishPreviewSection`, `SectionSummary`, `SectionList`, `SectionUpdates`, `SectionDrift` —
      field-for-field identical to the MathGPT original, comments included
- [x] `DiffValue` (`scalar` | `question`), `QuestionDiffPayload` and
      `PublishChangeValueRow = PublishChangeRow & { previousValue, nextValue }` are defined
      **separately**, each with a comment saying they are playground-only and the API does not emit them
- [x] `QuestionDiffPayload` covers what frame `45938:35275` draws: `stem`, `options[] { letter, text,
      isStudentAnswer }`, `hasExplanation`, and `settings { aiTutoring, aiStepByStepGrading, scores,
      maxAttempts, type }`
- [x] `app/mathgpt-port/constants/master-child.ts` carries `SECTION_NOUN` / `SECTION_NOUN_PLURAL` and
      the page copy constants
- [x] Fixture reproduces the eight rows the frame draws, across four target groups
      (`Course settings` / two `book-open-01` items / one `file-check-02` exam), covering:
      **update** (`Sep 30, 2026 → Dec 31, 2026`), **add** (`None → Created`),
      **remove** (question card → `None`), and **question update** (two question cards whose
      settings differ — `Scores: 2 points → 1 point`, `AI Tutoring: Off → On`)
- [x] At least two rows whose values are **unchanged**, so "hide unchanged" is provably exercised
- [x] An `emptyPublishPreview` fixture (`hasChanges: false`, no changes) exists for the empty state
- [x] Section roster fixture: two sections, one synced, one drifted

**Verification:**
- [x] `pnpm build` typechecks
- [x] Manual: `diff` the type file against the MathGPT original — only the inlined `CourseStatus` and the
      clearly-marked playground additions differ

**Dependencies:** None
**Files likely touched:**
- `app/mathgpt-port/types/master-child.ts`
- `app/mathgpt-port/constants/master-child.ts`
- `app/mathgpt-port/mocks/data/master-child.ts`
- `app/mathgpt-port/PORT-NOTES.md`

**Estimated scope:** M

---

### Task 3: Rebuild the shared display components

**Description:** `SyncStateBadge`, `SectionIdentityCard`, `PublishOutcomeList` — same names, same props,
bodies rewritten on this repo's components. These serve variant A and the roster.

**Acceptance criteria:**
- [x] Prop types match the MathGPT originals exactly, `hideOutcomes` included
- [x] `PublishOutcomeList` groups by `targetLabel`, sorts `targetType === 'course'` first, and collapses
      `SKIPPED` + `REFUSED` into one **Skipped** badge — the reason string is the only thing that
      distinguishes them (load-bearing; see the comment in the original)
- [x] `hideOutcomes` hides both the badge and the reason column
- [x] Group icons render — lucide equivalents of `settings-01` / `book-open-01` / `file-check-02`,
      shared with Task 6 so both variants group identically

**Verification:**
- [x] Manual: rendered against the Task 2 fixture, groups and badges match the MathGPT original

**Dependencies:** Task 2
**Files likely touched:**
- `app/mathgpt-port/components/Common/SyncStateBadge/sync-state-badge.tsx`
- `app/mathgpt-port/components/Common/SectionIdentityCard/section-identity-card.tsx`
- `app/mathgpt-port/components/Common/PublishOutcomeList/publish-outcome-list.tsx`
- `app/mathgpt-port/components/Common/target-icons.tsx`

**Estimated scope:** S

---

### Checkpoint: Foundation
- [x] `pnpm build` clean
- [x] Types are a faithful copy; the three playground additions are the only deltas and are labelled
- [x] Fixture reproduces all eight frame rows plus unchanged rows

---

## Phase 2: Surface + the shipped dialog (variant A)

### Task 4: Route, playground card, nav entry, page shell with the banner

**Description:** Make the surface reachable and give the "View changes" button somewhere to live:
`StagedChangesCallout` plus a short section roster.

**Acceptance criteria:**
- [x] `route("master-child-review-changes", "routes/playground/master-child-review-changes.tsx")` added
      inside the existing `playground` children in `app/routes.ts`
- [x] A second card in `app/routes/playground/index.tsx`, **below** Table + change modal, naming what it
      demonstrates; the grid is already `sm:grid-cols-2`, no layout change needed
- [x] A nav item under "Ported screens" in `app/lib/playground-nav.tsx`
- [x] `StagedChangesCallout` renders with the shipped copy — *"**Updates detected** — You have staged N
      changes. Would you like to apply them to all your sections?"* — and **three** buttons:
      Publish now / View changes / Dismiss. Both first buttons open the same dialog, per the comment in
      the original; the frame's two-button version is the older draft
- [x] Dismissed state renders the information message from the original
- [x] A short roster below it: section name, instructor, `SyncStateBadge`

**Verification:**
- [x] Manual: `pnpm dev` — the card appears on `/playground`, the nav item highlights, the route renders
- [x] Manual: `View changes` is keyboard-reachable and fires

**Dependencies:** Tasks 2, 3
**Files likely touched:**
- `app/routes.ts`
- `app/routes/playground/index.tsx`
- `app/routes/playground/master-child-review-changes.tsx`
- `app/lib/playground-nav.tsx`
- `app/mathgpt-port/components/Authenticated/CourseDetails/MasterChild/staged-changes-callout.tsx`

**Estimated scope:** M

---

### Task 5: `ReviewChangesModal` variant A — the as-built list body

**Description:** Rebuild the shipped dialog on this repo's `Dialog`: header, staged-count sentence, the
warning message with **View details**, the per-section breakdown behind it, and the Cancel / Publish now
footer.

**Acceptance criteria:**
- [x] Props are `{ onModalClose, courseId }` — the MathGPT signature
- [x] Body de-duplicates rows by `targetKind-targetId-settingKey`, so one master edit across four
      sections counts **once** (mirrors `ReviewChangesModal.tsx:44-57`)
- [x] Staged-count sentence pluralises correctly and uses `SECTION_NOUN_PLURAL.toLowerCase()`
- [x] When any row is not `LANDED`, the warning message shows with a **View details** button; clicking it
      swaps the body to per-section blocks (`SectionIdentityCard` + `PublishOutcomeList`) with a
      `← Back` footer
- [x] Main body uses `<PublishOutcomeList hideOutcomes />`; the breakdown uses it **with** outcomes
- [x] **Publish now** is disabled when `!preview.hasChanges`, and shows a *Publishing...* label while the
      simulated publish runs
- [x] A local `FooterType` enum carries the MathGPT member names

**Verification:**
- [x] Manual: open → main body → View details → Back → Cancel; no focus loss, Esc closes
- [x] Manual: with `emptyPublishPreview`, Publish now is disabled

**Dependencies:** Task 4
**Files likely touched:**
- `app/mathgpt-port/components/Modals/MasterChild/review-changes-modal.tsx`
- `app/mathgpt-port/components/Common/modals.tsx`
- `app/routes/playground/master-child-review-changes.tsx`

**Estimated scope:** M

---

### Checkpoint: Variant A renders
- [x] `pnpm build` clean, no console errors
- [x] Dialog opens, both body modes reachable, focus trapped, Esc closes
- [x] Structure matches `mathgpt_app`'s source — names, sections, footer

---

## Phase 3: The designed dialog (variant B)

### Task 6: `ChangeDiffTable` — the `ITEM | CURRENT | NEW` table with group rows

**Description:** The table frame `45938:34995` draws. Structure only — cell *contents* are Task 7.

**Acceptance criteria:**
- [x] Sticky header row: `ITEM` / `CURRENT` / `NEW`, uppercase, `Text 12/Semibold`-ish
- [x] Column grid follows the frame: `240px | 1fr | 24px (→) | 1fr` with thin vertical rules; the `→`
      sits in its own column between the two value columns, vertically aligned to the first line
- [x] **Group header rows** — icon + target name on a tinted band — one per `targetLabel`, in
      `PublishOutcomeList`'s order (course settings first, then API order). Reuses `target-icons.tsx`
      from Task 3, so both variants group identically
- [x] Rows render `changeLabel` in the ITEM column (*Updated course name*, *Added new*,
      *Removed question #2*, *Updated question #16*, *Added new questions*)
- [x] A row whose `previousValue` equals `nextValue` is hidden — asserted against the unchanged fixture
      rows from Task 2
- [x] A group with no visible rows renders no group header
- [x] **No outcome badges in this table** — matches the frame and the shipped `hideOutcomes`
- [x] Rows align to the top, not the middle, so a tall question cell does not centre its scalar sibling
- [x] The table scrolls horizontally inside its own container below the design width; the page never
      scrolls horizontally

**Verification:**
- [x] Manual: side-by-side against `figma-45938-34995-review-changes-collapsed.png` — group order, row
      order and column proportions match
- [x] Manual at 320 / 768 / 1024 / 1440

**Dependencies:** Tasks 2, 3
**Files likely touched:**
- `app/mathgpt-port/components/Common/ChangeDiffTable/change-diff-table.tsx`

**Estimated scope:** M

---

### Task 7: `DiffValueCell` + `QuestionDiffCard` — polymorphic cells with expand/collapse

**Description:** The part no existing component covers. `DiffValueCell` dispatches on `DiffValue.kind`;
`QuestionDiffCard` renders the question snapshot the frames draw. Presentational and faked — no
MathQuill, no MathLive, no real question components (plan Decision 7).

**Acceptance criteria:**
- [x] `DiffValueCell` renders `kind: 'scalar'` as one line; a `null` text renders **italic gray *None***,
      never blank. *Created* uses the same italic treatment
- [x] `kind: 'question'` renders `QuestionDiffCard`: stem, lettered answer options with radios, the green
      *Student answer* pill on the marked option, an *Explanation* chip, and a **Question settings**
      panel listing AI Tutoring / AI step-by-step grading / Scores / Max attempts / Type
- [x] Collapsed by default with a fade over the truncation and an **↓ Expand** button; expanded shows
      **↑ Collapse** (frame `45938:35275`)
- [x] **The two sides expand independently** — expanding CURRENT must not expand NEW
- [x] Inline math renders as styled text (serif/italic), clearly not a live editor
- [x] Expand/Collapse is a real `<button>` with `aria-expanded` and an accessible name naming its side
      (e.g. "Expand current value")
- [x] Adding a third `DiffValue.kind` would not require editing `ChangeDiffTable`

**Verification:**
- [x] Manual: against `figma-45938-35275-review-changes-expanded.png`, the expanded card shows the
      settings panel and the two sides differ in `Scores` and `AI Tutoring`
- [x] Manual: expand one side, confirm the other stays collapsed and the row grows without breaking
      alignment

**Dependencies:** Task 6
**Files likely touched:**
- `app/mathgpt-port/components/Common/ChangeDiffTable/diff-value-cell.tsx`
- `app/mathgpt-port/components/Common/ChangeDiffTable/question-diff-card.tsx`

**Estimated scope:** M

---

### Task 8: Wire variant B into `ReviewChangesModal` behind the variant switch

**Description:** `ReviewChangesModal` takes `bodyVariant: 'list' | 'diff-table'`; the page carries a
segmented control. Same fixture, same header, same footer — only the body changes.

**Acceptance criteria:**
- [x] Segmented control: **As built (list)** / **As designed (diff table)**, defaulting to as-built so
      the control is noticed
- [x] Switching the variant and reopening changes only the body; staged count, warning message,
      breakdown and footer behave identically in both
- [x] The **View details** breakdown is unchanged by the variant — it is per-section, out of scope
- [x] The dialog widens for the diff-table variant (the frame is 1392px) and stays `medium` for the list
- [x] A short on-page note names what differs and why it matters

**Verification:**
- [x] Manual: open both variants back to back; nothing but the body and width differs

**Dependencies:** Tasks 5, 7
**Files likely touched:**
- `app/mathgpt-port/components/Modals/MasterChild/review-changes-modal.tsx`
- `app/routes/playground/master-child-review-changes.tsx`

**Estimated scope:** S

---

### Checkpoint: Both variants comparable side by side
- [x] `pnpm build` clean
- [x] One page, one button, two bodies, one fixture — the comparison is honest
- [x] The `DiffValue` extension is visible on the page as an open question

---

## Phase 4: States, a11y, write-up

### Task 9: State matrix toggles

**Description:** Expose every state the shipped dialog has as a page-level toggle, since there is no
network to produce them.

**Acceptance criteria:**
- [x] Toggles for **loading** (spinner body), **load failed** (*"The staged changes could not be loaded.
      Please try again."*), **nothing staged** (`hasChanges: false`, Publish disabled), **partial** (some
      rows not landing → warning + breakdown), **publishing** (footer loading, dialog not closable —
      `closable={!isPublishing}` in the original), **publish error** (the negative message from the
      original)
- [x] Copy for each state is taken verbatim from `ReviewChangesModal.tsx`
- [x] Each state is reachable in both body variants

**Verification:**
- [x] Manual: walk all six states in both variants; nothing crashes, nothing renders blank

**Dependencies:** Task 8
**Files likely touched:**
- `app/routes/playground/master-child-review-changes.tsx`
- `app/mathgpt-port/components/Modals/MasterChild/review-changes-modal.tsx`

**Estimated scope:** S

---

### Task 10: a11y + responsive pass, and the on-page note

**Description:** WCAG 2.1 AA on the new surface, responsive check, and the paragraph that tells a reader
what the card is arguing.

**Acceptance criteria:**
- [x] Dialog: focus moves in on open, is trapped, returns to the trigger on close; Esc closes when
      `closable`; the title is the accessible name
- [x] The diff table is a real `<table>` (or correct ARIA grid roles) so CURRENT / NEW are announced as
      column headers, and group header rows are announced as row-group headings
- [x] The current/new distinction survives without colour — the `→` and the column headers carry it;
      verified by checking headers alone
- [x] Every control ≥24×24px; text contrast ≥4.5:1
- [x] Renders at 320 / 768 / 1024 / 1440; the table scrolls in its own container, the page does not
- [x] On-page note states: what MathGPT ships today, what the design specifies, and that
      `PublishChangeRow` carries no CURRENT/NEW values — so the contract would need `previousValue` /
      `nextValue`, with the question snapshot the larger ask (plan open question 2)
- [x] `app/mathgpt-port/PORT-NOTES.md` records what was copied, what was rewritten, what was invented,
      and the Figma nodes each screen came from

**Verification:**
- [x] Manual keyboard-only pass: reach and operate every control, including both Expand buttons
- [x] `pnpm build` clean

**Dependencies:** Task 9
**Files likely touched:**
- `app/routes/playground/master-child-review-changes.tsx`
- `app/mathgpt-port/components/Common/ChangeDiffTable/*`
- `app/mathgpt-port/PORT-NOTES.md`

**Estimated scope:** S

---

### Checkpoint: Complete
- [x] All acceptance criteria met
- [x] Variant B matches `figma-45938-34995-review-changes-collapsed.png` in structure
- [x] `pnpm build` clean, no console errors on the route
- [x] Ready for review

---

## Verification log — 2026-09-09

Run against `pnpm dev` (localhost:9002) in Chrome via DevTools MCP, on the built surface.

| Check | Result |
|---|---|
| `pnpm typecheck` | Clean for all new code. Three errors remain in `app/components/ui/input.tsx`, `app/components/ui/select.tsx`, `vite.config.ts` — **pre-existing**, confirmed by re-running against a stashed baseline |
| `pnpm build` | Succeeds |
| Console on the route | No errors, no warnings |
| Variant A (list) | Renders the shipped flat list; same groups, `medium` width |
| Variant B (diff table) | Matches frame `45938:34995`: group rows, `→` column, italic *None* / *Created* |
| Unchanged rows hidden | ✅ `Updated late submission penalty` and `Updated attempts allowed` absent from both variants |
| Staged count | 9, derived — callout and dialog always agree (see below) |
| Group dedup | One row per master edit despite two sections' worth of API rows |
| View details breakdown | Section card + outcomes; `SKIPPED` and `REFUSED` both render **Skipped** with distinct reasons |
| Independent expand | Expanding CURRENT leaves NEW collapsed ✅ |
| States | `partial` warning ✅ · `clean` no warning ✅ · `loading` spinner ✅ · `load-failed` copy, no table ✅ · `empty` "0 changes", Publish disabled ✅ · `publishing` no close X, "Publishing…", **Escape blocked** ✅ · `publish-error` warning + error alert ✅ |
| Dismissed callout | Renders the information message ✅ |
| Focus | Moves into the dialog on open; **returns to the trigger on close** in both variants ✅ |
| Tab order | Close → View details → Expand ×4 → Cancel → Publish now |
| Tap targets | 8/8 ≥24×24 |
| Contrast | 134 text nodes measured, **0 below 4.5:1**, lowest 4.61 |
| Sticky header | Container scrolled 264px, `thead` held at the same viewport top ✅ |
| Horizontal scroll | At 666px viewport: page does **not** scroll horizontally; the table scroller does (860 > 613) ✅ |

### Defects found and fixed during verification

1. **Staged count counted hidden rows** — the sentence said 11 while 9 rows rendered. Both bodies now
   read one `changedStaged` list, and the callout derives its number from the same rule
   (`stagedChangeCount`), so page, sentence and rows cannot disagree.
2. **Sticky header never stuck** — `sticky` resolves against the nearest scrolling ancestor, and the
   `overflow-x-auto` wrapper was already one (a computed `overflow-y: auto` comes with it) but had no
   height bound. The wrapper is now `max-h-[60vh] overflow-auto`.
3. **Focus was not restored on close** — the dialog is unmounted rather than closed, so the browser's
   native restore never fires. `Modal` now remembers the trigger and refocuses it on unmount, captured
   **during the first render**: the child `<Dialog>` calls `showModal()` in its own effect, and child
   effects run before the parent's, so an effect-based capture already reads a focus inside the dialog.
4. **Contrast 4.14:1** on the `ITEM` / `CURRENT` / `NEW` headers and the answer-letter chips — under AA,
   and the headers are the non-colour cue carrying the current/new distinction. Moved to
   `text-foreground`.
5. **"View details" was 19px tall.** WCAG 2.2 SC 2.5.8 exempts targets inline in a sentence, but the
   padding costs nothing, so it now clears 24px outright.

### Caveat

The 320px breakpoint was not directly reachable — the browser window would not go below a 666px
viewport. The behaviour that matters there (page never scrolls horizontally; the table scrolls inside
its own container) was verified at that narrowest reachable width, where the table already overflows
its container by 247px. Not the same as an observed 320px render.
