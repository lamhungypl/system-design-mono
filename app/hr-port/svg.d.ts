// svgr is configured with `exportType: "named"` (mirroring dynamic-web-app), so every
// *.svg module also exposes a `ReactComponent` named export. vite/client already
// declares the default string export, so only the named one is added here.
declare module "*.svg" {
  import type * as React from "react"

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      desc?: string
      descId?: string
      title?: string
      titleId?: string
    }
  >
}
