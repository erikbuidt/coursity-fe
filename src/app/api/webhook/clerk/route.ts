import { env } from '@/config/env/server'
// import { deleteUser, insertUser, updateUser } from "@/features/users/db/users"
import { syncClerkUserMetadata } from '@/services/clerkService'
import { createClerkUser, deleteClerkUser, updateClerkUser } from '@/services/userService'
import { auth, type WebhookEvent } from '@clerk/nextjs/server'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { NextRequest } from 'next/server'
export async function POST(request: NextRequest) {
  // Get the headers
  let event: WebhookEvent
  console.log('Received webhook request')
  // Verify the payload with the headers
  try {
    event = await verifyWebhook(request, {
      signingSecret: env.CLERK_WEBHOOK_SECRET,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  switch (event.type) {
    case 'user.created':
    case 'user.updated': {
      const email = event.data.email_addresses.find(
        (email) => email.id === event.data.primary_email_address_id,
      )?.email_address
      const name = `${event.data.first_name ?? ''} ${event.data.last_name ?? ''}`.trim()
      if (email == null) return new Response('No email', { status: 400 })
      if (name === '') return new Response('No name', { status: 400 })

      if (event.type === 'user.created') {
        const user = await createClerkUser({
          clerk_user_id: event.data.id,
          email,
          full_name: name,
          image_url: event.data.image_url,
          role: 'student',
        })
        console.log({user})
        await syncClerkUserMetadata(user)
      } else {
        await updateClerkUser({
          clerk_user_id: event.data.id,
          email,
          full_name: name,
          image_url: event.data.image_url,
          role: event.data.public_metadata.role as string,
        })
      }
      break
    }
    case 'user.deleted': {
      if (event.data.id != null) {
        await deleteClerkUser(event.data.id)
      }
      break
    }
    case 'session.created': {
    }
  }

  return new Response('', { status: 200 })
}
