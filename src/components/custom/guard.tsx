// components/Guard.tsx
'use client' // This component will use client-side hooks

import { useAbilityContext } from '@/contexts/ability-context' // Adjust path if needed
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Forbidden from './403' // Your 403 page/component

interface GuardProps {
  resource: string
  action: string
  resourceAttributes?: Record<string, unknown>
  children: React.ReactNode
  // Optional: You can add a loading fallback prop if you want to customize it
  loadingFallback?: React.ReactNode
  // Optional: If you want to explicitly redirect rather than render a component
  // unauthorizedRedirectPath?: string;
}

function Guard({
  resource,
  action,
  children,
  resourceAttributes,
  loadingFallback = (
    <div className="flex w-full justify-center items-center min-h-screen text-gray-600">
      Loading content...
    </div>
  ),
}: GuardProps) {
  const { isLoaded: clerkLoaded } = useAuth()
  const { user } = useUser()
  const { ability, userRoles, isLoading: abilityLoading } = useAbilityContext()

  // State to track if the permission check has definitively concluded
  const [permissionChecked, setPermissionChecked] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Only proceed if Clerk authentication is loaded, Ability is loaded, and not loading
    if (clerkLoaded && ability !== undefined && user && !abilityLoading) {
      // Custom ownership check
      const checkOwnership = () => {
        if (resourceAttributes?.ownerId) {
          const currentUserId = (user.publicMetadata.db_user_id as number).toString()
          const resourceOwnerId = resourceAttributes.ownerId.toString()

          return currentUserId === resourceOwnerId
        }
        return false
      }

      // Check ownership first, then fall back to CASL permissions
      let canAccess = false

      if (resourceAttributes?.ownerId) {
        // Check ownership first
        const isOwner = checkOwnership()
        // Check if user is admin by looking at their roles from Permit.io
        const isAdmin = userRoles.includes('admin')

        // For admins, check if they have the general permission
        // For regular users, only grant access if they own the resource
        if (isAdmin) {
          const hasAdminPermission = ability.can(action, resource)
          canAccess = hasAdminPermission
        } else {
          // Regular users can only access resources they own
          canAccess = isOwner
        }
      } else {
        // No ownership check needed, use CASL permissions only
        canAccess = ability.can(action, resource)
      }
      setHasPermission(canAccess)
      setPermissionChecked(true) // Conclude check: permission determined
    }
    // If clerkLoaded or ability is not yet ready, the effect will re-run when they are.
  }, [clerkLoaded, ability, action, resource, resourceAttributes, user, abilityLoading, userRoles])

  // --- Render Logic ---

  // 1. Show loading fallback while authentication or abilities are being loaded
  if (!permissionChecked) {
    return loadingFallback
  }

  // 2. If permission has been checked and denied, render the Forbidden page
  if (!hasPermission) {
    // If you prefer a full URL redirect, you could use:
    // useEffect(() => {
    //   if (!hasPermission && permissionChecked && unauthorizedRedirectPath) {
    //     router.replace(unauthorizedRedirectPath); // Use replace to avoid back button issues
    //   }
    // }, [hasPermission, permissionChecked, router, unauthorizedRedirectPath]);
    // And then here you'd return null or a simple loading spinner temporarily.
    return <Forbidden />
  }

  // 3. If permission has been checked and granted, render the children
  return <>{children}</>
}

export default Guard
