'use client'
import Forbidden from '@/components/custom/403'
import CircleProgress from '@/components/custom/circle-progress-bar'
import Collapse from '@/components/custom/collapse'
import Player from '@/components/custom/player'
import { cn, durationToClockFormat } from '@/lib/utils'
import { getEnrollments } from '@/services/enrollmentService'
import { getLearningCourse } from '@/services/learningService'
import { Lesson } from '@/types/course.type'
import { SignedIn, useAuth, UserButton } from '@clerk/nextjs'
import { ChevronLeft, MonitorPlay, CircleCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
// Learn.tsx

function Learn() {
  const router = useRouter()
  const { slug, ...rest } = useParams()
  const searchParams = useSearchParams()

  let lessonId = searchParams.get('lesson_id')
  const { getToken } = useAuth()
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const {
    data: course,
    isLoading,
    error,
  } = useSWR(`/api/learn/${slug}`, async () => {
    const token = await getToken()
    return getLearningCourse(slug as string, token || '')
  })
  useEffect(() => {
    if (!lessonId && course) {
      for (const chapter of course.chapters) {
        for (const lesson of chapter.lessons) {
          if (lesson.position === 1 && chapter.position === 1) lessonId = lesson.id.toString()
        }
      }
    }
    if (lessonId && course) {
      let curr = null
      for (const chapter of course.chapters) {
        for (const lesson of chapter.lessons) {
          if (lesson.id === +lessonId) {
            curr = lesson
            break
          }
        }
      }
      setCurrentLesson(curr)
    }
  }, [lessonId, course])
  if (error?.status === 403) return <Forbidden />

  return (
    <>
      <section className="">
        <div className="flex items-center text-sm bg-indigo-950 px-4 py-2">
          <ChevronLeft
            className="text-white cursor-pointer"
            onClick={() => router.push('/courses')}
          />
          <h1 className="text-lg font-bold text-white ml-2">{course?.title}</h1>
          <div className="ml-auto text-white mr-2"> 8/24</div>

          <CircleProgress
            progress={20}
            size={28}
            textSizeClass="text-[8px]"
            strokeWidth={2}
            textColorClass="text-white"
          />
          <div className="ml-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="">
          <div className="w-[77%] h-full fixed left-0 top-0 mt-11 overflow-auto">
            <Player
              className="w-full"
              option={{
                url: 'https://artplayer.org/assets/sample/video.mp4',
                fullscreen: true,
                container: '.artplayer-app',
              }}
              style={{
                height: '80%',
              }}
              // getInstance={(art) => console.log(art)}
            />
            <div className="lg:max-w-[798px] xl:max-w-[1310] items-center mx-auto">
              <div>{currentLesson?.title}</div>
            </div>
          </div>
          <div
            className="fixed right-0 top-0 mt-11 overflow-auto w-[23%]"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            <div className="h-full w-full">
              <div className="font-semibold py-2 px-1 text-sm">Content</div>
              {course?.chapters.map((chapter) => (
                <Collapse key={chapter.id} title={chapter.title} className="text-xs">
                  <ul className="flex flex-col">
                    {chapter.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className={cn('flex gap-2 relative hover:bg-accent p-2 ', {
                          'bg-amber-500/20': lesson.id === currentLesson?.id,
                        })}
                      >
                        <MonitorPlay className="text-primary shrink-0" size={15} />
                        <div className="">
                          <Link href={`?lesson_id=${lesson.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {lesson.title}
                          </Link>
                          <div className="text-xs text-gray-400">
                            {durationToClockFormat(lesson.duration)}
                          </div>
                        </div>
                        <CircleCheck size={15} className="ml-auto self-center shrink-0" />
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
