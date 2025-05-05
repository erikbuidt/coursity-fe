import Collapse from '@/components/custom/collapse'
import Rating from '@/components/custom/rating'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { durationToClockFormat } from '@/lib/utils'
import { getCourse } from '@/services/courseService'
import { Check, Globe, MonitorPlay } from 'lucide-react'
import { cookies } from 'next/headers'
import { Fragment } from 'react'
import SummaryCourse from './components/summary-course'
import { notFound } from 'next/navigation'

async function CourseDetail(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = params.slug.toString()
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('__session')
  const course = await getCourse(slug, sessionToken?.value)
  if (!course) {
    notFound()
  }
  return (
    <>
      <div className="bg-stone-100 ">
        <div className="container md:max-w-5xl lg:max-w-6xl py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black ">
        <div className="container md:max-w-5xl lg:max-w-6xl py-8">
          <div className="grid grid-cols-12 gap-6 text-white">
            <div className="relative col-span-8">
              <h1 className="text-4xl font-bold ">{course.title}</h1>
              <div className="mt-4 ">{course.description}</div>
              <div className="flex gap-2 mt-4 ">
                <Rating rating={4.5} />
                <span>(344 Reviewing)</span>
                <span>1623 students</span>
              </div>
              <div className="mt-5">Created by: Erik</div>
              <div className="flex gap-2 mt-4">
                <Globe />
                Vietnamese
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container md:max-w-5xl lg:max-w-6xl grid grid-cols-12 gap-4">
        <div className="col-span-8 mt-10">
          <div className="border-2 border-gray-200">
            <h3 className="font-bold text-2xl pl-4 pt-4">What you'll learn</h3>
            <ul className="flex flex-wrap p-4 font-semibold text-gray-600 text-sm">
              {course.will_learns.map((item, index) => (
                <li key={index} className="flex items-center mt-2 w-[50%] ">
                  <Check className="mr-2 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <h3 className="font-bold text-2xl pt-4">Requirements</h3>
          <ul className="flex flex-col font-semibold text-gray-600 text-sm">
            {course.requirements.map((item, index) => (
              <li key={index} className="flex items-center mt-2">
                <Check className="mr-2 text-primary" /> {item}
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-2xl my-4">Course content</h3>
          {course.chapters.map((chapter) => (
            <Fragment key={chapter.id}>
              <Collapse title={chapter.title}>
                <ul className="flex flex-col">
                  {chapter.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex gap-4 items-center px-2 py-2 hover:bg-accent"
                    >
                      <MonitorPlay className="text-primary" size={20} />
                      <span>{lesson.title}</span>
                      <div className="ml-auto text-sm text-gray-400">
                        {durationToClockFormat(lesson.duration)}
                      </div>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </Fragment>
          ))}
        </div>
        <div className="col-span-4">
          <div className="sticky top-60 ">
            <SummaryCourse course={course} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetail
