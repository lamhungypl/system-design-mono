/**
 * @see https://conf.gem-corp.tech/display/KOTASEAN/Number+of+items+display+per+page
 */
export const PER_PAGE_COUNT = 25 as const
export const INFINITE_PER_PAGE_COUNT = 50 as const

export enum COLUMN_ID {
  ACTION = "_action",
  CODE = "code",
  COMPARE_STATUS = "_compare_status",
  SELECTION = "_selection",
}

export enum STICKY_POSITION {
  LEFT = "left",
  RIGHT = "right",
}
