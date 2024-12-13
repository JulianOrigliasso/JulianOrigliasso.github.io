import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  email: string
  name?: string
  wallet_address: string
  profile_type: 'BUYER' | 'SELLER' | 'BOTH'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, profileType: 'BUYER' | 'SELLER' | 'BOTH') => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setToken(storedToken)
          } else {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        } catch (error) {
          console.error('Error checking authentication:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  }

  const register = async (email: string, password: string, name: string, profileType: 'BUYER' | 'SELLER' | 'BOTH') => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        profile_type: profileType
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const fetchUser = async (authToken: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    } else {
      throw new Error('Failed to fetch user data');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
