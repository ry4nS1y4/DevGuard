import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, Role } from '@/types'

interface AuthState {
  token: string | null
  user: {
    email: string
    firstName: string
    lastName: string
    role: Role
  } | null
  isAuthenticated: boolean
  setAuth: (response: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (response: AuthResponse) =>
        set({
          token: response.token,
          user: {
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role,
          },
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'devguard-auth',
    }
  )
)
