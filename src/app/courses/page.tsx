'use client'
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
function Course() {
  return (
    <div className="container mx-auto">
      <Carousel
        className="w-full mt-8 rounded-2xl overflow-hidden"
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className="">
          <CarouselItem className="bg-gradient-to-r from-gray-900 to-blue-900 ">
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
          <CarouselItem className="bg-gradient-to-r from-purple-500 to-blue-600">
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
      </Carousel>
      <FadeInStaggered>
        {Array.from({ length: 10 }).map((_, i) => (
          <CourseCard key={i} title="test" description="sssss" imageSrc="/images/course-1.jpg" />
        ))}
      </FadeInStaggered>
    </div>
  )
}

export default Course
