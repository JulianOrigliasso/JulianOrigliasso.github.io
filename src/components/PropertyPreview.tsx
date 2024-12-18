import React from 'react'
import { Bitcoin, CircleDollarSign } from 'lucide-react'

export interface PropertyFormData {
  title: string
  location: string
  type: string
  size: string
  bedrooms: string
  bathrooms: string
  parking: string
  currency: string
  price: string
  description: string
  features: string[]
  images: File[]
  status: 'draft' | 'published'
  lastSaved?: Date
}

interface PropertyPreviewProps {
  data: PropertyFormData
}

export function PropertyPreview({ data }: PropertyPreviewProps) {
  const getCurrencyIcon = () => {
    if (data.currency === 'btc') {
      return <Bitcoin className="text-orange-500" size={20} />
    }
    return <CircleDollarSign className="text-blue-500" size={20} />
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{data.title || 'Untitled Property'}</h2>
      <p className="text-gray-600 mb-2">{data.location || 'Location not specified'}</p>

      <div className="flex items-center gap-2 text-lg font-semibold mb-4">
        {data.price && data.currency && (
          <>
            {getCurrencyIcon()}
            <span>{data.price} {data.currency.toUpperCase()}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
        <div>
          <span className="font-medium">Bedrooms:</span> {data.bedrooms || '-'}
        </div>
        <div>
          <span className="font-medium">Bathrooms:</span> {data.bathrooms || '-'}
        </div>
        <div>
          <span className="font-medium">Parking:</span> {data.parking || '-'}
        </div>
      </div>

      {data.type && (
        <div className="mb-4">
          <span className="font-medium">Type:</span>{' '}
          <span className="capitalize">{data.type}</span>
        </div>
      )}

      {data.size && (
        <div className="mb-4">
          <span className="font-medium">Size:</span> {data.size} sqm
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700">{data.description || 'No description available'}</p>
      </div>

      {data.features.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Features</h3>
          <div className="flex flex-wrap gap-2">
            {data.features.map(feature => (
              <span key={feature} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
