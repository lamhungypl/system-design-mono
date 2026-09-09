import * as z from "zod"

/**
 * Trimmed port of dynamic-web-app's src/config/env.ts.
 *
 * The original also requires an SSO URL and seven FIREBASE_* variables; none of the code
 * copied into app/hr-port reads them (notifications and auth stayed behind), so the
 * schema only keeps what this playground actually uses.
 */
const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    // Only used by pathMap in features/common/utils/routers.ts for external links.
    APP_TA_URL: z.string().optional().default(""),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
    DEBUG_MODE: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
  })

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr
    if (key.startsWith("VITE_APP_")) {
      acc[key.replace("VITE_APP_", "")] = value as string
    }
    return acc
  }, {})

  const parsedEnv = EnvSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    const invalidEnvs = Object.entries(parsedEnv.error.flatten().fieldErrors)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n")
    throw new Error(`Missing or invalid variables : ${invalidEnvs}`)
  }

  return parsedEnv.data
}

export const env = createEnv()
