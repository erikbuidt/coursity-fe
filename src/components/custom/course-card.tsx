import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Clock, Star } from 'lucide-react'
import type { Course } from '@/types/course.type'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
interface CourseProps {
  course: Course
}

export function CourseCard({ course }: CourseProps) {
  return (
    <div className="group relative space-y-2 shadow-md rounded-lg overflow-hidden">
      <figure className="group-hover:opacity-90">
        <Image
          src="/images/course-1.jpg"
          className="w-full object-contain"
          width={370}
          height={230}
          alt=""
        />
      </figure>
      <div className="flex flex-col justify-between p-6">
        <div className="flex gap-1 items-center">
          <div className="text-xl font-thin text-gray-500 line-through">{course.price} ₫</div>
          <div className="text-xl font-semibold text-red-600">{course.discount_price} ₫</div>
        </div>
        <h3 className="text-md font-semibold min-h-12">
          <Link href={`/courses/${course.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {course.title}
          </Link>
        </h3>
        <div className="line-clamp-2 text-md font-thin text-gray-500">{course.description}</div>

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
            <span>24</span>
          </div>

          <div className="flex gap-1 items-center text-gray-500">
            <Clock size={20} />
            1h30p
          </div>
        </div>
      </div>
    </div>
  )
}
