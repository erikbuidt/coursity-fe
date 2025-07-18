'use client'
import Collapse from '@/components/custom/collapse'
import Player from '@/components/custom/player'
import YouTubePlayer from '@/components/custom/youtube-player'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { COURSE_STATUS } from '@/constants/course'
import { cn, durationToClockFormat, formatDuration } from '@/lib/utils'
import type { Course, Lesson } from '@/types/course.type'
import { MonitorPlay } from 'lucide-react'
import { Fragment, useState } from 'react'

function PreviewCourseDialog({
  course,
  open,
  onChange,
}: { course: Course; open: boolean; onChange: (status: boolean) => void }) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)

  // Early return if course is not provided
  if (!course) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={(status) => onChange(status)}>
      <DialogContent className="sm:max-w-[1085px]">
        <DialogHeader className="p-1">
          <DialogTitle>Course Preview</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-12 gap-4 max-h-[70vh]">
          <div className="col-span-9 overflow-auto">
            <div className="mx-auto max-w-[400px] ">
              {currentLesson?.video_provider?.toLowerCase() === 'youtube' ? (
                <div className="h-[400px] mx-auto">
                  <YouTubePlayer videoUrl={currentLesson.video_url} />
                </div>
              ) : currentLesson?.video_provider === 'system' ? (
                <Player src={currentLesson?.video_url || ''} height={400} />
              ) : course.promotion_video_url && course.image_url ? (
                <HeroVideoDialog
                  className="block dark:hidden shadow-none"
                  animationStyle="top-in-bottom-out"
                  videoSrc={course.promotion_video_url}
                  thumbnailSrc={course.image_url}
                  thumbnailAlt="Hero Video"
                />
              ) : (
                <div className="h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No video available</span>
                </div>
              )}
            </div>
            <h2 className="font-bold text-xl mt-4">{course.title || 'Untitled Course'}</h2>
            <p className="font-thin">{course.description || 'No description available'}</p>
            <div className="space-y-2 mt-4">
              <h4 className="font-semibold">Course content</h4>
              <div>
                {course.chapters && course.chapters.length > 0 ? (
                  course.chapters.map((chapter) => (
                    <Fragment key={chapter.id}>
                      <Collapse title={chapter.title || 'Untitled Chapter'}>
                        <ul className="flex flex-col">
                          {chapter.lessons && chapter.lessons.length > 0 ? (
                            chapter.lessons.map((lesson) => (
                              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                              <li
                                key={lesson.id}
                                className={cn(
                                  'flex gap-4 items-center px-4 py-2 hover:bg-accent text-xs md:text-sm cursor-pointer',
                                  lesson.id === currentLesson?.id && 'bg-amber-500/20',
                                )}
                                onClick={() => {
                                  if (lesson.id === currentLesson?.id) setCurrentLesson(null)
                                  else setCurrentLesson(lesson)
                                }}
                              >
                                <MonitorPlay className="text-primary" size={20} />
                                <span>{lesson.title || 'Untitled Lesson'}</span>
                                <div className="ml-auto text-gray-400">
                                  {lesson.duration
                                    ? durationToClockFormat(lesson.duration)
                                    : '0:00'}
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500 text-sm">
                              No lessons available
                            </li>
                          )}
                        </ul>
                      </Collapse>
                    </Fragment>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No chapters available</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <Card className="p-4 shadow-none bg-gray-50">
              <div className="font-semibold">Summary Course</div>
              <ul className="flex flex-col gap-2 font-thin">
                <li className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-semibold">
                    {course.duration ? formatDuration(course.duration) : 'N/A'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Price</span>
                  <span className="font-semibold">
                    {course.price ? `${course.price} $` : 'Free'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Lessons</span>
                  <span className="font-semibold">{course.lesson_count || 0} lessons</span>
                </li>
              </ul>
            </Card>
            <Card className="p-4 shadow-none bg-gray-50 mt-4">
              <div className="font-semibold">Instructor</div>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-semibold text-sm">Erik</div>
                  <div className="text-xs">erikbuidt@gmail.com</div>
                </div>
              </div>
            </Card>
            {course.status === COURSE_STATUS.IN_REVIEW && (
              <div className="flex flex-col gap-3 mt-5">
                <Button>Approve</Button>
                <Button variant="destructive">Reject</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewCourseDialog
