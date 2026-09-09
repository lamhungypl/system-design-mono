/**
 * PORT: adapted from `mathgpt_app/src/mocks/data/masterChild.ts`.
 *
 * Static fixtures — no MSW, no query layer (plan Decision 3). The change rows reproduce the eight
 * staged changes drawn in Figma frame 45938:34995, extended with the `previousValue` / `nextValue`
 * pair the diff table needs and the API does not emit.
 *
 * Upstream the API returns ONE ROW PER SECTION PER SETTING — the same master edit lands four times
 * for four sections. `ReviewChangesModal` de-duplicates back to master edits before listing them.
 * `expandAcrossSections` below reproduces that shape so the de-duplication is actually exercised
 * rather than assumed.
 */

import {
  CourseStatus,
  PublishOutcome,
  SectionSyncStatus,
  SettingTargetKind,
  deriveSectionSyncStatus,
  isDiffValueUnchanged,
  type DiffValue,
  type MasterDesignation,
  type PublishAccepted,
  type PublishChangeValueRow,
  type PublishValuePreview,
  type QuestionDiffPayload,
  type SectionList,
} from "~/mathgpt-port/types/master-child"

const MASTER_COURSE_ID = 1
const SECTION_A_ID = 101
const SECTION_B_ID = 102

// ---------------------------------------------------------------------------------------------
// Question payloads — from frame 45938:35275 (the expanded state, where the detail is legible).
//
// NOTE: the collapsed frame draws question #16's stem as `12x³ + 18x²` while the expanded frame
// draws `4x² + 18x`. The draft disagrees with itself; the expanded values are used here because
// that frame is the one that shows the settings panel this fixture has to fill.
// ---------------------------------------------------------------------------------------------

const removedQuestion: QuestionDiffPayload = {
  stem: "To factor the quadratic expression x² - 9x + 8, we look for two numbers that multiply to 8 and add up to -9. The factors of 8 that add up to −9 are −1 and −8. So we can factor the expression as: x² - 9x + 8 = (x − 1)(x − 8) The factored form is: (x − 1)(x − 8)",
  options: [],
  hasExplanation: false,
  settings: {
    aiTutoring: "Off",
    aiStepByStepGrading: "Off",
    scores: "1 point",
    maxAttempts: "1",
    type: "Fill in the blank",
  },
}

const question16Current: QuestionDiffPayload = {
  stem: "Find the greatest common factor (GCF) of the polynomial: 4x² + 18x",
  options: [
    { letter: "A", text: "6xy(2x + 3y)", isSelected: true, isStudentAnswer: true },
    { letter: "B", text: "No solution" },
  ],
  hasExplanation: true,
  settings: {
    aiTutoring: "Off",
    aiStepByStepGrading: "On",
    scores: "2 points",
    maxAttempts: "1",
    type: "Multiple choice",
  },
}

const question16Next: QuestionDiffPayload = {
  stem: "Find the greatest common factor (GCF) of the polynomial: 4x² + 18x",
  options: [
    { letter: "A", text: "6xy(2x + 3y)", isSelected: true, isStudentAnswer: true },
    { letter: "B", text: "No solution" },
    { letter: "C", text: "Infinite number of solutions" },
  ],
  hasExplanation: true,
  settings: {
    aiTutoring: "On",
    aiStepByStepGrading: "On",
    scores: "1 point",
    maxAttempts: "1",
    type: "Multiple choice",
  },
}

const addedQuestion: QuestionDiffPayload = {
  stem: "Find the greatest common factor (GCF) of the polynomial: 12x³ + 18x²",
  options: [
    { letter: "A", text: "6xy(2x + 3y)", isSelected: true },
    { letter: "B", text: "No solution" },
    { letter: "C", text: "Infinite number of solutions" },
  ],
  hasExplanation: false,
  settings: {
    aiTutoring: "On",
    aiStepByStepGrading: "On",
    scores: "1 point",
    maxAttempts: "1",
    type: "Multiple choice",
  },
}

const scalar = (text: string | null): DiffValue => ({ kind: "scalar", text })
const question = (payload: QuestionDiffPayload): DiffValue => ({
  kind: "question",
  question: payload,
})

// ---------------------------------------------------------------------------------------------
// The master's staged edits — one entry per edit, as the diff table shows them.
// ---------------------------------------------------------------------------------------------

type MasterEdit = Omit<PublishChangeValueRow, "sectionCourseId" | "outcome" | "label" | "reason" | "reasonShort">

const masterEdits: MasterEdit[] = [
  // ── Course settings (settings-01) ──────────────────────────────────────────────────────────
  {
    settingKey: "course_name",
    settingLabel: "Course name",
    changeLabel: "Updated course name",
    targetLabel: "Course settings",
    targetType: "course",
    targetKind: SettingTargetKind.COURSE,
    targetId: null,
    previousValue: scalar("Master - AP Calculus AB (Template)"),
    nextValue: scalar("AP Calculus AB"),
  },
  {
    settingKey: "course_due_date",
    settingLabel: "Due date",
    changeLabel: "Updated due date",
    targetLabel: "Course settings",
    targetType: "course",
    targetKind: SettingTargetKind.COURSE,
    targetId: null,
    previousValue: scalar("Sep 30, 2026"),
    nextValue: scalar("Dec 31, 2026"),
  },
  {
    // UNCHANGED — proves the diff table hides rows whose two sides are equal. The API would still
    // send this row; only the table decides not to draw it.
    settingKey: "late_submission_penalty",
    settingLabel: "Late submission penalty",
    changeLabel: "Updated late submission penalty",
    targetLabel: "Course settings",
    targetType: "course",
    targetKind: SettingTargetKind.COURSE,
    targetId: null,
    previousValue: scalar("10% per day"),
    nextValue: scalar("10% per day"),
  },

  // ── Real Numbers: Algebra Essentials (book-open-01) ────────────────────────────────────────
  {
    settingKey: "item_title",
    settingLabel: "Title",
    changeLabel: "Updated title",
    targetLabel: "Real Numbers: Algebra Essentials",
    targetType: "item",
    targetKind: SettingTargetKind.ITEM,
    targetId: 5001,
    previousValue: scalar("Algebra Essentials"),
    nextValue: scalar("Real Numbers: Algebra Essentials"),
  },

  // ── Simplifying Algebraic Expressions & Properties (book-open-01) ──────────────────────────
  {
    settingKey: "item_created",
    settingLabel: "Module item",
    changeLabel: "Added new",
    targetLabel: "Simplifying Algebraic Expressions & Properties",
    targetType: "item",
    targetKind: SettingTargetKind.ITEM,
    targetId: 5002,
    previousValue: scalar(null), // renders italic "None"
    nextValue: scalar("Created"),
  },
  {
    settingKey: "item_title",
    settingLabel: "Title",
    changeLabel: "Updated title",
    targetLabel: "Simplifying Algebraic Expressions & Properties",
    targetType: "item",
    targetKind: SettingTargetKind.ITEM,
    targetId: 5002,
    previousValue: scalar("Simplifying Properties"),
    nextValue: scalar("Simplifying Algebraic Expressions & Properties"),
  },

  // ── Late Final Exam Winter 2025 (file-check-02) ────────────────────────────────────────────
  {
    settingKey: "question_removed_2",
    settingLabel: "Question #2",
    changeLabel: "Removed question #2",
    targetLabel: "Late Final Exam Winter 2025",
    targetType: "exam",
    targetKind: SettingTargetKind.QUESTION,
    targetId: 7002,
    previousValue: question(removedQuestion),
    nextValue: scalar(null),
  },
  {
    settingKey: "exam_due_date",
    settingLabel: "Due date",
    changeLabel: "Updated due date",
    targetLabel: "Late Final Exam Winter 2025",
    targetType: "exam",
    targetKind: SettingTargetKind.ITEM,
    targetId: 7000,
    previousValue: scalar("Oct 15, 2026"),
    nextValue: scalar("Oct 31, 2026"),
  },
  {
    settingKey: "question_updated_16",
    settingLabel: "Question #16",
    changeLabel: "Updated question #16",
    targetLabel: "Late Final Exam Winter 2025",
    targetType: "exam",
    targetKind: SettingTargetKind.QUESTION,
    targetId: 7016,
    previousValue: question(question16Current),
    nextValue: question(question16Next),
  },
  {
    settingKey: "question_added",
    settingLabel: "Questions",
    changeLabel: "Added new questions",
    targetLabel: "Late Final Exam Winter 2025",
    targetType: "exam",
    targetKind: SettingTargetKind.QUESTION,
    targetId: 7017,
    previousValue: scalar(null),
    nextValue: question(addedQuestion),
  },
  {
    // UNCHANGED — second proof row, on a target that also has real changes.
    settingKey: "exam_max_attempts",
    settingLabel: "Attempts allowed",
    changeLabel: "Updated attempts allowed",
    targetLabel: "Late Final Exam Winter 2025",
    targetType: "exam",
    targetKind: SettingTargetKind.ITEM,
    targetId: 7000,
    previousValue: scalar("2"),
    nextValue: scalar("2"),
  },
]

/** Per-section outcome for a given edit. Anything unlisted lands cleanly on both sections. */
const perSectionOutcome: Record<
  string,
  Partial<Record<number, Pick<PublishChangeValueRow, "outcome" | "label" | "reason" | "reasonShort">>>
> = {
  exam_due_date: {
    [SECTION_B_ID]: {
      outcome: PublishOutcome.REFUSED,
      label: "Could not be applied",
      reason: "Students had already started, so this setting could not change.",
      reasonShort: "Submissions already received",
    },
  },
  question_updated_16: {
    [SECTION_B_ID]: {
      outcome: PublishOutcome.SKIPPED,
      label: "Kept the section's own setting",
      reason:
        "The section instructor had already changed this setting, so it was left as they set it.",
      reasonShort: "Overridden by instructor",
    },
  },
}

const LANDED = {
  outcome: PublishOutcome.LANDED,
  label: "Applied",
  reason: "",
  reasonShort: "",
} as const

/** Reproduces the API's one-row-per-section-per-setting shape. */
function expandAcrossSections(edits: MasterEdit[]): PublishChangeValueRow[] {
  return [SECTION_A_ID, SECTION_B_ID].flatMap((sectionCourseId) =>
    edits.map((edit) => ({
      ...edit,
      sectionCourseId,
      ...(perSectionOutcome[edit.settingKey]?.[sectionCourseId] ?? LANDED),
    }))
  )
}

// ---------------------------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------------------------

export const getPublishPreviewResponse: PublishValuePreview = {
  masterCourseId: MASTER_COURSE_ID,
  hasChanges: true,
  sections: [
    {
      sectionCourseId: SECTION_A_ID,
      name: "College Algebra - Section 01",
      instructorName: "John Smith",
      instructorEmail: "john.smith@university.edu",
      coverUrl: null,
      willApply: masterEdits.length,
      willBeKept: 0,
      willNotApply: 0,
    },
    {
      sectionCourseId: SECTION_B_ID,
      name: "College Algebra - Section 02",
      instructorName: "Sarah Okafor",
      instructorEmail: "sarah.okafor@university.edu",
      coverUrl: null,
      willApply: masterEdits.length - 2,
      willBeKept: 1,
      willNotApply: 1,
    },
  ],
  changes: expandAcrossSections(masterEdits),
}

/** Nothing staged — drives the empty state and the disabled Publish button. */
export const emptyPublishPreviewResponse: PublishValuePreview = {
  ...getPublishPreviewResponse,
  hasChanges: false,
  changes: [],
}

/** Every edit lands on every section — drives the no-warning happy path. */
export const cleanPublishPreviewResponse: PublishValuePreview = {
  ...getPublishPreviewResponse,
  changes: expandAcrossSections(masterEdits).map((row) => ({ ...row, ...LANDED })),
}

export const getSectionsResponse: SectionList = {
  masterCourseId: MASTER_COURSE_ID,
  sections: [
    {
      courseId: SECTION_A_ID,
      name: "College Algebra - Section 01",
      instructorName: "John Smith",
      instructorEmail: "john.smith@university.edu",
      syncStatus: "In sync",
      coverUrl: null,
      changedSettingCount: 0,
    },
    {
      courseId: SECTION_B_ID,
      name: "College Algebra - Section 02",
      instructorName: "Sarah Okafor",
      instructorEmail: "sarah.okafor@university.edu",
      syncStatus: "2 settings changed",
      coverUrl: null,
      changedSettingCount: 2,
    },
  ],
  canvasDriftNote:
    "Canvas tracks Blueprint drift separately. This count covers MathGPT settings only.",
  emptyReason: null,
}

export const designateAsMasterResponse: MasterDesignation = {
  courseId: MASTER_COURSE_ID,
  isMaster: true,
  status: CourseStatus.UNPUBLISHED,
}

export const publishToSectionsResponse: PublishAccepted = {
  publishBatchId: 9001,
  sectionCount: 2,
}

/**
 * How many staged changes the master actually has — deduplicated to master edits and excluding rows
 * whose two sides are identical. The callout and the dialog both read this, so the number in the
 * banner always equals the number in the dialog and the rows on screen.
 *
 * NOTE: Figma frame 45938:34995 says "8 staged changes" while drawing nine rows. The draft disagrees
 * with itself; a derived count is the only version that can't be wrong.
 */
export const stagedChangeCount = (preview: PublishValuePreview = getPublishPreviewResponse) => {
  const seen = new Set<string>()
  return preview.changes.filter((row) => {
    const key = `${row.targetKind}-${row.targetId}-${row.settingKey}`
    if (seen.has(key)) return false
    seen.add(key)
    return !isDiffValueUnchanged(row.previousValue, row.nextValue)
  }).length
}

export { deriveSectionSyncStatus, SectionSyncStatus }
