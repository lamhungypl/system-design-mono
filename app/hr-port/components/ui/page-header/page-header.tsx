import { HTMLProps } from "react"

import { cn } from "~/hr-port/utils/style"

const PageHeader = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className={cn("flex items-center py-2 pr-[26px] pl-8", className)}
  ></div>
)

export type PageHeaderTitleProps = {
  step?: number
} & HTMLProps<HTMLDivElement>

PageHeader.Title = ({
  step,
  className,
  children,
  ...props
}: PageHeaderTitleProps) => (
  <div
    {...props}
    className={cn(
      "flex min-h-9 flex-1 items-center text-2xl font-bold text-primary",
      className
    )}
  >
    {step !== undefined && (
      <div className="mr-[10px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-[#FFFFFF]">
        {step}
      </div>
    )}
    {children}
  </div>
)

PageHeader.Actions = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div {...props} className={cn(className)} />
)

export default PageHeader
