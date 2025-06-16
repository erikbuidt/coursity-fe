'use server'
import { CourseCard } from '@/components/custom/course-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import FadeInStaggered from '@/components/custom/fade-in'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { mockCourses } from '@/mocks/course'
import Pagination from '@/components/custom/pagination'
import { courseApi } from '@/services/courseService'
async function Courses(props: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const { items: courses, meta } = await courseApi.getCourses({ page, search })
  return (
    <>
      <div className="bg-stone-100">
        <div className="container md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="container md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* <Carousel
          className="w-full"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent>
            <CarouselItem className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl">
              <div className="flex justify-between p-4">
                <div className="w-[640px]">
                  <div>Hello</div>
                </div>
                <div className="">
                  <Image
                    src="/images/Banner_web_ReactJS.png"
                    alt="banner"
                    layout="responsive"
                    className="object-cover bg-center"
                    quality={100}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl">
              <div className="flex justify-between p-4">
                <div className="w-[640px]">
                  <div>Hello</div>
                </div>
                <div className="">
                  <Image
                    src="/images/Banner_01_2.png"
                    alt="banner"
                    layout="responsive"
                    className="object-cover bg-center"
                    quality={100}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel> */}

        <FadeInStaggered className="grid grid-cols-4 gap-4 mt-4">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </FadeInStaggered>

        <div className="mt-4">
          <Pagination pageSize={meta.total_pages} queryConfig={{ page: meta.current_page }} />
        </div>
      </div>
    </>
  )
}

export default Courses
