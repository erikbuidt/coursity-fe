import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { slug: string } }) {
  redirect(`/admin/course-management/${params.slug}/goal`)
}
