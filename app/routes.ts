import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),

  route("components", "routes/components-layout.tsx", [
    index("routes/components.tsx"),
    route("dashboard", "routes/components-dashboard.tsx"),

    // General
    route("button", "routes/demo-button.tsx"),
    route("segmented-control", "routes/demo-segmented-control.tsx"),

    // Data Entry
    route("form", "routes/demo-form.tsx"),
    route("date-picker", "routes/demo-date-picker.tsx"),
    route("range-picker", "routes/demo-range-picker.tsx"),
    route("date-range-picker", "routes/demo-date-range-picker.tsx"),

    // Data Display
    route("collapsible", "routes/demo-collapsible.tsx"),

    // Feedback
    route("dialog", "routes/demo-dialog.tsx"),
  ]),
] satisfies RouteConfig
