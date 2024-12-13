import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PropertyCard } from './PropertyCard'
import { CreatePropertyDialog } from './CreatePropertyDialog'
import { Loader2 } from 'lucide-react'

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
  photos: string[]
  mainPhoto?: string
  owner: {
    name?: string
    email: string
  }
}

export function PropertyListingPage() {
  const { token } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties/my/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }

      const data = await response.json()
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <CreatePropertyDialog onPropertyCreated={fetchProperties} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-4">You haven't listed any properties yet.</p>
          <CreatePropertyDialog onPropertyCreated={fetchProperties} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      )}
    </div>
  )
}
