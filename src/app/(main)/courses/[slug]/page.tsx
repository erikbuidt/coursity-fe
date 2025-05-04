import Collapse from '@/components/custom/collapse'
import Rating from '@/components/custom/rating'
import { StickyCardWrapper } from '@/components/custom/sticky-card'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Check,
  MonitorPlay,
  Trophy,
  File,
  MonitorSmartphone,
  ShoppingCart,
  Globe,
} from 'lucide-react'
import Link from 'next/link'

function CourseDetail() {
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
                <BreadcrumbPage>Python</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="bg-black ">
        <div className="container md:max-w-5xl lg:max-w-6xl py-8">
          <div className="grid grid-cols-12 gap-6 text-white">
            <div className="relative col-span-8">
              <h1 className="text-4xl font-bold ">Python</h1>
              <div className="mt-4 ">
                Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node,
                React, PostgreSQL, Web3 and DApps
              </div>
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
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Learn the basics of Python programming
              </li>
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Build real-world applications with Python
              </li>
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Understand data structures and algorithms
              </li>
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Work with databases and APIs
              </li>
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Deploy applications to the cloud
              </li>
              <li className="flex items-center mt-2 w-[50%] ">
                <Check className="mr-2 text-primary" /> Master web development with Python
              </li>
            </ul>
          </div>
          <h3 className="font-bold text-2xl pt-4">Requirements</h3>
          <ul className="flex flex-col font-semibold text-gray-600 text-sm">
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Learn the basics of Python programming
            </li>
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Build real-world applications with Python
            </li>
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Understand data structures and algorithms
            </li>
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Work with databases and APIs
            </li>
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Deploy applications to the cloud
            </li>
            <li className="flex items-center mt-2">
              <Check className="mr-2 text-primary" /> Master web development with Python
            </li>
          </ul>
          <h3 className="font-bold text-2xl my-4">Course content</h3>
          <Collapse title="What is your return policy?">
            <p>You can return any item within 30 days of purchase. No questions asked!</p>
          </Collapse>

          <Collapse title="How do I contact support?" className="mb-10">
            <ul className="flex flex-col">
              <li className="flex gap-4 items-center px-2 py-2 hover:bg-accent">
                <MonitorPlay className="text-primary" size={20} />
                <span>String Manipulation and Code Intelligence</span>
                <div className="ml-auto text-sm text-gray-400">20:00</div>
              </li>
              <li className="flex gap-4 items-center px-2 py-2 hover:bg-accent">
                <MonitorPlay className="text-primary" size={20} />
                <span>String Manipulation and Code Intelligence</span>
                <div className="ml-auto text-sm text-gray-400">20:00</div>
              </li>
            </ul>
          </Collapse>
        </div>
        <div className="col-span-4">
          <div className="sticky top-60">
            <Card className="py-0 gap-0 overflow-hidden relative top-[-218px]">
              <div>
                <HeroVideoDialog
                  className="block dark:hidden shadow-none"
                  animationStyle="top-in-bottom-out"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                  thumbnailAlt="Hero Video"
                />
              </div>
              <CardContent className="py-6">
                <div className="text-2xl font-bold text-red-600">1.500.000 ₫</div>
                <div className="text-md font-semibold text-gray-500 line-through">2.000.000 ₫</div>
                <ul>
                  <div className="font-bold text-xl mb-3">This course includes:</div>
                  <li className="flex items-center">
                    <MonitorPlay className="mr-2" /> 61 hours on-demand video
                  </li>
                  <li className="flex items-center mt-2">
                    <MonitorSmartphone className="mr-2" /> Access on mobile and TV
                  </li>
                  <li className="flex items-center mt-2">
                    <Trophy className="mr-2" /> Certificate of completion
                  </li>
                  <li className="flex items-center mt-2">
                    <File className="mr-2" /> 66 articles
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Button className="w-full mt-4">Enroll Now</Button>
                  <Button className="w-full" variant="outline">
                    <ShoppingCart />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetail
