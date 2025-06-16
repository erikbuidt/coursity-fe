'use server'
import CarouselAutoPlay from '@/components/custom/carousel-auto-play'
import { CourseCard } from '@/components/custom/course-card'
import FadeInStaggered from '@/components/custom/fade-in'
// import { CourseCard } from '@/components/custom/course-card'
// import FadeInStaggered from '@/components/custom/fade-in'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { courseApi } from '@/services/courseService'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
const categories = [
  {
    id: 1,
    name: 'Web Development',
    image: '/images/web-development.png',
    description: 'Learn the latest web development technologies and frameworks.',
  },
  {
    id: 2,
    name: 'Data Science',
    image: '/images/data-science.png',
    description: 'Explore data analysis, machine learning, and AI.',
  },
  {
    id: 3,
    name: 'Digital Marketing',
    image: '/images/digital-marketing.png',
    description: 'Master SEO, social media, and online advertising.',
  },
  {
    id: 4,
    name: 'Graphic Design',
    image: '/images/graphic-design.png',
    description: 'Create stunning visuals and designs.',
  },
  {
    id: 5,
    name: 'Cybersecurity',
    image: '/images/cybersecurity.png',
    description: 'Learn how to protect systems and networks.',
  },
  {
    id: 6,
    name: 'Mobile Development',
    image: '/images/mobile-development.png',
    description: 'Build apps for iOS and Android platforms.',
  },
  {
    id: 7,
    name: 'Cloud Computing',
    image: '/images/cloud-computing.png',
    description: 'Understand cloud services and architecture.',
  },
  {
    id: 8,
    name: 'Game Development',
    image: '/images/game-development.png',
    description: 'Create engaging games and interactive experiences.',
  },
  {
    id: 9,
    name: 'AI & Machine Learning',
    image: '/images/ai-machine-learning.png',
    description: 'Dive into artificial intelligence and machine learning.',
  },
]

export default async function Home() {
  const { items: courses } = await courseApi.getCourses({
    page: 1,
    limit: 10,
  })
  return (
    <>
      <div className="bg-[url(/images/home1-bg.png)] bg-no-repeat bg-cover bg-center] ">
        <div className="container md:max-w-5xl lg:max-w-6xl xl:max-w-7xl py-24 flex items-center ">
          {/* Left */}
          <div className="mt-5 max-w-xl text-left">
            <FadeInStaggered className="" delay={500}>
              <h1 className="text-white scroll-m-20 text-4xl lg:text-5xl font-bold">
                Learn New Skills Online with Top
                <span className="underline text-amber-500">Educators</span>
              </h1>
              <p className="text-lg text-white mt-10">
                Over 10+ fully responsive, UI blocks you can drop into your Shadcn UI projects and
                customize to your heart&apos;s content.
              </p>
            </FadeInStaggered>

            <div className="mt-8 flex justify-start gap-3">
              <FadeInStaggered direction="fade-right" className="">
                <Button size={'lg'} className="p-6">
                  Join for free
                </Button>
              </FadeInStaggered>
              <FadeInStaggered direction="fade-left">
                <Button
                  size={'lg'}
                  className="p-6 bg-transparent text-primary border-primary hover:bg-transparent hover:text-amber-500 hover:border-amber-500"
                  variant={'outline'}
                >
                  <Link href={'/courses'}> Find Courses</Link>
                </Button>
              </FadeInStaggered>
            </div>
          </div>
          {/* End Left */}
          {/* Right */}
          <div className="pb-10 overflow-hidden md:p-10 lg:p-0 sm:pb-0 mx-auto">
            <img
              id="heroImg1"
              className="transition-all duration-300 ease-in-out hover:scale-105 lg:w-full sm:mx-auto sm:w-4/6 sm:pb-12 lg:pb-0"
              src="https://bootstrapmade.com/demo/templates/FlexStart/assets/img/hero-img.png"
              // biome-ignore lint/a11y/noRedundantAlt: <explanation>
              alt="Awesome hero page image"
              width="500"
              height="488"
            />
          </div>
        </div>
        <div>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            className="svg-waves h-[100px] w-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="svg-waves__parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" />
              <use xlinkHref="#gentle-wave" x="48" y="3" />
              <use xlinkHref="#gentle-wave" x="48" y="5" />
              <use xlinkHref="#gentle-wave" x="48" y="7" />
            </g>
          </svg>
        </div>
      </div>
      <section className="container md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <h2 className="text-2xl font-bold text-center">Top Categories</h2>
        <CarouselAutoPlay items={categories} />
      </section>

      <section className="container mt-20 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
        <h2 className="text-2xl font-bold text-center mt-8">Most Popular Courses</h2>
        <FadeInStaggered className="grid grid-cols-4 gap-4 mt-10">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </FadeInStaggered>
      </section>

      <section className="mt-20 bg-indigo-950">
        <div className="container mt-20 py-20 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <h2 className="text-4xl font-bold text-white text-center">Why learn with our courses?</h2>
          <div className="max-w-[1200px] mx-auto mt-10">
            <FadeInStaggered className="grid grid-cols-3 gap-8 mt-20 ">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="group bg-transparent border-1  shadow-none hover:bg-white">
                  <div className=" rounded-full w-20 h-20 bg-white mx-auto flex items-center justify-center mb-4">
                    23
                  </div>
                  <CardContent className="">
                    <h3 className="font-bold text-center h-10 group group-hover:text-black text-white text-2xl">
                      Learn
                    </h3>
                    <div className="mx-auto mt-1 text-center text-xs text-gray-300 group-hover:text-white">
                      Lorem ipsum dolor sit amet, consectetur dolorili adipiscing elit. Felis donec
                      massa aliqua.
                    </div>
                  </CardContent>
                </Card>
              ))}
            </FadeInStaggered>
          </div>
        </div>
      </section>

      <section className="light py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white">
        <div className="container px-4 md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto text-center">
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <span className="text-[45px] font-black mb-2">
                <NumberTicker value={100} className="text-primary" />
              </span>
              <h5 className="text-lg font-medium opacity-80">Completed Event</h5>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <span className="text-[45px] text-primary font-black mb-2">
                <NumberTicker value={12} className="text-primary" />k
              </span>
              <h5 className="text-lg font-medium opacity-80">Game Completed</h5>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <span className="text-[45px] font-black mb-2 text-primary">
                <NumberTicker className="text-primary" value={97} /> +
              </span>
              <h5 className="text-lg font-medium opacity-80">Completed Fund</h5>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <span className="text-[45px] font-black mb-2 text-primary">
                <NumberTicker value={97} className="text-primary" />
              </span>
              <h5 className="text-lg font-medium opacity-80">Completed Ticket</h5>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
