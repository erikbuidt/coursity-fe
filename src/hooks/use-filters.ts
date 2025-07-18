import { isUndefined, omitBy } from 'lodash'
import useQueryParams from './use-query-param'
import type { CourseListConfig } from '@/types/course.type'
export type QueryConfig = {
  [key in keyof CourseListConfig]: string
}

export default function useFilters() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page,
      limit: queryParams.limit,
      status: queryParams.status,
      search: queryParams.search,
    },
    isUndefined,
  )
  return queryConfig
}
