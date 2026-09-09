export const playgroundNav = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: <HomeIcon /> },
      {
        label: "Components",
        href: "/components/dashboard",
        icon: <LayersIcon />,
      },
    ],
  },
  {
    title: "Ported screens",
    items: [
      { label: "Overview", href: "/playground", icon: <PlaygroundIcon /> },
      {
        label: "Table + change modal",
        href: "/playground/table-modal-changes",
        icon: <TableIcon />,
      },
    ],
  },
]

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M2 6.5 8 2l6 4.5V14H2V6.5Z" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M8 1.5 15 5l-7 3.5L1 5l7-3.5ZM1 8l7 3.5L15 8M1 11l7 3.5L15 11" />
    </svg>
  )
}

function PlaygroundIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v6M5 8h6" />
    </svg>
  )
}

function TableIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M1.5 6h13M6 6v7.5" />
    </svg>
  )
}
