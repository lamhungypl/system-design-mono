/**
 * PORT: `mathgpt_app/src/types/masterChild.ts`, copied field-for-field.
 *
 * Everything above the PLAYGROUND ADDITIONS banner is the real MathGPT schema and must stay a
 * faithful copy — this file is the join between the playground demo and the shipping app, so a
 * divergence here quietly invalidates the demo. Comments are the originals'.
 *
 * The only edit above the banner: `CourseStatus` is inlined rather than imported from
 * `constants/course`, since only one member is referenced.
 */

/** PORT: inlined from `mathgpt_app/src/constants/course`; only UNPUBLISHED is referenced here. */
export enum CourseStatus {
  UNPUBLISHED = "unpublished",
  PUBLISHED = "published",
}

/** What happened to one setting on one section during a publish.
 *
 * `skipped` and `refused` differ in permanence, not in appearance: `skipped` is a choice the section
 * instructor made and is the only one that counts as drift, while `refused` is a transient platform
 * limit that clears itself. Both render as the `Skipped` badge — only the reason distinguishes them. */
export enum PublishOutcome {
  LANDED = "landed",
  SKIPPED = "skipped",
  REFUSED = "refused",
}

/** Why the designate switch is disabled, not merely that it is. */
export enum MasterEligibilityReason {
  ELIGIBLE = "eligible",
  HAS_EVER_HAD_STUDENTS = "has_ever_had_students",
  ALREADY_A_SECTION = "already_a_section",
}

export enum SettingTargetKind {
  COURSE = "course",
  ITEM = "item",
  QUESTION = "question",
}

/** The roster badge state. Derived on the client, not sent: the API's `sync_status` is a prose
 * summary ("In sync", "3 settings changed"), which reads well beside a badge but cannot be one. */
export enum SectionSyncStatus {
  SYNCED = "synced",
  DRIFTED = "drifted",
}

export const deriveSectionSyncStatus = (changedSettingCount: number) =>
  changedSettingCount > 0 ? SectionSyncStatus.DRIFTED : SectionSyncStatus.SYNCED

export type MasterEligibility = {
  eligible: boolean
  reason: MasterEligibilityReason
}

export type MasterDesignation = {
  courseId: number
  isMaster: boolean
  // Designating forces UNPUBLISHED so the course never ends; echoed back so the FE need not refetch.
  status: CourseStatus
}

export type SectionSummary = {
  courseId: number
  name: string
  instructorName: string | null
  instructorEmail: string | null
  // Prose, already composed server-side — render it, never parse it.
  syncStatus: string
  coverUrl: string | null
  changedSettingCount: number
}

export type SectionList = {
  masterCourseId: number
  sections: SectionSummary[]
  // Canvas keeps its own Blueprint drift record, which MathGPT neither reads nor reconciles.
  canvasDriftNote: string
  // Populated only when `sections` is empty, so the FE renders a reason instead of a blank table.
  emptyReason: string | null
}

export type PublishPreviewSection = {
  sectionCourseId: number
  name: string
  instructorName: string | null
  instructorEmail: string | null
  coverUrl: string | null
  willApply: number
  willBeKept: number
  willNotApply: number
}

export type PublishChangeRow = {
  sectionCourseId: number
  settingKey: string
  settingLabel: string
  changeLabel: string
  targetLabel: string
  targetType: string
  targetKind: SettingTargetKind
  targetId: number | null
  outcome: PublishOutcome
  label: string
  reason: string
  reasonShort: string
}

export type PublishPreview = {
  masterCourseId: number
  hasChanges: boolean
  sections: PublishPreviewSection[]
  changes: PublishChangeRow[]
}

export type PublishAccepted = {
  publishBatchId: number
  sectionCount: number
}

export type PublishReport = {
  publishBatchId: number
  sectionCount: number
  sectionsFullyApplied: number
  sectionsWithSomethingNotApplied: number
  totals: Record<PublishOutcome, number>
  // Only the settings that did not land — a landed one needs no explanation and would bury these.
  changes: PublishChangeRow[]
}

export type SectionDrift = {
  sectionCourseId: number
  sectionName: string
  instructorName: string | null
  instructorEmail: string | null
  coverUrl: string | null
  changes: PublishChangeRow[]
}

export type SectionUpdates = {
  publishBatchId: number | null
  totalChanges: number
  synced: number
  skipped: number
  changes: PublishChangeRow[]
  ownedItemIds: number[]
  gradeSyncFailedItemIds: number[]
}

// ---------------------------------------------------------------------------------------------
// PLAYGROUND ADDITIONS — not in mathgpt_app. The API emits none of this.
// ---------------------------------------------------------------------------------------------

/**
 * The gap this whole demo exists to show.
 *
 * Figma frame 45938:34995 draws the Review changes dialog as an `ITEM | CURRENT | NEW` table, but
 * `PublishChangeRow` supplies only the ITEM column (`changeLabel`). There is no current value, no new
 * value, and no question payload in the response — two of the design's three columns have nothing
 * behind them.
 *
 * `DiffValue` is what the payload would have to grow to render that design. Whether the BE can emit
 * it — especially `kind: 'question'`, which is a whole question snapshot per side — is an open
 * question, not a settled contract. See tasks/2026-09-09-…-plan.md, open question 2.
 */
export type DiffValue =
  | { kind: "scalar"; text: string | null } // null renders as italic "None", never blank
  | { kind: "question"; question: QuestionDiffPayload }

/** PLAYGROUND-ONLY. One side's question snapshot, as frame 45938:35275 draws it expanded. */
export type QuestionDiffPayload = {
  stem: string
  options: QuestionDiffOption[]
  hasExplanation: boolean
  settings: QuestionDiffSettings
}

export type QuestionDiffOption = {
  letter: string
  /** Rendered as styled text, never a live math editor — see plan Decision 7. */
  text: string
  /** Drives the green "Student answer" pill. */
  isStudentAnswer?: boolean
  /** The filled radio in the frame — the keyed-correct option. */
  isSelected?: boolean
}

export type QuestionDiffSettings = {
  aiTutoring: string
  aiStepByStepGrading: string
  scores: string
  maxAttempts: string
  type: string
}

/** PLAYGROUND-ONLY. A change row carrying the two values the diff table needs. */
export type PublishChangeValueRow = PublishChangeRow & {
  previousValue: DiffValue
  nextValue: DiffValue
}

/** PLAYGROUND-ONLY. `PublishPreview` whose rows carry values. */
export type PublishValuePreview = Omit<PublishPreview, "changes"> & {
  changes: PublishChangeValueRow[]
}

/** Two `DiffValue`s are equal when they would render identically — the "hide unchanged rows" rule. */
export const isDiffValueUnchanged = (a: DiffValue, b: DiffValue): boolean => {
  if (a.kind !== b.kind) return false
  if (a.kind === "scalar" && b.kind === "scalar") return a.text === b.text
  return JSON.stringify(a) === JSON.stringify(b)
}
