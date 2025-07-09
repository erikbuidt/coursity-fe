'use client'
import { ThemeSwitch } from '@/components/custom/theme-switch'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/contexts/theme-context'
import { SignedIn, UserButton } from '@clerk/nextjs'

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppSidebar />
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
      </ThemeProvider>
    </SidebarProvider>
  )
}
