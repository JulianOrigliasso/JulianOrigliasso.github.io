import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { CreatePropertyDialog } from "./components/CreatePropertyDialog"
import { PropertyCard } from "./components/PropertyCard"
import { Home, FileText } from "lucide-react"
import { LoginForm } from "./components/LoginForm"
import { RegisterForm } from "./components/RegisterForm"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./components/SearchBar"
import { PropertyListingPage } from "./components/PropertyListingPage"
import { ProtectedRoute } from "./components/ProtectedRoute"

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  currency?: string;
}

interface Property {
  id: number
  title: string
  description: string
  price: number
  currency: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  owner_id: number
  photos: string[]
  mainPhoto?: string
  owner: {
    id: number
    email: string
    name?: string
    is_active: boolean
  }
}

function App() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async (searchParams?: SearchParams) => {
    try {
      setLoading(true)
      setError(null)
      let url = `${import.meta.env.VITE_API_URL}/properties/`

      if (searchParams && Object.values(searchParams).some(value => value !== undefined)) {
        url = `${import.meta.env.VITE_API_URL}/properties/search/`
        const queryParams = new URLSearchParams()
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString())
        })
        url += `?${queryParams}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const { isAuthenticated, logout } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Crypto Real Estate</h1>
            </Link>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/my-properties">
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      My Properties
                    </Button>
                  </Link>
                  <CreatePropertyDialog onPropertyCreated={fetchProperties} />
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline">Login / Register</Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <>
                <SearchBar onSearch={fetchProperties} />
                {loading && (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <p className="text-zinc-500">Loading properties...</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}
                {!loading && !error && properties.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-500">No properties listed yet.</p>
                  </div>
                )}
                {!loading && !error && properties.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(property => (
                      <PropertyCard
                        key={property.id}
                        {...property}
                        owner={property.owner}
                      />
                    ))}
                  </div>
                )}
              </>
            } />
            <Route path="/my-properties" element={
              <ProtectedRoute>
                <PropertyListingPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <div className="max-w-md mx-auto">
                  <LoginForm />
                  <p className="text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-600">
                      Register
                    </Link>
                  </p>
                </div>
              )
            } />
            <Route path="/register" element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <div className="max-w-md mx-auto">
                  <RegisterForm />
                  <p className="text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-600">
                      Login
                    </Link>
                  </p>
                </div>
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
