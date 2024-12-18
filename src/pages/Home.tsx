import { Bitcoin, HomeIcon, BedDouble, Bath, CircleDollarSign, CheckCircle2, Clock, Ban, Key } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useAuth0 } from "@auth0/auth0-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PropertyListing {
  id: number
  title: string
  location: string
  price: string
  type: string
  beds: number
  baths: number
  size: string
  features: string[]
  image: string
  status: 'active' | 'under_offer' | 'sold' | 'leased'
}

const mockListings: PropertyListing[] = [
  {
    id: 1,
    title: "Modern Apartment",
    location: "Sydney CBD",
    price: "250 BTC",
    type: "Apartment",
    beds: 2,
    baths: 2,
    size: "2285",
    features: ["Air Conditioning", "Parking", "Gym"],
    image: "https://placehold.co/600x400",
    status: "active"
  },
  {
    id: 2,
    title: "Beachfront Villa",
    location: "Gold Coast",
    price: "450 ETH",
    type: "House",
    beds: 4,
    baths: 3,
    size: "43250",
    features: ["Pool", "Garden", "Ocean View"],
    image: "https://placehold.co/600x400",
    status: "under_offer"
  },
  {
    id: 3,
    title: "City Penthouse",
    location: "Melbourne",
    price: "380 BTC",
    type: "Penthouse",
    beds: 3,
    baths: 2,
    size: "32150",
    features: ["Balcony", "Security", "City Views"],
    image: "https://placehold.co/600x400",
    status: "sold"
  }
]

export default function HomePage() {
  const { isAuthenticated } = useAuth0()

  const handleStatusUpdate = (listingId: number, newStatus: string) => {
    // In production, this would update the status in the backend
    console.log(`Updating listing ${listingId} status to ${newStatus}`)
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      {/* Search Section */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Find Your Dream Home with Crypto</h1>
        <div className="rounded-lg border shadow-md">
          <Command>
            <CommandInput placeholder="Search properties (e.g., 'Sydney 2 bedroom apartment', 'Gold Coast house with pool')" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggested">
                <CommandItem className="flex items-center gap-2 p-2">
                  <HomeIcon className="h-4 w-4 text-gray-500" />
                  <span>Sydney Apartments</span>
                </CommandItem>
                <CommandItem className="flex items-center gap-2 p-2">
                  <Bitcoin className="h-4 w-4 text-orange-500" />
                  <span>Properties under 100 BTC</span>
                </CommandItem>
                <CommandItem className="flex items-center gap-2 p-2">
                  <HomeIcon className="h-4 w-4 text-gray-500" />
                  <span>3+ Bedrooms with Pool</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>

      {/* Property Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockListings.map((listing, index) => (
          <Card key={index} className="overflow-hidden">
            <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <HomeIcon size={16} />
                    <span>{listing.location}</span>
                    <span>•</span>
                    <span>{listing.type}</span>
                  </div>
                </div>
                {isAuthenticated ? (
                  <Select
                    defaultValue={listing.status}
                    onValueChange={(value) => handleStatusUpdate(listing.id, value)}
                  >
                    <SelectTrigger className={`w-40 flex items-center gap-2 ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800 border border-green-300' :
                      listing.status === 'under_offer' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                      listing.status === 'sold' ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {listing.status === 'active' && <CheckCircle2 size={16} />}
                      {listing.status === 'under_offer' && <Clock size={16} />}
                      {listing.status === 'sold' && <Ban size={16} />}
                      {listing.status === 'leased' && <Key size={16} />}
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">ACTIVE</SelectItem>
                      <SelectItem value="under_offer">UNDER OFFER</SelectItem>
                      <SelectItem value="sold">SOLD</SelectItem>
                      <SelectItem value="leased">LEASED</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800 border border-green-300' :
                    listing.status === 'under_offer' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    listing.status === 'sold' ? 'bg-red-100 text-red-800 border border-red-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {listing.status === 'active' && <CheckCircle2 size={16} />}
                    {listing.status === 'under_offer' && <Clock size={16} />}
                    {listing.status === 'sold' && <Ban size={16} />}
                    {listing.status === 'leased' && <Key size={16} />}
                    {listing.status.replace('_', ' ').toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {listing.price.includes('BTC') ? (
                  <Bitcoin className="text-orange-500" size={24} />
                ) : (
                  <CircleDollarSign className="text-blue-500" size={24} />
                )}
                <p className="text-2xl font-bold">{listing.price}</p>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <span>{listing.size} sqm</span>
                <span className="flex items-center gap-1">
                  <BedDouble size={16} /> {listing.beds}
                </span>
                <span className="flex items-center gap-1">
                  <Bath size={16} /> {listing.baths}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {listing.features.map((feature, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              <Button className="w-full">View Property</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
