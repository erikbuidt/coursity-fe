import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookCheck, User } from 'lucide-react'

interface CourseCardProps {
  title: string
  description: string
  imageSrc?: string
  instructor?: string
  duration?: string
  price?: string
  onEnroll?: () => void
}

export function CourseCard({
  title,
  description,
  imageSrc,
  instructor,
  duration,
  price,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="group relative space-y-2 shadow-md  rounded-lg">
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
        <span className="text-primary font-bold text-lg mb-1">12000</span>
        <h3 className="text-lg">
          <Link href={'/'}>
            <span aria-hidden="true" className="absolute inset-0" />
            <h3 className="text-2xl font-semibold">Learning to Write as a Professional Author</h3>
          </Link>
        </h3>
        <div className="flex items-center justify-between mt-10">
          <div className="flex gap-1 text-gray-500">
            <BookCheck />
            <span>24 Lesson</span>
          </div>
          <div className="flex gap-1 text-gray-500">
            <User />
            69 Students
          </div>
        </div>
      </div>
    </div>
  )
}
