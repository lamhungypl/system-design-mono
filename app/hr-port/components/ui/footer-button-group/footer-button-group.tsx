import { Fragment, HTMLProps, PropsWithChildren, useMemo } from "react"

import { cn } from "~/hr-port/utils/style"

export type FooterButtonGroupProps = {
  hasShadow?: boolean
  takeSpace?: boolean
} & HTMLProps<HTMLDivElement>

export default function FooterButtonGroup({
  children,
  takeSpace = true,
  className,
  hasShadow = false,
  ...rest
}: FooterButtonGroupProps) {
  const Wrapper = useMemo(() => {
    if (!takeSpace) return Fragment
    return ({ children }: PropsWithChildren) => (
      <div className="h-[44px]">{children}</div>
    )
  }, [takeSpace])

  return (
    <Wrapper>
      <div
        {...rest}
        className={cn(
          "fixed bottom-0 left-0 z-50 flex h-[44px] w-full overflow-hidden rounded-t-lg bg-[#ffffff]",
          {
            "shadow-top": hasShadow,
          },
          className
        )}
      >
        {children}
      </div>
    </Wrapper>
  )
}
