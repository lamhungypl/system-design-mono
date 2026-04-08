import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("form", "routes/form-demo.tsx"),
  route("dialog", "routes/dialog-demo.tsx"),
  route("collapsible", "routes/collapsible-demo.tsx"),
  route("date-range", "routes/date-range-demo.tsx"),
  route("date-picker", "routes/date-picker-demo.tsx"),
  route("range-picker", "routes/range-picker-demo.tsx"),
] satisfies RouteConfig
