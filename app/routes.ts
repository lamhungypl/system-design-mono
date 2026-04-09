import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("form", "routes/form-demo.tsx"),
  route("dialog", "routes/dialog-demo.tsx"),
  route("collapsible", "routes/collapsible-demo.tsx"),
  route("date-picker", "routes/date-picker-demo.tsx"),
  route("range-picker", "routes/range-picker-demo.tsx"),
  route("date-range-picker", "routes/date-range-picker.tsx"),
  route("segmented-control", "routes/segmented-control-demo.tsx"),
] satisfies RouteConfig
