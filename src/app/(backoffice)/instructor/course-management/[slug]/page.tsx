import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/admin/course-management/${slug}/goal`)
}
