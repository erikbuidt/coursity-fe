import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Pencil, Eye, EllipsisVertical } from 'lucide-react'
import type { Course } from '@/types/course.type'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { Button } from '../ui/button'
interface CourseProps {
  course: Course
}

export function ManagementCourseCard({ course }: CourseProps) {
  return (
    <div className="group relative space-y-2 shadow-md rounded-lg overflow-hidden">
      <div className="group relative space-y-2  overflow-hidden">
        <figure className="relative">
          <Image
            src={course.image_url}
            className="w-full object-cover h-40"
            width={370}
            height={230}
            alt=""
          />
          <div className="absolute bottom-1 flex justify-between w-full px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[1]">
            <Link href={`course-management/${course.slug}`}>
              <Button size="icon" className="scale-95 rounded-full hover:cursor-pointer">
                <Pencil />
              </Button>
            </Link>

            <Button size="icon" className="scale-95 rounded-full hover:cursor-pointer">
              <Eye />
            </Button>
            <Button size="icon" className="scale-95 rounded-full hover:cursor-pointer">
              <EllipsisVertical />
            </Button>
          </div>
        </figure>
        {/* ...rest of your code... */}
      </div>
      <div className="flex flex-col justify-between px-4 py-2">
        <div className="flex gap-1 items-center">
          {course.discount_price ? (
            <>
              <div className="text-lg font-thin text-gray-500 line-through">
                {formatCurrency(course.price)} $
              </div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(course.discount_price)} $
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold text-primary ">
                {formatCurrency(course.price)} $
              </div>
            </>
          )}
        </div>
        <h3 className="text-sm font-semibold min-h-8">
          <span aria-hidden="true" className="absolute inset-0" />
          {course.title}
        </h3>
        <div className="line-clamp-2 text-md font-thin text-sm text-gray-500">
          {course.description}
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="flex gap-2 items-center text-gray-500">
            <Avatar className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-300">
              <AvatarImage className="" src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <span>Erik</span>
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <Play size={20} />
            <span>{course.lesson_count}</span>
          </div>

          <div className="flex gap-1 items-center text-gray-500">
            <Clock size={20} />
            {formatDuration(course.duration)}
          </div>
        </div>
      </div>
    </div>
  )
}
