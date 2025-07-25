'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createMongoAbility, type AnyAbility } from '@casl/ability'
import { Permit, permitState } from 'permit-fe-sdk'

interface AbilityContextType {
  ability: AnyAbility | undefined
  userRoles: string[]
  isLoading: boolean
}

export const AbilityContext = createContext<AbilityContextType>({
  ability: undefined,
  userRoles: [],
  isLoading: true,
})

export const useAbilityContext = () => {
  return useContext(AbilityContext)
}

// Helper hooks for easier access to specific parts
export const useUserRoles = () => {
  const { userRoles } = useAbilityContext()
  return userRoles
}

export const useIsAdmin = () => {
  const { userRoles } = useAbilityContext()
  return userRoles.includes('admin')
}

export const useAbility = () => {
  const { ability } = useAbilityContext()
  return ability
}

export const AbilityLoader = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser()
  const [ability, setAbility] = useState<AnyAbility | undefined>(undefined)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getAbilityAndRoles = async (loggedInUser: string) => {
      setIsLoading(true)

      try {
        // Fetch user roles from Permit.io
        const rolesResponse = await fetch(`/api/permit-io/roles?user=${loggedInUser}`)
        let roles: string[] = []
        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          roles = rolesData.roles || []
        }

        setUserRoles(roles)

        // Get CASL ability
        const permit = Permit({
          loggedInUser: loggedInUser,
          backendUrl: '/api/permit-io/abilities',
        })

        await permit.loadLocalStateBulk([
          // Permission for layout
          { action: 'view', resource: 'admin_area' },
          { action: 'view', resource: 'instructor_area' },
          // Permission for course
          { action: 'read', resource: 'course' },
          { action: 'create', resource: 'course' },
          { action: 'delete', resource: 'course' },
          { action: 'publish', resource: 'course' },
          { action: 'review', resource: 'course' },
          { action: 'update', resource: 'course' },
          // Permission for page
          { action: 'view', resource: 'review_page' },
          { action: 'view', resource: 'dashboard_page' },
          { action: 'view', resource: 'course_management_page' },
          { action: 'view', resource: 'performance_page' },
        ])
        const caslConfig = permitState.getCaslJson()

        const caslAbility = caslConfig?.length ? createMongoAbility(caslConfig) : undefined
        setAbility(caslAbility)
      } catch (error) {
        console.error('Error loading ability and roles:', error)
        setUserRoles([])
        setAbility(undefined)
      } finally {
        setIsLoading(false)
      }
    }

    if (isSignedIn && user?.publicMetadata?.db_user_id) {
      const userId = user.publicMetadata.db_user_id as string
      getAbilityAndRoles(userId)
    } else {
      setIsLoading(false)
      setUserRoles([])
      setAbility(undefined)
    }
  }, [isSignedIn, user])

  return (
    <AbilityContext.Provider value={{ ability, userRoles, isLoading }}>
      {children}
    </AbilityContext.Provider>
  )
}
