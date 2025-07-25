import { Permit } from 'permitio'
import type { NextRequest } from 'next/server'
const permit = new Permit({
  token: process.env.PERMIT_API_KEY || '',
  pdp: 'https://cloudpdp.api.permit.io',
})
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user')
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const assignedRoles = await permit.api.users.getAssignedRoles({ user: userId })

    return new Response(JSON.stringify({ roles: assignedRoles.map((r) => r.role) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
