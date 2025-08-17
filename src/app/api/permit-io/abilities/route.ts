import { Permit } from 'permitio'
import type { NextRequest } from 'next/server'

interface ResourceAndAction {
  resource: string
  action: string
  userAttributes?: Record<string, unknown>
  resourceAttributes?: Record<string, unknown>
}

const permit = new Permit({
  token: process.env.PERMIT_API_KEY || '',
  pdp: 'https://cloudpdp.api.permit.io',
})

export async function POST(request: NextRequest) {
  try {
    const { resourcesAndActions }: { resourcesAndActions: ResourceAndAction[] } =
      await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user')
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const checkPermissions = async (resourceAndAction: ResourceAndAction) => {
      const { resource, action, userAttributes, resourceAttributes } = resourceAndAction

      const allowed = await permit.check(
        {
          key: userId,
          attributes: userAttributes,
        },
        action,
        {
          type: resource,
          attributes: resourceAttributes,
          tenant: 'default',
        },
      )

      return allowed
    }

    const permittedList = await Promise.all(resourcesAndActions.map(checkPermissions))

    return new Response(JSON.stringify({ permittedList }), {
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
