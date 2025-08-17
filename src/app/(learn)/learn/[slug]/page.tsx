'use client'
import Forbidden from '@/components/custom/403'
import InternalServerError from '@/components/custom/500'
import CircleProgress from '@/components/custom/circle-progress-bar'
import Collapse from '@/components/custom/collapse'
import YouTubePlayer from '@/components/custom/youtube-player'

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

const Player = dynamic(() => import('@/components/custom/player'), {
  ssr: false,
})

// Returns the next lesson in the course, or undefined if at the end
function getNextLesson(localCourse: Course, currentLesson: Lesson): Lesson | undefined {
  const currentChapter = localCourse.chapters.find(
    (chapter) => chapter.id === currentLesson.chapter_id,
  )
  if (!currentChapter) return undefined

  // Try to find the next lesson in the current chapter
  const nextLessonInChapter = currentChapter.lessons?.find(
    (lesson) => lesson.position === currentLesson.position + 1,
  )
  if (nextLessonInChapter) return nextLessonInChapter

  // If not found, try to find the first lesson in the next chapter
  const nextChapter = localCourse.chapters.find(
    (chapter) => chapter.position === currentChapter.position + 1,
  )
  return nextChapter?.lessons?.find((lesson) => lesson.position === 1)
}

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
    mutationFn: async (arg: {
      courseId: number
      chapterId: number
      lessonId: number
    }) => {
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

        const updatedLessons = chapter?.lessons?.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, is_completed: checked } : lesson,
        )

        const completedCount = updatedLessons?.filter((l) => l.is_completed).length

        return {
          ...chapter,
          lessons: updatedLessons,
          chapter_completed_lesson_count: completedCount,
        }
      })

      return { ...prev, chapters: updatedChapters }
    })
    completeLessonMutation.mutate({
      chapterId,
      lessonId,
      courseId: localCourse.id,
    })
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
        const firstLesson = firstChapter?.lessons?.find((lesson) => lesson.position === 1)
        let lastLearningLessonId: string | undefined
        if (courseProgress) {
          lastLearningLessonId = courseProgress.last_lesson_id?.toString()
        }
        lessonId = lastLearningLessonId || firstLesson?.id.toString() || lessonId
      }

      if (lessonId) {
        const curr = course.chapters
          .flatMap((chapter) => chapter.lessons)
          .find((lesson) => lesson?.id === +lessonId)

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
          <h1 className="text-base md:text-lg font-bold text-white ml-2">{course?.title}</h1>
          <div className="ml-auto">
            <CircleProgress
              progress={courseProgress ? +courseProgress.progress_percent : 0}
              size={24}
              textSizeClass="text-[6px] md:text-[8px]"
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
          <div className="w-full md:w-[70%] h-full md:fixed left-0 top-0 md:mt-12 overflow-auto">
            <div className="w-full px-4 md:px-[30px] bg-black">
              {currentLesson?.video_provider === 'youtube' ? (
                <div className="py-4 w-full h-[360px] md:w-[640px] md:h-[460px] xl:w-[1040px] xl:h-[750px] mx-auto">
                  <YouTubePlayer videoUrl={currentLesson.video_url} />
                </div>
              ) : currentLesson?.video_provider === 'system' ? (
                <Player
                  src={currentLesson?.video_url || ''}
                  onEnded={() => {
                    if (currentLesson && localCourse) {
                      completeLessonMutation.mutate({
                        chapterId: currentLesson.chapter_id,
                        lessonId: currentLesson.id,
                        courseId: localCourse.id,
                      })
                      const nextLesson = getNextLesson(localCourse, currentLesson)
                      console.log({ nextLesson })
                      if (nextLesson) {
                        router.push(`?lesson_id=${nextLesson.id}`)
                        setCurrentLesson(nextLesson)
                      }
                    }
                  }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="lg:max-w-[798px] xl:max-w-[1310px] items-center mx-auto">
              <div className="text-sm md:text-base">{currentLesson?.title}</div>
            </div>
          </div>
          <div
            className="relative md:fixed md:right-0 md:top-0 mt-11 overflow-auto w-full md:w-[30%]"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            <div className="h-full w-full">
              <div className="font-semibold py-2 px-4 text-xs md:text-sm">Content</div>
              {localCourse?.chapters.map((chapter) => (
                <Collapse
                  defaultOpen={
                    chapter.lessons?.find((l) => l.id === currentLesson?.id) ? true : false
                  }
                  key={chapter.id}
                  title={chapter.title}
                  className="text-[12px] md:text-[14px]"
                  element={
                    <div className="px-4 mt-[-10px] text-gray-600 mb-1 text-xs md:text-sm">
                      {chapter.chapter_completed_lesson_count}/{chapter.chapter_lesson_count}
                    </div>
                  }
                >
                  <ul className="flex flex-col">
                    {chapter.lessons?.map((lesson) => (
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
                          <Link
                            href={`?lesson_id=${lesson.id}`}
                            className="text-[11px] md:text-[13px]"
                          >
                            <span aria-hidden="true" className="inset-0 absolute" />
                            {lesson.title}
                          </Link>
                          <div className="text-[10px] md:text-xs text-gray-400 flex gap-1">
                            <MonitorPlay className="text-primary shrink-0" size={12} />

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
