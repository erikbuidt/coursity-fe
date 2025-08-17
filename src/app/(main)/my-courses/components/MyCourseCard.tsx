import { formatCurrency, formatDuration } from '@/lib/utils'
import type { Course } from '@/types/course.type'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Clock, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

interface CourseProps {
  course: Course
}

export function MyCourseCard({ course }: CourseProps) {
  return (
    <div className="group relative space-y-2 shadow-md rounded-lg overflow-hidden flex flex-col">
      <div className="group relative space-y-2  overflow-hidden">
        <figure className="relative">
          <Image
            src={course.image_url}
            className="w-full object-cover h-40"
            width={370}
            height={230}
            alt=""
          />
        </figure>
        {/* ...rest of your code... */}
      </div>
      <div className="flex flex-col justify-between px-4 py-2">
        <Link href={`learn/${course.slug}`}>
          <h3 className="text-sm font-semibold min-h-8">
            <span aria-hidden="true" className="absolute inset-0" />
            {course.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-2 items-center text-gray-500">
            <Avatar className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-300">
              <AvatarImage className="" src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <span>Erik</span>
          </div>
        </div>
        <div className="line-clamp-2 text-md font-thin text-sm text-gray-500">
          {course.description}
        </div>
      </div>
      <Progress
        className="m-4 mt-auto w-[90%]"
        value={Number(course.course_progress?.progress_percent) || 0}
      />
    </div>
  )
}
