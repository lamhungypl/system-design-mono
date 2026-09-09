import { ChevronDown, ChevronUp, CircleCheck, Lightbulb } from "lucide-react"
import { useId, useState } from "react"

import { cn } from "~/lib/utils"
import type { QuestionDiffPayload } from "~/mathgpt-port/types/master-child"

/**
 * One side's question snapshot, as Figma frames 45938:34995 (collapsed) and 45938:35275 (expanded)
 * draw it inside a CURRENT or NEW cell.
 *
 * Presentational and faked by design (plan Decision 7): math is styled text, the answer options are
 * static markup, nothing is editable. A playground demo has no business vendoring MathQuill or the
 * real question components — the point is the *shape* of a question diff, not a working editor.
 */

type QuestionDiffCardProps = {
  question: QuestionDiffPayload
  /** Names the side in the Expand button's accessible name, e.g. "current value". */
  sideLabel: string
  className?: string
}

/** Renders the inline math the way the frame draws it — serif italic, clearly not a live editor. */
function MathText({ children }: { children: string }) {
  return <span className="font-serif italic">{children}</span>
}

/** Splits a stem on the math-ish runs the fixtures use, so they get the serif treatment. */
function Stem({ text }: { text: string }) {
  const parts = text.split(/(\d+x[²³]?(?:\s*[+\-−]\s*\d*x?[²³]?)*|x[²³]|\([^)]*x[^)]*\))/g)
  return (
    <p className="m-0 text-sm leading-relaxed text-foreground">
      {parts.map((part, i) =>
        /x/.test(part) && /[\d(]/.test(part) ? (
          <MathText key={i}>{part}</MathText>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  )
}

export default function QuestionDiffCard({
  question,
  sideLabel,
  className,
}: QuestionDiffCardProps) {
  const [expanded, setExpanded] = useState(false)
  const bodyId = useId()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        id={bodyId}
        className={cn(
          "relative flex flex-col gap-3",
          // Collapsed clips to roughly the two lines the frame shows, with a fade over the cut.
          !expanded && "max-h-24 overflow-hidden"
        )}
      >
        <Stem text={question.stem} />

        {question.options.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {question.options.map((option) => (
              <li key={option.letter} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full border",
                      option.isSelected
                        ? "border-green-600 bg-green-50 dark:bg-green-950/40"
                        : "border-border"
                    )}
                  >
                    {option.isSelected && (
                      <span className="size-2 rounded-full bg-green-600" />
                    )}
                  </span>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-medium text-foreground">
                    {option.letter}
                  </span>
                  {option.isSelected ? (
                    <span className="min-w-0 flex-1 truncate rounded-md border border-border px-2 py-1 text-sm text-muted-foreground">
                      <MathText>{option.text}</MathText>
                    </span>
                  ) : (
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {option.text}
                    </span>
                  )}
                </div>
                {option.isStudentAnswer && (
                  <span className="ml-6 inline-flex w-fit items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
                    <CircleCheck className="size-3" />
                    Student answer
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {question.hasExplanation && (
          <span className="inline-flex w-fit items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
            <Lightbulb className="size-3" />
            Explanation
          </span>
        )}

        <div className="overflow-hidden rounded-md border border-border">
          <div className="bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground">
            Question settings
          </div>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 px-3 py-2 text-xs">
            <SettingRow label="AI Tutoring:" value={question.settings.aiTutoring} />
            <SettingRow
              label="AI step-by-step grading:"
              value={question.settings.aiStepByStepGrading}
            />
            <SettingRow label="Scores:" value={question.settings.scores} />
            <SettingRow label="Max attempts:" value={question.settings.maxAttempts} />
            <SettingRow label="Type:" value={question.settings.type} />
          </dl>
        </div>

        {!expanded && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card via-card/85 to-transparent"
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={bodyId}
        className="flex h-8 w-full items-center justify-center gap-1 rounded-md bg-primary/5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {expanded ? (
          <>
            <ChevronUp className="size-3.5" />
            Collapse
          </>
        ) : (
          <>
            <ChevronDown className="size-3.5" />
            Expand
          </>
        )}
        <span className="sr-only"> {sideLabel}</span>
      </button>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="font-semibold text-foreground">{label}</dt>
      <dd className="m-0 text-muted-foreground">{value}</dd>
    </>
  )
}
