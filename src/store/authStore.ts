import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = { id: string; name: string; email?: string; hospitalName?: string }

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export default create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null })
    }),
    { name: 'carekeep-auth' }
  )
)
