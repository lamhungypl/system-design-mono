import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("/date-range-picker", "routes/date-range-picker.tsx"),
] satisfies RouteConfig
