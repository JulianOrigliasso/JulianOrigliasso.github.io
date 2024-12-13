import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload, X } from "lucide-react"
import { useAuth } from '../context/AuthContext'
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreatePropertyFormData {
  title: string
  description: string
  price: string
  currency: string
  location: string
  bedrooms: string
  bathrooms: string
  area: string
}

const initialFormData: CreatePropertyFormData = {
  title: '',
  description: '',
  price: '',
  currency: 'BTC',
  location: '',
  bedrooms: '',
  bathrooms: '',
  area: ''
}

const MAX_FILES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function CreatePropertyDialog({ onPropertyCreated }: { onPropertyCreated: () => void }) {
  const { token } = useAuth()
  const [formData, setFormData] = useState<CreatePropertyFormData>(initialFormData)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, and WebP images are allowed.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.'
    }
    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`)
      return
    }

    const invalidFiles = files.map(validateFile).filter(Boolean)
    if (invalidFiles.length > 0) {
      setError(invalidFiles[0])
      return
    }

    setSelectedFiles(prev => [...prev, ...files])
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Create property first
      const propertyResponse = await fetch(`${import.meta.env.VITE_API_URL}/properties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          area: parseFloat(formData.area),
        }),
      })

      if (!propertyResponse.ok) {
        throw new Error('Failed to create property')
      }

      const property = await propertyResponse.json()

      // Upload photos if any
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach(file => {
          formData.append('files', file)
        })

        const uploadResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/properties/${property.id}/photos/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          }
        )

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload photos')
        }
      }

      setFormData(initialFormData)
      setSelectedFiles([])
      setOpen(false)
      onPropertyCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          List Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Luxury Villa"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              required
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beautiful villa with ocean view"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                required
                type="number"
                step="0.000001"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300"
                value={formData.currency}
                onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              required
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Miami Beach"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedrooms</label>
              <Input
                required
                type="number"
                value={formData.bedrooms}
                onChange={e => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                placeholder="4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <Input
                required
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={e => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Area (sqft)</label>
              <Input
                required
                type="number"
                value={formData.area}
                onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="2000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Photos</label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedFiles.length >= MAX_FILES}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <span className="text-sm text-zinc-500">
                {selectedFiles.length}/{MAX_FILES} photos
              </span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleFileSelect}
            />
            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-zinc-500 text-center">
                Uploading photos... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Property'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
