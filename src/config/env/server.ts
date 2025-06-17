import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().default(''),
    CLERK_WEBHOOK_SECRET: z.string().default(''),
    CLERK_API_KEY: z.string().default(''),
  },
  experimental__runtimeEnv: process.env,
})
