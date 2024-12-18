import { Bitcoin, Camera, Plus, CircleDollarSign, Edit, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PropertyPreview } from '@/components/PropertyPreview'

interface PropertyFormData {
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

export default function CreateListing() {
  const { user, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    location: '',
    type: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    currency: '',
    price: '',
    description: '',
    features: [],
    images: [],
    status: 'draft'
  })

  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)

  const validateRequiredFields = () => {
    const requiredFields: (keyof PropertyFormData)[] = [
      'title', 'location', 'type', 'size', 'bedrooms',
      'bathrooms', 'parking', 'currency', 'price', 'description'
    ]
    return requiredFields.every(field =>
      typeof formData[field] === 'string' && formData[field].trim() !== ''
    )
  }

  const handleSaveDraft = async () => {
    if (!isAuthenticated) return
    setFormData(prev => ({
      ...prev,
      lastSaved: new Date(),
      status: 'draft'
    }))
    // TODO: Save to backend
    console.log('Saving draft:', { ...formData, userId: user?.sub })
  }

  const handlePublish = async () => {
    if (!isAuthenticated) return
    // Validate all required fields
    if (!validateRequiredFields()) {
      alert('Please fill in all required fields before publishing')
      return
    }
    setFormData(prev => ({
      ...prev,
      status: 'published'
    }))
    // TODO: Save to backend
    console.log('Publishing:', { ...formData, userId: user?.sub })
    navigate('/')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handlePublish()
  }

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (autoSaveEnabled && formData.title) {
      const timer = setTimeout(() => {
        handleSaveDraft()
      }, 30000) // Auto-save every 30 seconds
      return () => clearTimeout(timer)
    }
  }, [formData, autoSaveEnabled, user?.sub, handleSaveDraft, isAuthenticated])

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg border p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Create Property Listing</h2>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            {previewMode ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Mode
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>

        {previewMode ? (
          <PropertyPreview data={formData} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Modern Beachfront Villa"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Gold Coast, QLD"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">Property Size (sqm)</Label>
                <Input
                  id="size"
                  type="number"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="e.g., 150"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="e.g., 3"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="e.g., 2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="parking">Parking Spaces</Label>
                <Input
                  id="parking"
                  type="number"
                  value={formData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.value)}
                  placeholder="e.g., 2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="text-orange-500" size={16} />
                        <span>Bitcoin (BTC)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="eth">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="text-blue-500" size={16} />
                        <span>Ethereum (ETH)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 25.5"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Property Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your property..."
                className="h-32"
                required
              />
            </div>

            <div>
              <Label>Property Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {['Air Conditioning', 'Pool', 'Garden', 'Gym', 'Security', 'Balcony', 'Ocean View', 'City Views', 'Parking'].map((feature) => (
                  <label key={feature} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Property Images</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button type="button" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Images
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1">
                Publish Listing
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
