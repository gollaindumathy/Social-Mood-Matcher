import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { AuthResponse, UserProfile } from '../types'
import { authApi } from '../api/services'

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  loading: boolean
  login: (data: AuthResponse) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser({
      id: data.userId,
      email: data.email,
      displayName: data.displayName,
      bio: '',
      avatarColor: data.avatarColor,
      createdAt: new Date().toISOString(),
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await authApi.getMe()
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
