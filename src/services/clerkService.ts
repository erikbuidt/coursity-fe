import type { User } from '@/types/user.type'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const client = await clerkClient()

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (userId != null && sessionClaims.dbId == null) {
    redirect('/api/clerk/syncUsers')
  }

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user: allData && sessionClaims?.dbId != null ? await getUser(sessionClaims.dbId) : undefined,
    redirectToSignIn,
  }
}

export function syncClerkUserMetadata(user: User) {
  return client.users.updateUserMetadata(user.clerk_user_id, {
    publicMetadata: {
      db_user_id: user.id,
      role: user.role,
    },
  })
}

async function getUser(id: unknown) {
  // "use cache"
  // cacheTag(getUserIdTag(id))
  // console.log("Called")
  // return db.query.UserTable.findFirst({
  //   where: eq(UserTable.id, id),
  // })
}
