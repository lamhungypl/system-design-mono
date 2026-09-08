"use client"

import { useEffect } from "react"

/* ------------------------------------------------------------------ */
/* Primitives — styled with the app's design tokens (Tailwind v4)      */
/* ------------------------------------------------------------------ */

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <section className="deck-slide flex min-h-screen snap-start flex-col justify-center px-6 py-20 md:px-12">
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold tracking-[0.14em] text-primary uppercase">
      <span className="h-0.5 w-6 rounded bg-primary" />
      {children}
    </p>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  )
}

const toneMap = {
  default: "border border-border bg-card text-foreground",
  primary: "bg-primary/10 text-primary",
  good: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  warn: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  crit: "bg-red-500/12 text-red-600 dark:text-red-400",
} as const

function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode
  tone?: keyof typeof toneMap
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-[0.03em] ${toneMap[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

const numToneMap = {
  default: "text-foreground",
  primary: "text-primary",
  good: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  crit: "text-red-600 dark:text-red-400",
} as const

function Stat({
  num,
  tone = "default",
  label,
  sub,
}: {
  num: string
  tone?: keyof typeof numToneMap
  label: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div
        className={`font-mono text-[clamp(28px,4vw,44px)] leading-none font-bold tracking-tight tabular-nums ${numToneMap[tone]}`}
      >
        {num}
      </div>
      <div className="mt-2.5 text-[13.5px] leading-snug text-muted-foreground">
        {label}
      </div>
      {sub && (
        <div className="mt-1.5 font-mono text-[11px] text-muted-foreground/80">
          {sub}
        </div>
      )}
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        {k}
      </span>
      <span className="text-[14.5px] text-muted-foreground">{v}</span>
    </div>
  )
}

/* Mockup shell */
function Mock({
  title,
  right,
  children,
}: {
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <i className="block h-2 w-2 rounded-full bg-border" />
          <i className="block h-2 w-2 rounded-full bg-border" />
          <i className="block h-2 w-2 rounded-full bg-border" />
        </span>
        <span className="ml-1 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          {title}
        </span>
        <span className="ml-auto">{right ?? <span className="text-muted-foreground">✕</span>}</span>
      </div>
      {children}
    </div>
  )
}

/* Slider-style dimension row for the review mockup */
function DimRow({
  name,
  conf,
  ai,
  value,
  good = false,
  binary = false,
}: {
  name: string
  conf: "hi" | "md" | "lo"
  ai: number
  value: number
  good?: boolean
  binary?: boolean
}) {
  const confMap = {
    hi: ["High", "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"],
    md: ["Medium", "bg-amber-500/15 text-amber-600 dark:text-amber-400"],
    lo: ["Low", "bg-red-500/12 text-red-600 dark:text-red-400"],
  } as const
  const fill = good ? "bg-emerald-500" : "bg-primary"
  return (
    <div className="border-b border-dashed border-border py-2.5 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{name}</span>
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${confMap[conf][1]}`}
        >
          AI · {confMap[conf][0]}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
          ◆ AI {ai}
        </span>
        <div className="relative h-1.5 flex-1 rounded-full bg-muted">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
            style={{ width: `${value}%` }}
          />
          <div
            className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card ${fill}`}
            style={{ left: `${value}%` }}
          />
        </div>
        <span
          className={`min-w-[52px] rounded-lg border px-2 py-1 text-center font-mono text-[12.5px] font-bold tabular-nums ${
            good
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : binary
                ? "border-red-500 text-red-600 dark:text-red-400"
                : "border-border"
          }`}
        >
          {value}%
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Deck                                                                */
/* ------------------------------------------------------------------ */

export function meta() {
  return [
    { title: "Step-by-Step Grader — MathGPT Product Deck" },
    {
      name: "description",
      content:
        "Product presentation for the MathGPT Step-by-Step Grader PRD (release step-by-step-grader-v6).",
    },
  ]
}

export default function StepByStepGraderDeck() {
  useEffect(() => {
    const slides = Array.from(
      document.querySelectorAll<HTMLElement>(".deck-slide"),
    )
    const counter = document.getElementById("deck-counter")
    const progress = document.getElementById("deck-progress")
    const pad = (n: number) => (n < 10 ? "0" : "") + n
    const total = slides.length

    const current = () => {
      const mid = window.innerHeight / 2
      let best = 0
      let bd = Infinity
      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bd) {
          bd = d
          best = i
        }
      })
      return best
    }
    const update = () => {
      if (counter) counter.textContent = `${pad(current() + 1)} / ${pad(total)}`
      if (progress) {
        const sc =
          window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight || 1)
        progress.style.width = `${sc * 100}%`
      }
    }
    const go = (d: number) => {
      const i = Math.min(Math.max(current() + d, 0), total - 1)
      slides[i].scrollIntoView({ behavior: "smooth", block: "start" })
    }
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault()
        go(1)
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault()
        go(-1)
      } else if (e.key === "Home") {
        e.preventDefault()
        slides[0].scrollIntoView({ behavior: "smooth" })
      } else if (e.key === "End") {
        e.preventDefault()
        slides[total - 1].scrollIntoView({ behavior: "smooth" })
      }
    }
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    document.addEventListener("keydown", onKey)
    update()
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  const toggleTheme = () =>
    document.documentElement.classList.toggle("dark")

  return (
    <div className="relative min-h-screen snap-y snap-proximity scroll-smooth bg-background font-sans text-foreground">
      {/* fixed chrome */}
      <div className="fixed top-5 left-6 z-50 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
        <span className="h-2.5 w-2.5 rounded bg-primary ring-4 ring-primary/15" />
        MathGPT · Step-by-Step Grader
      </div>
      <div className="fixed top-4 right-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase hover:border-primary hover:text-primary"
        >
          Theme
        </button>
        <span
          id="deck-counter"
          className="font-mono text-[11.5px] tracking-[0.08em] text-muted-foreground tabular-nums"
        >
          01 / 18
        </span>
      </div>
      <div
        id="deck-progress"
        className="fixed bottom-0 left-0 z-50 h-[3px] w-0 bg-primary transition-[width] duration-200"
      />
      <div className="fixed right-6 bottom-4 z-50 hidden font-mono text-[11px] text-muted-foreground/70 md:block">
        ↑ ↓ / ← → to navigate
      </div>

      {/* 01 TITLE */}
      <Slide>
        <Eyebrow>PRD · Release step-by-step-grader-v6 · P0 · XL</Eyebrow>
        <h1 className="text-[clamp(38px,6vw,72px)] leading-[1.05] font-extrabold tracking-tight text-balance">
          Grade the reasoning,
          <br />
          not just the answer.
        </h1>
        <p className="mt-6 max-w-[62ch] text-[clamp(17px,1.7vw,21px)] leading-relaxed text-muted-foreground">
          AI-assisted grading of handwritten college math on four fixed
          dimensions —{" "}
          <b className="text-foreground">
            scored by AI, held by default, reviewed and released by the
            instructor.
          </b>{" "}
          A combination no shipped college-math platform offers.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          <Stat num="4" tone="primary" label="fixed grading dimensions, scored independently" />
          <Stat num="0.4%" label="of assignments use show-your-work today" />
          <Stat num="30%+" tone="good" label="adoption target within 2 months of rollout" />
          <Stat num="Q3 '26" label="targeted production release" />
        </div>
        <Note>
          Owner: Dhruv Kumar · Validated by a 16-member Faculty Advisory Council
          (prototype review 2026-05-26) · Brownfield extension of the
          capture→score→edit spine
        </Note>
      </Slide>

      {/* 02 PROBLEM */}
      <Slide>
        <Eyebrow>The problem · G1</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          Grading reasoning by hand doesn't scale — so instructors stop asking
          for it.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          A single class of detailed work can take multiple days. Instructors
          shorten assignments, leave "show your work" off, and hand-grade case
          by case — which gives identical reasoning different scores. Students
          get a flat right/wrong verdict with no partial credit.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          <Stat num="0.4%" tone="crit" label="of educator assignments enable show-your-work" sub="122 / 29,994 · 180 days · live prod" />
          <Stat num="9" tone="crit" label="manual partial-credit edits, out of 620 submissions" sub="appetite exists, stays one-at-a-time" />
          <Stat num="days" label="grading window per assignment, across sections" sub="~27.6 min work-time proxy / submission" />
          <Stat num="7–41%" tone="warn" label="of problems AI marks confidently wrong (literature)" sub="the reason review is mandatory" />
        </div>
        <Note>
          Adoption lever: show-work is required on graded &amp; quiz/test work,
          not homework — that's where partial-credit demand concentrates.
        </Note>
      </Slide>

      {/* 03 VOICE OF CUSTOMER */}
      <Slide>
        <Eyebrow>Voice of the instructor</Eyebrow>
        <div className="border-l-[3px] border-primary pl-5">
          <p className="text-[clamp(20px,2.4vw,30px)] leading-[1.35] font-semibold tracking-tight text-balance">
            "A 'huge help', especially for classes of 40 — partial credit and
            step-by-step feedback matter most."
            <span className="mt-5 block font-mono text-sm font-semibold tracking-[0.02em] text-primary">
              — Zsolt Lengvarszky · Dept Chair, LSU Shreveport
            </span>
          </p>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold">"That's more important to me."</h3>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Partial credit on handwritten work — "a really good feature I'd
              never seen before."
            </p>
            <Note>Chaitanya Mistry · SUNY Ulster</Note>
          </Card>
          <Card>
            <h3 className="text-lg font-bold">
              "Would strongly motivate me to adopt."
            </h3>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              The step-by-step AI grader named as a primary adoption driver.
            </p>
            <Note>Alia Khurram · Wayne State University</Note>
          </Card>
        </div>
        <p className="mt-6 max-w-[70ch] text-[clamp(15px,1.5vw,18px)] leading-relaxed text-muted-foreground">
          The Faculty Advisory Council asked for a{" "}
          <b className="text-foreground">percentage scale</b> (Khasanova,
          Overton), <b className="text-foreground">subject-specific weighting</b>{" "}
          (Wickham), and{" "}
          <b className="text-foreground">department-level rubric locking</b> as a
          prerequisite for institutional adoption (Pilon, v1.1).
        </p>
      </Slide>

      {/* 04 WHITE SPACE */}
      <Slide>
        <Eyebrow>Strategic context · G10</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          The defensible edge is one intersection no competitor closes.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          Not "first to AI partial credit" (false) and not "only class
          analytics" (Ed.ai has a form). The edge is three properties together,
          inside an embedded college-math platform:
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card>
            <Pill tone="primary">Safeguard</Pill>
            <h3 className="mt-3 text-lg font-bold">
              Mandatory review-before-release
            </h3>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Every AI grade is held by default. Nothing reaches a student until
              the instructor Confirms.
            </p>
          </Card>
          <Card>
            <Pill tone="primary">Insight</Pill>
            <h3 className="mt-3 text-lg font-bold">
              Class-wide knowledge-gap analytics
            </h3>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              "63% of the class lost calculation accuracy on this problem" — per
              dimension, per assignment.
            </p>
          </Card>
          <Card>
            <Pill tone="primary">Gate</Pill>
            <h3 className="mt-3 text-lg font-bold">
              Upstream unreadable-upload gate
            </h3>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Blurry, blank, or corrupt files are caught inline before grading
              ever begins.
            </p>
          </Card>
        </div>
        <Note>
          Demand is roadmap-committed and repeatedly validated across
          institutional sales demos.
        </Note>
      </Slide>

      {/* 05 COMPETITIVE TABLE */}
      <Slide>
        <Eyebrow>Competitive landscape</Eyebrow>
        <h2 className="mb-6 text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight">
          Capability by capability.
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-muted">
                {["Capability", "Gradescope", "Pensieve", "Ed.ai", "MathGPT today", "MathGPT proposed"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`border-b border-border px-3.5 py-2.5 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase ${
                        i === 5 ? "bg-primary/10" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[
                ["Handwriting OCR", "Yes", "Yes", "Yes", "Stored, ungraded", "Yes"],
                ["Step-level AI partial credit", "Batch grouping", "Per step", "Per step", "Binary verdict", "0–100%, 4 dims"],
                ["Mandatory review-before-release", "Manual", "Auto-releases", "Yes", "Manual window", "The DEFAULT"],
                ["Class-wide step-error analytics", "Question-level", "Not documented", "Class patterns", "No", "Per dim / assignment"],
                ["Unreadable-upload gate", "No", "No", "No", "No", "Readability + OCR"],
                ["Segment", "Higher-ed, all", "K-12 + STEM", "High school", "College math", "College math (embedded)"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`border-b border-border/60 px-3.5 py-2.5 ${
                        ci === 0 ? "font-medium" : ""
                      } ${ci === 5 ? "bg-primary/10 font-semibold" : "text-muted-foreground"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note>
          Also assessed: GradeWithAI, Crowdmark, RevisionDojo, MyOpenMath,
          GradingPal. MathGPT adopts Pensieve's AI-draft rubric model — but the
          rubric is table stakes, not the differentiator.
        </Note>
      </Slide>

      {/* 06 SOLUTION SPINE */}
      <Slide>
        <Eyebrow>Solution overview · G3a</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          The whole feature is one spine — plus the fork that matters.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          The AI does the first pass; the instructor reviews and releases;
          released results feed class-wide analytics. The instructor-set
          show-work mode decides{" "}
          <b className="text-foreground">where the student uploads</b>.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["01", "Instructor enables", "Sets mode + weights; excludes questions"],
            ["02", "Student uploads work", "Per-question or per-assignment · ≤10 files"],
            ["03", "Readability gate", "Inline at upload — bad files loop back"],
            ["04", "AI scores 4 dims", "Binary answer + 3 continuous · reads all files"],
            ["05", "Grade held", "Pending instructor review"],
            ["06", "Review & release", "Adjust any dim 0–100%, comment, Confirm"],
            ["07", "Student scorecard", "Per-dimension verdict + comment"],
            ["08", "Class analytics", "Released scores → Assignment Summary"],
          ].map(([n, t, d]) => (
            <div
              key={n}
              className={`rounded-xl border bg-card p-3.5 ${
                n === "06" ? "border-emerald-500/60" : "border-border"
              }`}
            >
              <div
                className={`font-mono text-[11px] font-bold ${
                  n === "06" ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                }`}
              >
                {n}
              </div>
              <div className="mt-1.5 text-[13.5px] leading-tight font-semibold">
                {t}
              </div>
              <div className="mt-1 text-[12px] leading-snug text-muted-foreground">
                {d}
              </div>
            </div>
          ))}
        </div>
        <Note>
          After release, a student can request a per-dimension regrade with a
          reason → returns to instructor review.
        </Note>
      </Slide>

      {/* 07 FOUR DIMENSIONS */}
      <Slide>
        <Eyebrow>The core mechanic</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          Four fixed dimensions. No rubric to author.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          The instructor sets only the weights (sum 100%, default 40/20/20/20).
          Every problem is scored on the same four dimensions, each
          independently.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Pill>Binary · 0/100%</Pill>
            <h3 className="mt-3 text-base font-bold">Final-answer correctness</h3>
            <p className="mt-2 text-[14px] text-muted-foreground">
              Read from the typed answer box. Shown work overrides when the two
              disagree and the work is correct.
            </p>
          </Card>
          {[
            ["Steps shown", "Are the necessary solution steps present, with logical progression? Not a fixed step list."],
            ["Conceptual understanding", "Does the student demonstrate understanding of the approach?"],
            ["Calculation accuracy", "Were the calculations carried out correctly throughout?"],
          ].map(([t, d]) => (
            <Card key={t}>
              <Pill tone="primary">0–100%</Pill>
              <h3 className="mt-3 text-base font-bold">{t}</h3>
              <p className="mt-2 text-[14px] text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-dashed bg-muted">
          <p className="text-[14.5px] text-muted-foreground">
            <b className="text-foreground">
              Worked example — "Evaluate ∫ 2x dx", correct work but "+ C"
              missing:
            </b>{" "}
            final-answer correctness scores{" "}
            <span className="font-mono text-red-600 dark:text-red-400">0%</span>{" "}
            (binary), while steps / concept / calculation score{" "}
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              high
            </span>
            . Substantial credit for correct method — and the instructor can
            still set any dimension to the exact percentage the work deserves.
          </p>
        </Card>
      </Slide>

      {/* 08 SCORER */}
      <Slide>
        <Eyebrow>Grading engine</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          A two-layer scorer bounds the confident-wrong risk.
        </h2>
        <div className="mt-7 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
          <div className="grid gap-3.5">
            <Card>
              <Pill>Layer 1</Pill>
              <h3 className="mt-2.5 text-lg font-bold">
                Deterministic math rules — first
              </h3>
              <p className="mt-2 text-[14.5px] text-muted-foreground">
                Exact where rules are exact: final-answer match, routine algebra.
                Cheap and reliable.
              </p>
            </Card>
            <Card>
              <Pill tone="primary">Layer 2</Pill>
              <h3 className="mt-2.5 text-lg font-bold">
                AI grading service — fallback
              </h3>
              <p className="mt-2 text-[14.5px] text-muted-foreground">
                Everything else. Every verdict carries a per-dimension confidence
                score.
              </p>
            </Card>
          </div>
          <Card className="bg-muted">
            <h3 className="text-lg font-bold">Why not single-layer?</h3>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              <span className="mr-1.5 font-bold text-red-600 dark:text-red-400">✕</span>
              AI-only → unacceptable false-positive risk (7–41% confident-wrong).
            </p>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              <span className="mr-1.5 font-bold text-red-600 dark:text-red-400">✕</span>
              Rules-only → coverage collapses without a fallback.
            </p>
            <hr className="my-4 border-border" />
            <h3 className="text-lg font-bold">Three backstops</h3>
            {[
              "Rules exact where they're cheap and reliable.",
              "G4 POC gate: zero confident-green on introduced errors.",
              "Mandatory review-before-release is the human backstop.",
            ].map((t) => (
              <p key={t} className="mt-2 text-[13.5px] text-muted-foreground">
                <span className="mr-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  ✓
                </span>
                {t}
              </p>
            ))}
          </Card>
        </div>
        <Note>
          A 16-scenario grading matrix enumerates every meets / does-not
          combination — the specification for the G4 grading prompt.
        </Note>
      </Slide>

      {/* 09 CONTROL */}
      <Slide>
        <Eyebrow>The safeguard</Eyebrow>
        <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          Instructor stays in control. Held by default.
        </h2>
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            ["Held → pending review", 'Every AI-suggested grade is HELD. Students see "pending review" until the instructor releases.'],
            ["Adjust to any value", "Per-dimension slider (0–100) + numeric % input, pre-filled with the AI score. The instructor's value is authoritative."],
            ["Opt-in auto-approve", "High-confidence work can release automatically — default 95% on every dimension. Low-confidence is always held."],
          ].map(([t, d]) => (
            <Card key={t}>
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-2 text-[14.5px] text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          <Stat num="<2 min" tone="good" label="grading time per submission (target)" />
          <Stat num="80%+" tone="good" label="AI verdicts retained without edit (target)" />
          <Stat num="Confirm" label="= release · per submission · atomic (all 4 or none)" />
          <Stat num="Audit" tone="primary" label="every override, reopen & threshold change logged (FERPA)" />
        </div>
      </Slide>

      {/* 10 UI: REVIEW MODAL S-I5 */}
      <Slide>
        <Eyebrow>UI · S-I5 — instructor review &amp; release modal</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <div>
            <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
              Review, adjust, Confirm.
            </h2>
            <p className="mt-4 text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
              A full-screen overlay over the Submissions tab. Four dimension rows
              in fixed order, each pre-filled with the AI value and a confidence
              badge. Confirm is the single release — no separate publish button.
            </p>
            <div className="mt-6 grid gap-3">
              <KV k="Controls" v="Continuous slider + numeric % input, independent per dimension (no sum-to-100)" />
              <KV k="Confidence bucket" v="High ≥90 · Medium 50–89 · Low ≤49 — text label is the non-color cue" />
              <KV k="A11y" v="role=dialog, focus trap, ESC close, ≥44×44 targets, arrow-key ±1" />
            </div>
          </div>
          <Mock title="Review submission · Anya R.">
            <div className="p-4">
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">
                QUESTION 4 · Solve for x: 2x² − 8 = 0
              </p>
              <div className="flex min-h-[110px] items-center justify-center rounded-lg border border-dashed border-border bg-muted [font-family:cursive] text-[15px] leading-loose text-muted-foreground">
                x² = 4&nbsp;&nbsp; x = ±2
              </div>
              <div className="mt-3.5">
                <DimRow name="Final Answer" conf="hi" ai={100} value={100} binary />
                <DimRow name="Steps Shown" conf="md" ai={75} value={75} />
                <DimRow name="Conceptual Understanding" conf="hi" ai={90} value={90} />
                <DimRow name="Calculation Accuracy" conf="lo" ai={62} value={100} good />
              </div>
              <div className="mt-3.5 flex items-center gap-2.5">
                <Pill>
                  Weighted total <b className="text-foreground">92%</b>
                </Pill>
                <Pill tone="good">Saved ✓</Pill>
                <span className="ml-auto rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground">
                  Confirm &amp; release
                </span>
              </div>
            </div>
          </Mock>
        </div>
        <Note>
          Instructor raised Calculation Accuracy 62%→100% for a small arithmetic
          slip. Grade visible in-app immediately on Confirm; email is a batched
          per-assignment digest.
        </Note>
      </Slide>

      {/* 11 UI: S-I14 */}
      <Slide>
        <Eyebrow>UI · S-I14 — per-question grade review modal</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <Mock
            title="Per-question review mode"
            right={<span className="text-muted-foreground">✕</span>}
          >
            <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5">
              <span className="font-mono text-[11px]">‹ QUESTION 2/6 ›</span>
              <Pill tone="warn" className="ml-auto">
                Pending review (11)
              </Pill>
              <Pill tone="good">Graded (8)</Pill>
            </div>
            <div className="grid gap-2.5 p-4">
              {[
                ["AR", "Anya Rao", "Score 9 of 10 · 4 dims", "lo", "Calc · Low", false],
                ["JL", "Jordan Lee", "Score 10 of 10 · 4 dims", "hi", "All · High", false],
              ].map(([in_, name, meta, conf, tag]) => (
                <div
                  key={name as string}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3"
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                      conf === "hi"
                        ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {in_}
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold">{name}</div>
                    <div className="font-mono text-[10.5px] text-muted-foreground">
                      {meta}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-semibold ${
                      conf === "hi"
                        ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/12 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {tag}
                  </span>
                  <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white">
                    Mark graded
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 opacity-60">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted text-[12px] font-bold text-muted-foreground">
                  MP
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">Maya Patel</div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">
                    No work submitted
                  </div>
                </div>
                <Pill>Pending</Pill>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  2 of 11 selected
                </span>
                <span className="ml-auto rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground">
                  Mark all selected as graded
                </span>
              </div>
            </div>
          </Mock>
          <div>
            <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
              Grade the class, one question at a time.
            </h2>
            <p className="mt-4 text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
              Opens from the Submissions-tab "Confidence auto-approve" banner.
              One question across every student, paged with prev/next.
              Consistency by construction.
            </p>
            <div className="mt-6 grid gap-3">
              <KV k="Per card" v='Student work + four-dimension review panel + "Mark as graded"' />
              <KV k="Bulk" v='"Mark all selected" = N independent atomic per-submission releases' />
              <KV k="Hard constraint" v="Every write goes through the single S-I5 release path, audit trail & RECEIVED-count" />
            </div>
          </div>
        </div>
        <Note>
          Excluded, no-work, and rejected-upload questions carry non-color labels
          in the list. Filter counts update live as submissions are marked
          graded.
        </Note>
      </Slide>

      {/* 12 UI: STUDENT SCORECARD S-S4 */}
      <Slide>
        <Eyebrow>UI · S-S4 — released per-dimension scorecard (student)</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <div>
            <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
              Not a flat red mark — a scorecard.
            </h2>
            <p className="mt-4 text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
              On release the student sees each dimension's earned %, the
              configured weight beside its name, the instructor comment
              (math-rendered), and the weighted total. They can request a
              per-dimension regrade with a reason.
            </p>
            <div className="mt-6 grid gap-3">
              <KV k="Transparent" v="Shows the exact weights that determined the score" />
              <KV k="Glance-readable" v="Non-color cues + plain-English comments — parents/coaches can read it" />
              <KV k="Manual total" v="A typed override keeps the scorecard visible with a declared marker — never silent" />
            </div>
          </div>
          <Mock title="Graded by Mr. Park" right={<Pill tone="good">Released</Pill>}>
            <div className="p-4">
              {[
                ["Final-Answer Correctness", "40%", "100%", "\"Correct — nice.\"", true],
                ["Steps Shown", "20%", "85%", "\"Show the factoring step next time.\"", false],
                ["Conceptual Understanding", "20%", "90%", "No comment added", false],
                ["Calculation Accuracy", "20%", "100%", "\"Adjusted — your arithmetic was fine.\"", true],
              ].map(([name, w, pct, cmt, green]) => (
                <div
                  key={name as string}
                  className="border-b border-dashed border-border py-2.5 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">
                      {name}{" "}
                      <span className="font-mono font-normal text-muted-foreground">
                        — {w}
                      </span>
                    </span>
                    <span
                      className={`min-w-[52px] rounded-lg border px-2 py-1 text-center font-mono text-[12.5px] font-bold tabular-nums ${
                        green
                          ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "border-border"
                      }`}
                    >
                      {pct}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {cmt}
                  </div>
                </div>
              ))}
              <div className="mt-3.5 flex items-center">
                <span className="font-bold">Weighted total</span>
                <span className="ml-auto font-mono text-[22px] font-bold text-emerald-600 dark:text-emerald-400">
                  95%
                </span>
              </div>
              <span className="mt-3 block w-full rounded-lg border border-border py-2 text-center text-[13px] font-semibold">
                Request re-grade
              </span>
            </div>
          </Mock>
        </div>
        <Note>
          Email arrives as one per-assignment digest per student — never one
          email per Confirm — so a class working through review doesn't bombard
          the student.
        </Note>
      </Slide>

      {/* 13 UI: UPLOAD + GATE */}
      <Slide>
        <Eyebrow>UI · S-S1 / S-S7 — upload &amp; inline readability gate</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <Mock title="Show your work · Question 4" right={<span />}>
            <div className="p-4">
              <div className="rounded-xl border border-dashed border-border bg-muted p-4 text-center">
                <p className="font-mono text-[11px] text-muted-foreground">
                  Drop files · jpg/png/heic/pdf/doc · up to 10 · 10 MB each
                </p>
              </div>
              <div className="mt-3 flex gap-2.5">
                <div className="flex min-h-[90px] flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted [font-family:cursive] text-[12px] text-muted-foreground">
                  ∫2x dx = x²+C
                </div>
                <div className="grid flex-1 content-start gap-2">
                  {[
                    ["good", "✓ Readable", "page1.jpg"],
                    ["primary", "◍ Checking…", "page2.jpg"],
                    ["crit", "⚠ Blurry", "page3.jpg"],
                  ].map(([tone, label, file]) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2"
                    >
                      <Pill tone={tone as "good" | "primary" | "crit"}>
                        {label}
                      </Pill>
                      <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3.5 border-l-[3px] border-emerald-500 pl-4">
                <p className="text-[13px] text-muted-foreground">
                  <b className="text-foreground">Work received</b> — grading will
                  begin shortly.
                </p>
              </div>
            </div>
          </Mock>
          <div>
            <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
              Caught at the door, never silently blocked.
            </h2>
            <p className="mt-4 text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
              The readability check fires inline on the upload field the moment a
              file lands — a spinner, then a checkmark or a specific reason. No
              separate screen.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Blurry", "Blank", "Unreadable", "Corrupt / encrypted", "Extraction failed"].map(
                (r) => (
                  <Pill key={r} tone="crit">
                    {r}
                  </Pill>
                ),
              )}
            </div>
            <div className="mt-6 grid gap-3">
              <KV k="Two modes" v="Per-question (inside each question) or per-assignment (one show-work step)" />
              <KV k="When it scores" v="Only on Submit — never at gate-accept" />
              <KV k="Readability only" v="No topical judgment · <5% false-reject guardrail" />
            </div>
          </div>
        </div>
      </Slide>

      {/* 14 UI: ANALYTICS S-I9 */}
      <Slide>
        <Eyebrow>UI · S-I9 — Assignment Summary (Overview tab)</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <div>
            <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
              See which dimension the class struggled with.
            </h2>
            <p className="mt-4 text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
              Per-dimension average mastery across released scores, plus a
              per-learning-objective roll-up and a plain-language AI narrative of
              the top misconceptions.
            </p>
            <div className="mt-6 grid gap-3">
              <KV k="Released-only" v="Held / unreleased work excluded at the data layer" />
              <KV k="AI summary" v='At most the 3 lowest-mastery LOs · non-color "AI summary" provenance label' />
              <KV k="Scoped" v="Own course only · student work treated as untrusted, escaped input" />
            </div>
          </div>
          <Mock title="Result overview" right={<span />}>
            <div className="flex gap-0.5 border-b border-border bg-card px-3.5">
              {["Overview", "Submissions", "Question list", "Settings"].map(
                (t, i) => (
                  <span
                    key={t}
                    className={`border-b-2 px-3 py-2.5 font-mono text-[11px] ${
                      i === 0
                        ? "border-primary font-bold text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
            <div className="p-4">
              <p className="mb-3 font-mono text-[11px] text-muted-foreground">
                AVERAGE MASTERY BY DIMENSION
              </p>
              <div className="flex h-[190px] items-end gap-4 px-1.5">
                {[
                  ["Final\nAnswer", 96, false],
                  ["Steps\nShown", 81, false],
                  ["Concept", 78, false],
                  ["Calc\nAccuracy", 63, true],
                ].map(([k, v, low]) => (
                  <div
                    key={k as string}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span
                      className={`font-mono text-[13px] font-bold tabular-nums ${
                        low ? "text-red-600 dark:text-red-400" : ""
                      }`}
                    >
                      {v}%
                    </span>
                    <div
                      className={`w-full rounded-t-lg ${
                        low
                          ? "bg-gradient-to-b from-red-500 to-red-400"
                          : "bg-gradient-to-b from-primary to-primary/60"
                      }`}
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-center text-[11px] leading-tight whitespace-pre-line text-muted-foreground">
                      {k}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-l-[3px] border-primary pl-4">
                <Pill tone="primary" className="mb-1.5">
                  AI summary
                </Pill>
                <p className="text-[13px] text-muted-foreground">
                  63% of the class lost calculation accuracy on quadratic
                  factoring — arithmetic slips in the final step dominate.
                </p>
              </div>
            </div>
          </Mock>
        </div>
        <Note>
          Four peer tabs (fb-24 SD-38): Overview · Submissions · Question list ·
          Settings. Overview is the default, statistics-only.
        </Note>
      </Slide>

      {/* 15 PERSONAS */}
      <Slide>
        <Eyebrow>Target users · G2</Eyebrow>
        <h2 className="mb-6 text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight">
          Four people, one release.
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            ["Student", "The Stuck Student", '"I did the work but I don\'t know how I\'ll be graded." Wants a clear per-dimension breakdown instead of a flat "incorrect."'],
            ["Instructor", "The Partial-Credit Advocate", '"A small slip shouldn\'t tank a student who understood the problem." Wants to set any dimension to the exact % deserved — fast.'],
            ["Instructor", "The Toggle-Conscious Instructor", '"Let AI do the first pass and let me edit before students see it." Won\'t let a grade reach a student unreviewed.'],
            ["Buyer", "The Institutional Buyer (Chair)", '"It has to grade the same way across every section before we adopt." Wants consistency, reviewability, and department-level locking (v1.1).'],
          ].map(([tag, t, d]) => (
            <Card key={t}>
              <Pill tone="primary">{tag}</Pill>
              <h3 className="mt-2.5 text-lg font-bold">{t}</h3>
              <p className="mt-2 text-[14.5px] text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </Slide>

      {/* 16 NARRATIVE */}
      <Slide>
        <Eyebrow>A Tuesday night with Anya</Eyebrow>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <p className="text-[clamp(20px,2.4vw,30px)] leading-[1.35] font-semibold tracking-tight text-balance">
            Six quadratic problems. Twenty-eight minutes of work, photographed at
            the show-work step. Each file checks inline — spinner, checkmark.
            Status:{" "}
            <span className="text-amber-600 dark:text-amber-400">
              pending review
            </span>
            .
          </p>
          <p className="text-[clamp(20px,2.4vw,30px)] leading-[1.35] font-semibold tracking-tight text-balance">
            Wednesday 7:15 AM, Mr. Park works 19 pending submissions question by
            question. One arithmetic slip:{" "}
            <span className="font-mono">62% → 100%</span>. By 7:38 —{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              23 minutes
            </span>{" "}
            — all 19 released.
          </p>
        </div>
        <hr className="my-6 border-border" />
        <p className="text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          7:39 AM, walking to school, Anya gets the notification: four checks,{" "}
          <b className="text-foreground">100 out of 100</b>. Last semester, the
          same chapter meant four hours of red pen and a two-day wait.
        </p>
      </Slide>

      {/* 17 METRICS */}
      <Slide>
        <Eyebrow>Success metrics</Eyebrow>
        <h2 className="mb-6 text-[clamp(28px,3.6vw,46px)] font-bold tracking-tight text-balance">
          Baselines sourced. Targets provisional to the pilot gates (G7).
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-muted">
                {["What we're measuring", "Baseline", "Target"].map((h, i) => (
                  <th
                    key={h}
                    className={`border-b border-border px-3.5 py-2.5 text-left font-mono text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase ${
                      i === 2 ? "bg-primary/10" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Handwritten-work adoption across assignments", "0.4% (live prod, 2026-06-01)", "30%+ within 2 months"],
                ["Instructor grading time per submission", "Multi-day; ~27.6 min proxy", "Under 2 minutes"],
                ["AI per-dimension verdicts retained (no edit)", "n/a (9 of 620 today)", "80%+ retained"],
                ["Image-rejection false-positives", "n/a — new metric", "Under 5%"],
                ["Work-extraction accuracy (handwritten set)", "n/a — new metric", "85%+"],
                ["Assignment Summary weekly usage (adopters)", "n/a — new metric", "50%+ weekly"],
              ].map((row) => (
                <tr key={row[0]}>
                  <td className="border-b border-border/60 px-3.5 py-2.5 font-medium">
                    {row[0]}
                  </td>
                  <td className="border-b border-border/60 px-3.5 py-2.5 text-muted-foreground">
                    {row[1]}
                  </td>
                  <td className="border-b border-border/60 bg-primary/10 px-3.5 py-2.5 font-semibold">
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Slide>

      {/* 18 RISKS + ROADMAP + CLOSE */}
      <Slide>
        <Eyebrow>Risks · roadmap · what ships</Eyebrow>
        <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2">
          <div>
            <h3 className="mb-3.5 text-xl font-bold">Top risks &amp; mitigations</h3>
            <div className="grid gap-2.5">
              {[
                ["Extraction accuracy on diverse handwriting", "image-quality gate + QA benchmark set + review window."],
                ["Confident-but-wrong AI scores", "math-rules layer + G4 POC gate (zero confident-green on errors) + human backstop."],
                ["Auto-approve releasing a wrong grade", "opt-in only, low confidence always held, role-gated + audited threshold."],
                ["Partial release / half-released grades", "per-submission atomic release, all four dimensions or none."],
              ].map(([t, d]) => (
                <Card key={t} className="p-3.5">
                  <p className="text-[13.5px] text-muted-foreground">
                    <b className="text-foreground">{t}</b> — {d}
                  </p>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3.5 text-xl font-bold">v1 ships · v1.1 defers</h3>
            <Card className="bg-muted">
              <p className="font-mono text-[11px] tracking-[0.06em] text-primary">
                V1 — BUILDING
              </p>
              <p className="mt-2 text-[13.5px] text-muted-foreground">
                Work-file upload (both modes) · readability gate · OCR → step
                extraction · two-layer scorer · four dimensions · per-dimension
                override · review queue · mandatory review-before-release ·
                comments · pending status · assignment-owned weights · exclusion ·
                class analytics · LO summary · accessibility.
              </p>
              <hr className="my-4 border-border" />
              <p className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
                V1.1 — DEFERRED (9)
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground/80">
                Reusable weighting presets · department weight-lock · carry-through
                credit · AI-handwriting flag · duplicate-work flag · proof support
                · correct-step suggestion · gradebook roll-up · answer-grouping +
                apply-to-group.
              </p>
            </Card>
          </div>
        </div>
        <hr className="my-6 border-border" />
        <p className="text-[clamp(16px,1.6vw,20px)] leading-relaxed text-muted-foreground">
          Grading that took hours now takes minutes —{" "}
          <b className="text-foreground">
            consistently, every student, every time.
          </b>
        </p>
        <Note>
          Brownfield extension · Owner Dhruv Kumar · UI grounded in the G3a lo-fi
          wireframes (S-I1–S-I14, S-S1–S-S7).
        </Note>
      </Slide>
    </div>
  )
}
