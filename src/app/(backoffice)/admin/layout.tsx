'use client'
import Guard from '@/components/custom/guard'
import { ThemeSwitch } from '@/components/custom/theme-switch'
import { AppSidebar } from '@/components/layout/app-sidebar'
import type { NavItem } from '@/components/layout/types'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { LayoutDashboard, ScanEye } from 'lucide-react'
// Menu items.
const items: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },

  {
    title: 'Reviews',
    url: '/admin/reviews',
    icon: ScanEye,
  },
]
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Guard action="view" resource="admin_area">
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
    </Guard>
  )
}
