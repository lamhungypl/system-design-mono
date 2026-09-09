import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Check } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Avatar, AvatarImage } from "~/hr-port/components/base/avatar"
import { Separator } from "~/hr-port/components/base/separator"
import AppInput from "~/hr-port/components/ui/app-input/app-input"
import { SelectOption } from "~/hr-port/types/common"
import { cn } from "~/hr-port/utils/style"

import {
  MAX_HEIGHT,
  select_all_option_value,
  SHOW_SEARCH_THRESHOLD,
} from "./constants"

export type AppSelectOptionListProps<T extends SelectOption> = {
  onClickOption?: (value: string, option: T) => void
  options: T[]
  showSelectAllOption?: boolean
} & (SingleMode | MultipleMode)

export type SingleMode = {
  mode: "single"
  selected?: string
}

export type MultipleMode = {
  mode: "multiple"
  selected?: string[]
}

export default function AppSelectOptionList<T extends SelectOption>(
  props: AppSelectOptionListProps<T>
) {
  const { t } = useTranslation()
  const { showSelectAllOption = props.mode === "multiple", onClickOption } =
    props
  const [searchText, setSearchText] = useState("")

  const optionsWithSelectAllOption = useMemo(() => {
    if (!showSelectAllOption || props.options.length === 0) return props.options

    const selectAllOption = {
      label: t("common.select_option.all"),
      value: select_all_option_value,
    } as T

    return [selectAllOption, ...props.options]
  }, [props.options, t, showSelectAllOption])

  const filteredOptions = useMemo(() => {
    return optionsWithSelectAllOption.filter((option) => {
      const isHidden = !!option.hidden
      const isMatch = option.label
        .toLowerCase()
        .includes(searchText.trim().toLowerCase())
      return !isHidden && isMatch
    })
  }, [optionsWithSelectAllOption, searchText])

  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 5,
    paddingStart: 4,
    paddingEnd: 4,
  })

  const height = Math.min(virtualizer.getTotalSize(), MAX_HEIGHT)
  const virtualItems = virtualizer.getVirtualItems()

  const [focusedIndex, setFocusedIndex] = useState(0)

  const selectedValueMap: Record<string, true> = useMemo(() => {
    if (props.mode === "single") {
      if (!props.selected) return { [select_all_option_value]: true }
      return { [props.selected]: true }
    } else {
      if (!props.selected) return {}
      const result = props.selected.reduce(
        (prev, curr) => {
          prev[curr] = true
          return prev
        },
        {} as Record<string, true>
      )

      const isAllSelected = props.options.every(
        (option) => result[option.value]
      )

      if (isAllSelected) {
        result[select_all_option_value] = true
      }

      return result
    }
  }, [props.mode, props.selected, props.options])

  const navigationMode = useRef<"keyboard" | "pointer">("keyboard")

  const focusToIndex = useCallback(
    (
      index: number,
      options?: Parameters<typeof virtualizer.scrollToIndex>[1]
    ) => {
      setFocusedIndex(index)
      virtualizer.scrollToIndex(index, options)
    },
    [virtualizer]
  )

  useEffect(() => {
    const onPointerMove = () => {
      navigationMode.current = "pointer"
    }

    const onKeyDown = (e: KeyboardEvent) => {
      navigationMode.current = "keyboard"
      const key = e.key
      switch (key) {
        case "ArrowUp": {
          focusToIndex(
            (focusedIndex + filteredOptions.length - 1) % filteredOptions.length
          )
          break
        }
        case "ArrowDown": {
          focusToIndex((focusedIndex + 1) % filteredOptions.length)
          break
        }
        case "Enter": {
          const option = filteredOptions[focusedIndex]
          if (option) {
            onClickOption?.(option.value, option)
          }
          break
        }
      }
    }

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [focusToIndex, filteredOptions, onClickOption, focusedIndex])

  useEffect(() => {
    if (props.mode === "single" && props.selected) {
      const selectedOption = props.options.findIndex(
        (option) => option.value === props.selected
      )
      if (selectedOption !== -1) {
        focusToIndex(selectedOption, { align: "center" })
      }
    }
  }, [props.mode, props.selected, props.options, focusToIndex])

  const showSearch = useMemo(() => {
    return optionsWithSelectAllOption.length > SHOW_SEARCH_THRESHOLD
  }, [optionsWithSelectAllOption])

  return (
    <div className={cn("overflow-hidden text-left text-xs")}>
      {showSearch && (
        <>
          <AppInput
            placeholder={t("common.placeholder.search")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<MagnifyingGlassIcon />}
            className={cn("border-none focus-visible:ring-0")}
            onKeyDown={(e) => {
              const isNavigationKey = [
                "ArrowUp",
                "ArrowDown",
                "Enter",
              ].includes(e.key)
              if (isNavigationKey) return
              setTimeout(() => {
                focusToIndex(0)
              }, 0)
            }}
          />
          <Separator />
        </>
      )}

      {filteredOptions.length === 0 && (
        <div className="flex min-h-8 items-center gap-2 rounded-sm px-3 pt-1.5">
          {t("common.select_option.not_found")}
        </div>
      )}
      <div
        className={cn(
          "min-w-[150px] overflow-x-hidden overflow-y-auto contain-strict"
        )}
        style={{ height }}
        ref={scrollRef}
        data-testid="option-list"
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
            className="px-1"
          >
            {virtualItems.map((virtualRow) => {
              const option = filteredOptions[virtualRow.index]

              return (
                <div
                  key={virtualRow.key}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                  data-value={option.value}
                  data-selected={focusedIndex === virtualRow.index}
                  data-testid="option-list-item"
                  className={cn(
                    "flex min-h-8 items-center gap-2 rounded-sm px-2 py-1.5",
                    "data-[selected=true]:bg-accent"
                  )}
                  onPointerMove={() => {
                    if (navigationMode.current === "pointer") {
                      setFocusedIndex(virtualRow.index)
                    }
                  }}
                  onClick={() => onClickOption?.(option.value, option)}
                >
                  <div className="flex flex-1 items-center gap-2">
                    {option.label}
                    {option.icon_file_path && (
                      <Avatar className="h-5 w-5 flex-shrink-0 rounded-[1px]">
                        <AvatarImage
                          src={option.icon_file_path}
                          alt={option.label}
                          className="object-cover"
                        />
                      </Avatar>
                    )}
                  </div>

                  <Check
                    className={cn("invisible shrink-0 text-primary", {
                      visible: selectedValueMap[option.value],
                    })}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
