import CourseManagementClientLayout from './_components/layout'

export default async function CourseManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CourseManagementClientLayout>{children}</CourseManagementClientLayout>
    </>
  )
}
