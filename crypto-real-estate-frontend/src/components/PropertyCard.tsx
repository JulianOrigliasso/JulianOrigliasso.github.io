import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Home, Bath, Maximize2, Bitcoin, DollarSign, Image as ImageIcon, Heart, Edit, Trash2 } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { AspectRatio } from "../components/ui/aspect-ratio"
import { useAuth } from '../context/AuthContext'

interface PropertyCardProps {
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
    id: number
    name?: string
    email: string
  }
  onDelete?: (id: number) => Promise<void>
  onEdit?: (id: number) => void
}

export function PropertyCard({
  id,
  title,
  description,
  price,
  currency,
  location,
  bedrooms,
  bathrooms,
  area,
  photos = [],
  mainPhoto,
  owner,
  onDelete,
  onEdit,
}: PropertyCardProps) {
  const { user } = useAuth()
  const CurrencyIcon = currency === 'BTC' ? Bitcoin : DollarSign
  const displayPhotos = []

  // Add main photo if it exists
  if (mainPhoto) {
    displayPhotos.push(mainPhoto)
  }

  // Add other photos
  if (photos && photos.length > 0) {
    displayPhotos.push(...photos.filter(p => p !== mainPhoto))
  }

  // Construct full photo URLs
  const photoUrls = displayPhotos.map(photo => {
    const photoPath = photo.startsWith('/') ? photo : `/${photo}`
    return `${import.meta.env.VITE_API_URL}${photoPath}`
  })

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?') && onDelete) {
      await onDelete(id)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id)
    }
  }

  const isOwner = user?.id === owner.id
  const isBuyerOrBoth = user?.profile_type === 'BUYER' || user?.profile_type === 'BOTH'
  const isSellerOrBoth = user?.profile_type === 'SELLER' || user?.profile_type === 'BOTH'

  return (
    <Card className="w-full max-w-md">
      {photoUrls.length > 0 ? (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {photoUrls.map((photo, index) => (
                <CarouselItem key={index}>
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={photo}
                      alt={`Property photo ${index + 1}`}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <div className="flex items-center justify-center bg-zinc-100 rounded-t-lg h-48">
          <ImageIcon className="w-12 h-12 text-zinc-400" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-zinc-500" />
            <span>{bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-zinc-500" />
            <span>{bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-zinc-500" />
            <span>{area} sqft</span>
          </div>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">{description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <CurrencyIcon className="w-5 h-5 text-zinc-700" />
            <span>{price} {currency}</span>
          </div>
          <div className="text-sm text-zinc-500">
            Posted by: {owner.name || owner.email}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isOwner && isSellerOrBoth ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        ) : isBuyerOrBoth ? (
          <div className="flex gap-2 w-full">
            <Button className="flex-1">
              Contact Owner
            </Button>
            <Button variant="outline" className="w-12">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  )
}
