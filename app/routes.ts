import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),

  route("components", "routes/components-layout.tsx", [
    index("routes/components.tsx"),
    route("dashboard", "routes/components.tsx"),

    // General
    route("button", "routes/form-demo.tsx"),
    route("segmented-control", "routes/segmented-control-demo.tsx"),
    route("tooltip", "routes/segmented-control-demo.tsx"),

    // Data Entry
    route("field", "routes/form-demo.tsx"),
    route("label", "routes/form-demo.tsx"),
    route("date-picker", "routes/date-picker-demo.tsx"),
    route("range-picker", "routes/range-picker-demo.tsx"),
    route("date-range-picker", "routes/date-range-picker.tsx"),

    // Data Display
    route("collapsible", "routes/collapsible-demo.tsx"),

    // Feedback
    route("dialog", "routes/dialog-demo.tsx"),
  ]),
] satisfies RouteConfig
