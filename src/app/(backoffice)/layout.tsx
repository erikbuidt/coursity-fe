import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/contexts/theme-context'

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </SidebarProvider>
  )
}
