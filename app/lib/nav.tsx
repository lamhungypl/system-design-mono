export const nav = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: <GridIcon /> },
      { label: "Components", href: "/components/dashboard", icon: <LayersIcon /> },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Button", href: "/components/button", icon: <ButtonIcon /> },
      { label: "Typography", href: "/components/typography", icon: <TypographyIcon /> },
      { label: "Segmented Control", href: "/components/segmented-control", icon: <ToggleIcon /> },
    ],
  },
  {
    title: "Data Entry",
    items: [
      { label: "Input", href: "/components/input", icon: <InputIcon /> },
      { label: "InputNumber", href: "/components/input-number", icon: <InputIcon /> },
      { label: "Checkbox", href: "/components/checkbox", icon: <CheckboxIcon /> },
      { label: "Radio", href: "/components/radio", icon: <RadioIcon /> },
      { label: "Switch", href: "/components/switch", icon: <ToggleIcon /> },
      { label: "Select", href: "/components/select", icon: <SelectIcon /> },
      { label: "Slider", href: "/components/slider", icon: <SliderIcon /> },
      { label: "Calendar", href: "/components/calendar", icon: <DateIcon /> },
      { label: "Date Picker", href: "/components/date-picker", icon: <DateIcon /> },
      { label: "Range Picker", href: "/components/range-picker", icon: <DateIcon /> },
      { label: "Date Range Picker", href: "/components/date-range-picker", icon: <DateIcon /> },
    ],
  },
  {
    title: "Data Display",
    items: [
      { label: "Badge", href: "/components/badge", icon: <BadgeIcon /> },
      { label: "Tag", href: "/components/tag", icon: <TagIcon /> },
      { label: "Avatar", href: "/components/avatar", icon: <AvatarIcon /> },
      { label: "Card", href: "/components/card", icon: <CardIcon /> },
      { label: "Statistic", href: "/components/statistic", icon: <StatIcon /> },
      { label: "Empty", href: "/components/empty", icon: <EmptyIcon /> },
      { label: "Skeleton", href: "/components/skeleton", icon: <SkeletonIcon /> },
      { label: "Progress", href: "/components/progress", icon: <ProgressIcon /> },
      { label: "Collapsible", href: "/components/collapsible", icon: <CollapsibleIcon /> },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Tabs", href: "/components/tabs", icon: <TabsIcon /> },
      { label: "Breadcrumb", href: "/components/breadcrumb", icon: <BreadcrumbIcon /> },
      { label: "Steps", href: "/components/steps", icon: <StepsIcon /> },
      { label: "Pagination", href: "/components/pagination", icon: <PaginationIcon /> },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Alert", href: "/components/alert", icon: <AlertIcon /> },
      { label: "Spin", href: "/components/spin", icon: <SpinIcon /> },
      { label: "Dialog", href: "/components/dialog", icon: <DialogIcon /> },
      { label: "Drawer", href: "/components/drawer", icon: <DrawerIcon /> },
      { label: "Popover", href: "/components/popover", icon: <PopoverIcon /> },
      { label: "Tooltip", href: "/components/tooltip", icon: <TooltipIcon /> },
    ],
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  )
}
function LayersIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <path d="M1.5 5.5 8 2l6.5 3.5-6.5 3.5L1.5 5.5Z" />
      <path d="M1.5 10 8 13.5 14.5 10" />
    </svg>
  )
}
function ButtonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="5" width="12" height="6" rx="1.5" />
      <path d="M5 8h6" />
    </svg>
  )
}
function TypographyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 4h12M8 4v8M5 12h6" />
    </svg>
  )
}
function ToggleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <rect x="1.5" y="4" width="13" height="8" rx="4" />
      <circle cx="10.5" cy="8" r="2.5" />
    </svg>
  )
}
function InputIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="4.5" width="12" height="7" rx="1.5" />
      <path d="M5 8h1" />
    </svg>
  )
}
function CheckboxIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
      <path d="M5 8.5L7 11l4-5" />
    </svg>
  )
}
function RadioIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function SelectIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="4.5" width="12" height="7" rx="1.5" />
      <path d="M10 8l-2 2-2-2" />
    </svg>
  )
}
function SliderIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2 8h12" />
      <circle cx="6" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
function DateIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <path d="M5 1v3M11 1v3M1.5 6.5h13" />
    </svg>
  )
}
function BadgeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
      <circle cx="11.5" cy="4.5" r="3" />
      <rect x="1.5" y="3.5" width="8" height="9" rx="1.5" />
    </svg>
  )
}
function TagIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M8.5 1.5H2.5a1 1 0 00-1 1v6l7 7 7-7-7-7Z" />
      <circle cx="5" cy="5.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function AvatarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="6" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  )
}
function CardIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M1.5 6.5h13" />
    </svg>
  )
}
function StatIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 12l3-4 3 2 3-5 3 4" />
    </svg>
  )
}
function EmptyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M6 8h4" />
    </svg>
  )
}
function SkeletonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <path d="M2 5h8M2 8h12M2 11h6" />
    </svg>
  )
}
function ProgressIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <rect x="1.5" y="6.5" width="13" height="3" rx="1.5" />
      <rect x="1.5" y="6.5" width="8" height="3" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function CollapsibleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 4h12M2 8h8M2 12h5" />
      <path d="M12 10l2 2-2 2" />
    </svg>
  )
}
function TabsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1.5 5.5h4v-3h-4v3ZM7 5.5h4v-3H7v3Z" />
      <path d="M1.5 5.5h13v8a1 1 0 01-1 1h-11a1 1 0 01-1-1v-8Z" />
    </svg>
  )
}
function BreadcrumbIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1.5 8h3M6 8h3M10.5 8h3M5 5.5l2 2.5-2 2.5M9.5 5.5l2 2.5-2 2.5" />
    </svg>
  )
}
function StepsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4.5 8h2M9.5 8h2" />
    </svg>
  )
}
function PaginationIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="5" width="3" height="6" rx="1" />
      <rect x="6.5" y="5" width="3" height="6" rx="1" fill="currentColor" stroke="none" />
      <rect x="11.5" y="5" width="3" height="6" rx="1" />
    </svg>
  )
}
function AlertIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5.5V8.5M8 11h.01" />
    </svg>
  )
}
function SpinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
      <circle cx="8" cy="8" r="5.5" strokeDasharray="3 3" />
      <path d="M8 2.5a5.5 5.5 0 015.5 5.5" />
    </svg>
  )
}
function DialogIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
      <path d="M5 9.5h6M5 7h4" />
    </svg>
  )
}
function DrawerIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" />
      <path d="M9.5 1.5v13" />
      <path d="M11.5 7l2 1-2 1" />
    </svg>
  )
}
function PopoverIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="1.5" width="12" height="8" rx="1.5" />
      <path d="M5 10.5l3 3.5 3-3.5" />
      <path d="M5 5h6M5 7h4" />
    </svg>
  )
}
function TooltipIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="3" y="1.5" width="10" height="7" rx="1.5" />
      <path d="M7 8.5l1 2 1-2" />
    </svg>
  )
}
