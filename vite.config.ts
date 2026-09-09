import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    // Mirrors dynamic-web-app's svgr options so copied `import { ReactComponent as X }`
    // statements in app/hr-port/** work unchanged.
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg",
    }),
    tailwindcss(),
    reactRouter({ ssr: false }),
    tsconfigPaths(),
  ],
  server: { port: 9000, host: true },
  // The compare modal is lazy-loaded, and its chunk is the first thing to pull in
  // several of the copied tree's dependencies. Without pre-bundling them, Vite
  // re-optimizes mid-navigation and the dynamic import fails with
  // "504 (Outdated Optimize Dep)".
  optimizeDeps: {
    include: [
      "@hookform/error-message",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-compose-refs",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-icons",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "cmdk",
      "date-fns/isBefore",
      "date-fns/locale",
      "msw",
      "msw/browser",
      "vaul",
      "ahooks",
      "axios",
      "date-fns",
      "@date-fns/tz",
      "eventemitter3",
      "file-saver",
      "i18next",
      "idb",
      "immer",
      "js-cookie",
      "lodash",
      "lodash/isEqual",
      "mathjs",
      "nanoid",
      "qs",
      "react-datepicker",
      "react-dropzone",
      "react-hook-form",
      "@hookform/resolvers/zod",
      "react-i18next",
      "react-scroll-sync",
      "@tanstack/react-virtual",
      "use-debounce",
      "zod",
      "zustand",
    ],
  },
})
