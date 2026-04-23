import { Link } from "react-router"

const sections = [
  {
    title: "Dashboard",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    pages: [
      { label: "Analysis", href: "/templates/dashboard/analysis", desc: "KPI cards, bar chart, search table, donut chart, area chart" },
      { label: "Workplace", href: "/templates/dashboard/workplace", desc: "User greeting, project stats, activity feed, quick links" },
      { label: "Monitor", href: "/templates/dashboard/monitor", desc: "Real-time metrics, gauges, server status" },
    ],
  },
  {
    title: "Form",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    pages: [
      { label: "Basic Form", href: "/templates/form/basic-form", desc: "Single-page form with inputs, date picker, radio groups" },
      { label: "Step Form", href: "/templates/form/step-form", desc: "Multi-step wizard with step indicator" },
      { label: "Advanced Form", href: "/templates/form/advanced-form", desc: "Collapsible multi-section form" },
    ],
  },
  {
    title: "List",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    pages: [
      { label: "Search Table", href: "/templates/list/table-list", desc: "Filterable data table with sortable columns and actions" },
      { label: "Basic List", href: "/templates/list/basic-list", desc: "Simple list with avatars, metadata, and action buttons" },
      { label: "Card List", href: "/templates/list/card-list", desc: "Grid of project cards with stats" },
      { label: "Search Articles", href: "/templates/list/search/articles", desc: "Article search with filters and engagement metrics" },
      { label: "Search Projects", href: "/templates/list/search/projects", desc: "Project search with filter tabs" },
      { label: "Search Apps", href: "/templates/list/search/applications", desc: "Application search results" },
    ],
  },
  {
    title: "Profile",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
    pages: [
      { label: "Basic Profile", href: "/templates/profile/basic", desc: "Order detail with customer info, returns table, timeline" },
      { label: "Advanced Profile", href: "/templates/profile/advanced", desc: "Multi-section profile with status steps and data tables" },
    ],
  },
  {
    title: "Result",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
    pages: [
      { label: "Success", href: "/templates/result/success", desc: "Success state with project details and approval timeline" },
      { label: "Fail", href: "/templates/result/fail", desc: "Failure state with error reasons and recovery actions" },
    ],
  },
  {
    title: "Exception",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    pages: [
      { label: "403 Forbidden", href: "/templates/exception/403", desc: "Access denied error page" },
      { label: "404 Not Found", href: "/templates/exception/404", desc: "Page not found error" },
      { label: "500 Server Error", href: "/templates/exception/500", desc: "Internal server error page" },
    ],
  },
  {
    title: "Account",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    pages: [
      { label: "Account Center", href: "/templates/account/center", desc: "User profile with tabs for articles, projects, apps" },
      { label: "Account Settings", href: "/templates/account/settings", desc: "Settings form with avatar upload and preferences" },
    ],
  },
]

export default function TemplatesIndex() {
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Ant Design Pro Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          21 page templates simulating the Ant Design Pro preview — dashboards, forms, lists, profiles, and more.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-base font-semibold mb-3">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.pages.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className={`block rounded-lg border p-4 hover:shadow-sm transition-shadow ${section.color}`}
                >
                  <div className="font-medium text-sm">{page.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{page.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
