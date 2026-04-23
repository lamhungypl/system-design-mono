import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),

  route("templates", "routes/templates-layout.tsx", [
    index("routes/templates/index.tsx"),
    route("dashboard/analysis", "routes/templates/dashboard-analysis.tsx"),
    route("dashboard/workplace", "routes/templates/dashboard-workplace.tsx"),
    route("dashboard/monitor", "routes/templates/dashboard-monitor.tsx"),
    route("form/basic-form", "routes/templates/form-basic.tsx"),
    route("form/step-form", "routes/templates/form-step.tsx"),
    route("form/advanced-form", "routes/templates/form-advanced.tsx"),
    route("list/table-list", "routes/templates/list-table.tsx"),
    route("list/basic-list", "routes/templates/list-basic.tsx"),
    route("list/card-list", "routes/templates/list-card.tsx"),
    route("list/search/articles", "routes/templates/list-search-articles.tsx"),
    route("list/search/projects", "routes/templates/list-search-projects.tsx"),
    route("list/search/applications", "routes/templates/list-search-applications.tsx"),
    route("profile/basic", "routes/templates/profile-basic.tsx"),
    route("profile/advanced", "routes/templates/profile-advanced.tsx"),
    route("result/success", "routes/templates/result-success.tsx"),
    route("result/fail", "routes/templates/result-fail.tsx"),
    route("exception/403", "routes/templates/exception-403.tsx"),
    route("exception/404", "routes/templates/exception-404.tsx"),
    route("exception/500", "routes/templates/exception-500.tsx"),
    route("account/center", "routes/templates/account-center.tsx"),
    route("account/settings", "routes/templates/account-settings.tsx"),
  ]),

  route("components", "routes/components-layout.tsx", [
    index("routes/components.tsx"),
    route("dashboard", "routes/components-dashboard.tsx"),

    // General
    route("button", "routes/demo-button.tsx"),
    route("typography", "routes/demo-typography.tsx"),
    route("segmented-control", "routes/demo-segmented-control.tsx"),

    // Data Entry
    route("form", "routes/demo-form.tsx"),
    route("input", "routes/demo-input.tsx"),
    route("input-number", "routes/demo-input-number.tsx"),
    route("checkbox", "routes/demo-checkbox.tsx"),
    route("radio", "routes/demo-radio.tsx"),
    route("switch", "routes/demo-switch.tsx"),
    route("select", "routes/demo-select.tsx"),
    route("slider", "routes/demo-slider.tsx"),
    route("calendar", "routes/demo-calendar.tsx"),
    route("date-picker", "routes/demo-date-picker.tsx"),
    route("range-picker", "routes/demo-range-picker.tsx"),
    route("date-range-picker", "routes/demo-date-range-picker.tsx"),

    // Data Display
    route("badge", "routes/demo-badge.tsx"),
    route("tag", "routes/demo-tag.tsx"),
    route("avatar", "routes/demo-avatar.tsx"),
    route("card", "routes/demo-card.tsx"),
    route("statistic", "routes/demo-statistic.tsx"),
    route("empty", "routes/demo-empty.tsx"),
    route("skeleton", "routes/demo-skeleton.tsx"),
    route("progress", "routes/demo-progress.tsx"),
    route("collapsible", "routes/demo-collapsible.tsx"),
    route("data-table", "routes/demo-data-table.tsx"),

    // Navigation
    route("tabs", "routes/demo-tabs.tsx"),
    route("breadcrumb", "routes/demo-breadcrumb.tsx"),
    route("steps", "routes/demo-steps.tsx"),
    route("pagination", "routes/demo-pagination.tsx"),

    // Feedback
    route("alert", "routes/demo-alert.tsx"),
    route("spin", "routes/demo-spin.tsx"),
    route("dialog", "routes/demo-dialog.tsx"),
    route("drawer", "routes/demo-drawer.tsx"),
    route("popover", "routes/demo-popover.tsx"),
    route("tooltip", "routes/demo-tooltip.tsx"),
    route("affix", "routes/demo-affix.tsx"),
  ]),
] satisfies RouteConfig
