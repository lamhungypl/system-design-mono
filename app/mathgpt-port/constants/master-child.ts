/**
 * PORT: `mathgpt_app/src/constants/masterChild.ts`, copied verbatim, plus the copy the Review
 * changes dialog needs (which lives inline in `ReviewChangesModal.tsx` upstream).
 */

// The product noun for a linked course. The Figma says "Child course"; decision D2 renames it to
// "Section" everywhere in the UI, so no screen spells either literal itself.
export const SECTION_NOUN = "Section"
export const SECTION_NOUN_PLURAL = "Sections"

export const MASTER_TAB_TITLE = "Master"
export const MASTER_PAGE_HEADING = "Master management"

// Verbatim from frame 45680:7385.
export const MASTER_PAGE_SUPPORTING_TEXT =
  "This feature only supports Canvas LMS. Other LMSs, such as Blackboard, Brightspace, and Moodle, will be supported soon."

// PROVISIONAL COPY — the frame still reads "Section description...".
export const SECTION_ROSTER_DESCRIPTION =
  "Courses created from this master by a section instructor."

/**
 * PORT: strings that live inline in `ReviewChangesModal.tsx` / `StagedChangesCallout.tsx` upstream,
 * lifted here so the two body variants provably render the same copy.
 *
 * Note on "sections" vs "child courses": Figma frame 45938:34995 shows BOTH — the visible layer reads
 * "…to all child courses.", and a hidden sibling layer (45938:34999) reads "…to all sections.".
 * Decision D2 settles it in favour of Section, which is also what the shipping code emits. The visible
 * frame text is the older draft. Not a conflict.
 */
export const REVIEW_CHANGES_TITLE = "Review changes"

export const reviewChangesIntro = (stagedCount: number) =>
  `You have staged ${stagedCount} change${stagedCount === 1 ? "" : "s"}. Review them before publishing to all ${SECTION_NOUN_PLURAL.toLowerCase()}.`

export const REVIEW_CHANGES_LOAD_FAILED =
  "The staged changes could not be loaded. Please try again."

export const REVIEW_CHANGES_PUBLISH_FAILED =
  "The changes could not be published. Nothing was lost — please try again."

export const reviewChangesNotLandingWarning = () =>
  `Some items could not be synced across all ${SECTION_NOUN_PLURAL.toLowerCase()}.`

export const reviewChangesBreakdownIntro = () =>
  `Some items could not be synced across all ${SECTION_NOUN_PLURAL.toLowerCase()} for the reasons listed below:`

export const REVIEW_CHANGES_PUBLISH_SUCCESS = "Published changes successfully."

export const stagedChangesCalloutBody = (stagedCount: number) =>
  `You have staged ${stagedCount} change${stagedCount === 1 ? "" : "s"}. Would you like to apply them to all your ${SECTION_NOUN_PLURAL.toLowerCase()}?`

export const STAGED_CHANGES_CALLOUT_DISMISSED = `You can still view changes and deploy on the Course Settings → ${MASTER_PAGE_HEADING} later.`

/** Column headers of the diff table — verbatim from frame 45938:34995. */
export const DIFF_TABLE_HEADERS = {
  item: "ITEM",
  current: "CURRENT",
  next: "NEW",
} as const

/** The italic placeholders the frame uses for an absent value on either side. */
export const DIFF_VALUE_NONE = "None"
