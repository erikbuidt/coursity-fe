'use client'
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDuration } from '@/lib/utils'
import { enroll } from '@/services/enrollmentService'
import type { Course } from '@/types/course.type'
import { useAuth } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { File, MonitorPlay, MonitorSmartphone, ShoppingCart, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
interface Props {
  course: Course
}
function SummaryCourse({ course }: Props) {
  const { getToken } = useAuth()
  const [isRegister, setIsRegister] = useState<boolean | null>(null)
  const router = useRouter()
  const handleEnrollCourse = async () => {
    const token = await getToken()
    if (!token) return
    const enrollment = await enroll(course.id, token)
    if (enrollment) {
      setIsRegister(true)
    }
  }
  const renderPrice = () => {
    return course.discount_price ? (
      <>
        <div className="text-2xl font-semibold text-red-600">
          {formatCurrency(course.discount_price)} $
        </div>
        <div className="text-md font-semibold text-gray-500 line-through">
          {formatCurrency(course.price)} $
        </div>
      </>
    ) : (
      <>
        <div className="text-lg font-semibold text-primary">{formatCurrency(course.price)} $</div>
      </>
    )
  }
  return (
    <Card className="py-0 gap-0 overflow-hidden relative top-[-220px]">
      <HeroVideoDialog
        className="block dark:hidden shadow-none"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <CardContent className="py-6">
        <ul>
          {!course.is_enrolled && !isRegister && renderPrice()}
          <div className="font-bold text-xl mb-3">This course includes:</div>
          <li className="flex items-center">
            <MonitorPlay className="mr-2" /> {formatDuration(course.duration)}
            on-demand video
          </li>
          <li className="flex items-center mt-2">
            <MonitorSmartphone className="mr-2" /> Access on mobile and TV
          </li>
          <li className="flex items-center mt-2">
            <Trophy className="mr-2" /> Certificate of completion
          </li>
          <li className="flex items-center mt-2">
            <File className="mr-2" /> {course.lesson_count} articles
          </li>
        </ul>
        <div className="flex flex-col gap-2">
          {course.is_enrolled || isRegister ? (
            <>
              <Button className="w-full mt-4" onClick={() => router.push(`/learn/${course.slug}`)}>
                Learn Now
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full mt-4" onClick={handleEnrollCourse}>
                Enroll Now
              </Button>
              <Button className="w-full" variant="outline">
                <ShoppingCart />
                Add to Cart
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryCourse
