import { DIFF_VALUE_NONE } from "~/mathgpt-port/constants/master-child"
import type { DiffValue } from "~/mathgpt-port/types/master-child"

import QuestionDiffCard from "./question-diff-card"

/**
 * Renderer registry for one side of a diff row.
 *
 * The table never inspects a value's shape — it hands the whole `DiffValue` here and this file
 * decides how to draw it. Adding a third kind (a rubric, a file, an ordering) must not require
 * touching `ChangeDiffTable` (plan Decision 6).
 */
type DiffValueCellProps = {
  value: DiffValue
  /** Names the side for screen readers, e.g. "current value" / "new value". */
  sideLabel: string
}

export default function DiffValueCell({ value, sideLabel }: DiffValueCellProps) {
  if (value.kind === "question") {
    return <QuestionDiffCard question={value.question} sideLabel={sideLabel} />
  }

  // An absent value is drawn as an italic placeholder, never as an empty cell — the frame uses this
  // for both sides of an add ("None" → "Created") and a remove (content → "None").
  if (value.text === null) {
    return (
      <span className="text-sm text-muted-foreground italic">
        {DIFF_VALUE_NONE}
      </span>
    )
  }

  // "Created" is the frame's other italic placeholder — a state, not a value.
  const isPlaceholder = value.text === "Created"

  return (
    <span
      className={
        isPlaceholder
          ? "text-sm text-muted-foreground italic"
          : "text-sm break-words text-foreground"
      }
    >
      {value.text}
    </span>
  )
}
