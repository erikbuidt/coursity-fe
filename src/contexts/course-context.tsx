import type { Course } from '@/types/course.type'
import { createContext, useContext } from 'react'

export const CourseContext = createContext<Course | null>(null)

export function useCourse() {
  return useContext(CourseContext)
}
