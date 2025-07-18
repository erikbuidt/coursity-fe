'use client'
import { ThemeSwitch } from '@/components/custom/theme-switch'
import { AppSidebar } from '@/components/layout/app-sidebar'
import type { NavItem } from '@/components/layout/types'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { BookOpen, ChartBar } from 'lucide-react'
// Menu items.
const items: NavItem[] = [
  {
    title: 'Courses',
    url: '/instructor/course-management',
    icon: BookOpen,
  },
  {
    title: 'Performance',
    url: '/instructor/performance',
    icon: ChartBar,
  },
]

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppSidebar items={items} />
      <div className="w-full px-4">
        <div className="flex">
          <SidebarTrigger />
          <div className="h-fit w-full mr-auto flex justify-end gap-1">
            <ThemeSwitch />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <div className="mt-4 h-[100%]">{children}</div>
      </div>
    </>
  )
}
