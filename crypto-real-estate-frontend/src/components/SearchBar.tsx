import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  currency?: string;
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({})

  const handleSearch = () => {
    onSearch(searchParams)
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm mb-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search properties..."
          value={searchParams.query || ''}
          onChange={(e) => setSearchParams({...searchParams, query: e.target.value})}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Location"
          value={searchParams.location || ''}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />
        <Input
          type="number"
          placeholder="Min Price"
          value={searchParams.minPrice || ''}
          onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
        />
        <Input
          type="number"
          placeholder="Max Price"
          value={searchParams.maxPrice || ''}
          onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Bedrooms"
          value={searchParams.bedrooms || ''}
          onChange={(e) => setSearchParams({...searchParams, bedrooms: e.target.value ? parseInt(e.target.value) : undefined})}
        />
        <Select
          value={searchParams.currency || 'ALL'}
          onValueChange={(value) => setSearchParams({...searchParams, currency: value === 'ALL' ? undefined : value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Currencies</SelectItem>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
