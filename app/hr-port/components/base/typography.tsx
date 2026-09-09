// src/components/typography.tsx

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "~/hr-port/utils/style"

// Define variants for the typography component
const typographyVariants = cva("text-black dark:text-white", {
  variants: {
    variant: {
      h1: "text-4xl leading-tight font-bold",
      h2: "text-3xl leading-snug font-semibold",
      h3: "text-2xl leading-snug font-medium",
      h4: "text-xl leading-normal font-medium",
      h5: "text-lg leading-relaxed font-semibold",
      h6: "text-base leading-relaxed font-medium",
      paragraph: "text-base leading-relaxed font-normal text-primary",
      small: "text-sm leading-snug font-normal",
      blockquote:
        "border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-600",
      code: "rounded bg-gray-200 px-2 py-1 font-mono text-sm dark:bg-gray-700",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted",
      destructive: "text-destructive",
      success: "text-green-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
  },
  defaultVariants: {
    variant: "paragraph",
    color: "primary",
  },
})

// Interface for Typography component props
interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode
  className?: string
}

// Typography component
const Typography: React.FC<TypographyProps> = ({
  variant,
  color,
  children,
  className,
}) => {
  return (
    <span className={cn(typographyVariants({ variant, color }), className)}>
      {children}
    </span>
  )
}

export default Typography
