export const templatesNav = [
  {
    title: "Dashboard",
    items: [
      { label: "Analysis", href: "/templates/dashboard/analysis", icon: <AnalysisIcon /> },
      { label: "Workplace", href: "/templates/dashboard/workplace", icon: <WorkplaceIcon /> },
      { label: "Monitor", href: "/templates/dashboard/monitor", icon: <MonitorIcon /> },
    ],
  },
  {
    title: "Form",
    items: [
      { label: "Basic Form", href: "/templates/form/basic-form", icon: <FormIcon /> },
      { label: "Step Form", href: "/templates/form/step-form", icon: <StepFormIcon /> },
      { label: "Advanced Form", href: "/templates/form/advanced-form", icon: <FormIcon /> },
    ],
  },
  {
    title: "List",
    items: [
      { label: "Search Table", href: "/templates/list/table-list", icon: <TableIcon /> },
      { label: "Basic List", href: "/templates/list/basic-list", icon: <ListIcon /> },
      { label: "Card List", href: "/templates/list/card-list", icon: <CardIcon /> },
      { label: "Search Articles", href: "/templates/list/search/articles", icon: <ArticleIcon /> },
      { label: "Search Projects", href: "/templates/list/search/projects", icon: <ProjectIcon /> },
      { label: "Search Apps", href: "/templates/list/search/applications", icon: <AppIcon /> },
    ],
  },
  {
    title: "Profile",
    items: [
      { label: "Basic Profile", href: "/templates/profile/basic", icon: <ProfileIcon /> },
      { label: "Advanced Profile", href: "/templates/profile/advanced", icon: <ProfileIcon /> },
    ],
  },
  {
    title: "Result",
    items: [
      { label: "Success", href: "/templates/result/success", icon: <SuccessIcon /> },
      { label: "Fail", href: "/templates/result/fail", icon: <FailIcon /> },
    ],
  },
  {
    title: "Exception",
    items: [
      { label: "403", href: "/templates/exception/403", icon: <ExceptionIcon /> },
      { label: "404", href: "/templates/exception/404", icon: <ExceptionIcon /> },
      { label: "500", href: "/templates/exception/500", icon: <ExceptionIcon /> },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Account Center", href: "/templates/account/center", icon: <AccountIcon /> },
      { label: "Account Settings", href: "/templates/account/settings", icon: <SettingsIcon /> },
    ],
  },
]

function AnalysisIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 12l3-4 3 2 3-5 3 4" />
      <path d="M2 14h12" />
    </svg>
  )
}
function WorkplaceIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="1.5" width="13" height="9" rx="1.5" />
      <path d="M5.5 14.5h5M8 10.5v4" />
    </svg>
  )
}
function MonitorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4v4l3 2" />
    </svg>
  )
}
function FormIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <path d="M5 6h6M5 9h4" />
    </svg>
  )
}
function StepFormIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4.5 8h2M9.5 8h2" />
    </svg>
  )
}
function TableIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M1.5 6.5h13M1.5 10h13M6 6.5v7" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M2 4h12M2 8h12M2 12h8" />
    </svg>
  )
}
function CardIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="1.5" width="5" height="6" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="6" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  )
}
function ArticleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" />
      <path d="M5 5.5h6M5 8h6M5 10.5h4" />
    </svg>
  )
}
function ProjectIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1.5 5.5 8 2l6.5 3.5-6.5 3.5L1.5 5.5Z" />
      <path d="M1.5 10 8 13.5 14.5 10" />
      <path d="M1.5 7.5 8 11l6.5-3.5" />
    </svg>
  )
}
function AppIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  )
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  )
}
function SuccessIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M5 8.5L7 11l4-5" />
    </svg>
  )
}
function FailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M6 6l4 4M10 6l-4 4" />
    </svg>
  )
}
function ExceptionIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M8 2L1.5 13.5h13L8 2Z" />
      <path d="M8 6v4M8 11.5h.01" />
    </svg>
  )
}
function AccountIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="5" r="2.5" />
      <path d="M2.5 13.5c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" />
      <path d="M11 10l2 1-2 1" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  )
}
