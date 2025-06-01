'use client'
import Forbidden from '@/components/custom/403'
import InternalServerError from '@/components/custom/500'
import CircleProgress from '@/components/custom/circle-progress-bar'
import Collapse from '@/components/custom/collapse'

import { Checkbox } from '@/components/ui/checkbox'
import { HttpError } from '@/lib/http'
import { cn, durationToClockFormat } from '@/lib/utils'
import { courseApi } from '@/services/courseService'
import { learningApi } from '@/services/learningService'
import { lessonApi } from '@/services/lessonService'
import type { Course, Lesson } from '@/types/course.type'
import { SignedIn, UserButton, useAuth } from '@clerk/nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, MonitorPlay } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
// Learn.tsx

const Player = dynamic(() => import('@/components/custom/player'), { ssr: false })

function Learn() {
  const router = useRouter()
  const { slug } = useParams()
  const searchParams = useSearchParams()
  const [localCourse, setLocalCourse] = useState<Course | null>(null)
  let lessonId = searchParams.get('lesson_id') || ''
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  // const { data: course, error } = useSWR(`/api/learn/${slug}`, async () => {
  //   const token = await getToken()
  //   return getLearningCourse(slug as string, token || '')
  // })
  const { data: course, error } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return learningApi.getLearningCourse(slug as string, token || '')
    },
    queryKey: ['course'],
    staleTime: 10 * 60 * 1000,
  })
  const { data: courseProgress, refetch } = useQuery({
    queryFn: async () => {
      const token = await getToken()
      return courseApi.getCourseProgress(slug as string, token || '')
    },
    queryKey: ['course-progress'],
    staleTime: 10 * 60 * 1000,
  })
  const completeLessonMutation = useMutation({
    mutationFn: async (arg: { courseId: number; chapterId: number; lessonId: number }) => {
      const { courseId, chapterId, lessonId } = arg
      const token = await getToken()
      return lessonApi.completeLesson(courseId, chapterId, lessonId, token || '')
    },
    onSuccess: () => {
      refetch()
      queryClient.invalidateQueries({ queryKey: ['course'] })
    },
  })
  const toggleLessonCompleted = (chapterId: number, lessonId: number, checked: boolean) => {
    if (!localCourse) return

    setLocalCourse((prev) => {
      if (!prev) return prev

      const updatedChapters = prev.chapters.map((chapter) => {
        if (chapter.id !== chapterId) return chapter

        const updatedLessons = chapter.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, is_completed: checked } : lesson,
        )

        const completedCount = updatedLessons.filter((l) => l.is_completed).length

        return {
          ...chapter,
          lessons: updatedLessons,
          chapter_completed_lesson_count: completedCount,
        }
      })

      return { ...prev, chapters: updatedChapters }
    })
    completeLessonMutation.mutate({ chapterId, lessonId, courseId: localCourse.id })
    // TODO: Optionally call backend to persist this change
  }
  useEffect(() => {
    if (course) {
      setLocalCourse(course)
    }
  }, [course])
  useEffect(() => {
    if (course) {
      if (!lessonId) {
        const firstChapter = course.chapters.find((chapter) => chapter.position === 1)
        const firstLesson = firstChapter?.lessons.find((lesson) => lesson.position === 1)
        let lastLearningLessonId: string | undefined
        if (courseProgress) {
          lastLearningLessonId = courseProgress.last_lesson_id?.toString()
        }
        lessonId = lastLearningLessonId || firstLesson?.id.toString() || lessonId
      }

      if (lessonId) {
        const curr = course.chapters
          .flatMap((chapter) => chapter.lessons)
          .find((lesson) => lesson.id === +lessonId)

        curr && setCurrentLesson(curr)
      }
    }
  }, [lessonId, course, courseProgress])
  if (error && error instanceof HttpError) {
    if (error.status === 403) return <Forbidden />
    return <InternalServerError />
  }
  return (
    <>
      <section className="">
        <div className="flex items-center text-sm bg-indigo-950 px-4 py-2">
          <ChevronLeft
            className="text-white cursor-pointer"
            onClick={() => router.push(`/courses/${slug}`)}
          />
          <h1 className="text-lg font-bold text-white ml-2">{course?.title}</h1>
          <div className="ml-auto">
            <CircleProgress
              progress={courseProgress ? +courseProgress.progress_percent : 0}
              size={28}
              textSizeClass="text-[8px]"
              strokeWidth={2}
              textColorClass="text-white"
            />
          </div>
          <div className="ml-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="">
          <div className="w-[70%] h-full fixed left-0 top-0 mt-12 overflow-auto">
            <div className="w-full px-[30px] bg-black">
              <Player
                src={currentLesson?.video_url || ''}
                onEnded={() => {
                  currentLesson &&
                    localCourse &&
                    completeLessonMutation.mutate({
                      chapterId: currentLesson.chapter_id,
                      lessonId: currentLesson.id,
                      courseId: localCourse.id,
                    })
                }}
              />
            </div>
            <div className="lg:max-w-[798px] xl:max-w-[1310] items-center mx-auto">
              <div>{currentLesson?.title}</div>
            </div>
          </div>
          <div
            className="fixed right-0 top-0 mt-11 overflow-auto w-[30%]"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            <div className="h-full w-full">
              <div className="font-semibold py-2 px-4 text-sm">Content</div>
              {localCourse?.chapters.map((chapter) => (
                <Collapse
                  defaultOpen={
                    // biome-ignore lint/complexity/noUselessTernary: <explanation>
                    chapter.lessons.find((l) => l.id === currentLesson?.id) ? true : false
                  }
                  key={chapter.id}
                  title={chapter.title}
                  className="text-[14px]"
                  element={
                    <div className="px-4 mt-[-10px] text-gray-600 mb-1">
                      {chapter.chapter_completed_lesson_count}/{chapter.chapter_lesson_count}
                    </div>
                  }
                >
                  <ul className="flex flex-col">
                    {chapter.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className={cn('flex gap-3 hover:bg-accent px-4 py-2', {
                          'bg-amber-500/20': lesson.id === currentLesson?.id,
                        })}
                      >
                        <Checkbox
                          className="mt-1 border-black border-[1px]"
                          checked={lesson.is_completed}
                          disabled={lesson.is_completed}
                          onCheckedChange={(checked) =>
                            toggleLessonCompleted(chapter.id, lesson.id, checked === true)
                          }
                        />

                        <div className="flex flex-col gap-1 relative w-full">
                          <Link href={`?lesson_id=${lesson.id}`} className="text-[13px]">
                            <span aria-hidden="true" className="inset-0 absolute" />
                            {lesson.title}
                          </Link>
                          <div className="text-xs text-gray-400 flex gap-1">
                            <MonitorPlay className="text-primary shrink-0" size={15} />

                            <span> {durationToClockFormat(lesson.duration)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Learn
