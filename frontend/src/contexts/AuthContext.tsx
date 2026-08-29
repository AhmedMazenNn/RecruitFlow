import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../services/api'

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'recruiter'
  avatar_url: string
  is_active: boolean
  is_superuser?: boolean
  created_at: string
  updated_at: string
}

function isAdmin(user: User | null): boolean {
  return user?.role === 'admin' || !!user?.is_superuser
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<User>
  logout: () => Promise<void>
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
}

interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirm: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      api
        .get('/auth/users/me/')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login/', { email, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await api.get('/auth/users/me/')
    setUser(me.data)
  }

  const register = async (registerData: RegisterData) => {
    const { data } = await api.post('/auth/register/', registerData)
    return data
  }

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      try {
        await api.post('/auth/logout/', { refresh })
      } catch {
        // best-effort: the token may already be blacklisted or expired
      }
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const updateUser = (nextUser: User) => setUser(nextUser)

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: isAdmin(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
