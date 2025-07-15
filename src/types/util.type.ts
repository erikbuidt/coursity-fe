import { z } from 'zod'
export interface SuccessResApi<Data> {
  status: number
  code: string
  data: Data
}

export const QueryParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
})

export type QueryParams = z.infer<typeof QueryParamsSchema>
