import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import { Loader2, Home, Bath, MapPin } from "lucide-react";
import { Property } from "../types/property";

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await api.properties.list();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = propertyType === "all" || property.type === propertyType;
      const matchesBedrooms = bedrooms === "any" || property.bedrooms >= Number(bedrooms);
      const matchesPrice =
        Number(property.price) >= priceRange[0] && Number(property.price) <= priceRange[1];

      return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
    });
    setFilteredProperties(filtered);
  }, [searchQuery, properties, propertyType, bedrooms, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <div className="flex flex-wrap gap-4">
          <div className="w-72">
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-72">
            <p className="text-sm text-muted-foreground mb-2">Price Range</p>
            <Slider
              defaultValue={[0, 1000000]}
              max={1000000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(priceRange[0])} {properties[0]?.currency || 'ETH'}</span>
              <span>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 8, minimumFractionDigits: 2 }).format(priceRange[1])} {properties[0]?.currency || 'ETH'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`}>
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} bath
                    </div>
                  </div>
                  <p className="font-bold text-lg">
                    {new Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 8,
                      minimumFractionDigits: 2
                    }).format(property.price)} {property.currency}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No properties found
          </div>
        )}
      </div>
    </div>
  );
}
