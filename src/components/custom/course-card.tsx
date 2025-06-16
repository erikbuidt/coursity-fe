import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Star } from 'lucide-react'
import type { Course } from '@/types/course.type'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { formatCurrency, formatDuration } from '@/lib/utils'
interface CourseProps {
  course: Course
}

export function CourseCard({ course }: CourseProps) {
  return (
    <div className="group relative space-y-2 shadow-md rounded-lg overflow-hidden">
      <figure className="group-hover:opacity-90">
        <Image
          src={course.image_url}
          className="w-full object-cover h-60"
          width={370}
          height={230}
          alt=""
        />
      </figure>
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
          <Link href={`/courses/${course.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {course.title}
          </Link>
        </h3>
        <div className="line-clamp-2 text-md font-thin text-sm text-gray-500 min-h-10">
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
