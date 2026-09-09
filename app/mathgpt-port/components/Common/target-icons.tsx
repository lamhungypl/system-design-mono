import { BookOpen, FileCheck2, Settings } from "lucide-react"

/**
 * The three group icons Figma frame 45938:34995 draws beside a change target, keyed by the
 * `targetType` the API sends. Upstream these are `settings-01`, `book-open-01` and `file-check-02`
 * from MathGPT's own icon set (`components/Common/Icons/*`); here they are the closest lucide
 * equivalents, since the port copies structure and naming, not artwork.
 *
 * Shared by both body variants so a target groups identically whichever one is rendering.
 */
export const TARGET_ICON = {
  course: Settings,
  exam: FileCheck2,
  item: BookOpen,
} as const

export function targetIconFor(targetType: string) {
  return TARGET_ICON[targetType as keyof typeof TARGET_ICON] || TARGET_ICON.item
}
