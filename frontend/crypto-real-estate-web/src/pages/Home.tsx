import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Search, Home as HomeIcon, Bath, MapPin, Bitcoin, DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { Property } from "../types/property";

// Mock data for the mockup
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Modern Beachfront Villa",
    description: "Luxurious beachfront villa with stunning ocean views",
    price: 12.5,
    currency: "BTC",
    location: "Miami Beach, FL",
    bedrooms: 4,
    bathrooms: 3,
    area: 450,
    owner_id: 1,
    payment_status: "AVAILABLE",
    payment_address: null,
    last_updated: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Downtown Luxury Penthouse",
    description: "Spectacular penthouse in the heart of Manhattan",
    price: 150,
    currency: "ETH",
    location: "Manhattan, NY",
    bedrooms: 3,
    bathrooms: 2,
    area: 300,
    owner_id: 1,
    payment_status: "AVAILABLE",
    payment_address: null,
    last_updated: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Contemporary Mountain Retreat",
    description: "Modern mountain home with breathtaking views",
    price: 8.8,
    currency: "BTC",
    location: "Aspen, CO",
    bedrooms: 5,
    bathrooms: 4,
    area: 550,
    owner_id: 1,
    payment_status: "AVAILABLE",
    payment_address: null,
    last_updated: new Date().toISOString(),
  }
];

export function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await api.properties.list();
        setFeaturedProperties(properties.slice(0, 6)); // Get up to 6 featured properties
      } catch (error) {
        console.error("Error fetching properties:", error);
        // Use mock data as fallback
        setFeaturedProperties(mockProperties);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Dream Home with Crypto</h1>
          <p className="text-xl text-muted-foreground">
            Browse exclusive properties available for purchase with Bitcoin, Ethereum, and more
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Search by location, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <p className="text-muted-foreground">Exclusive listings available for crypto payment</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/properties">View All Properties</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <HomeIcon className="h-4 w-4 mr-1" />
                      {property.bedrooms} bed
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} bath
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">
                      {property.price} {property.currency}
                    </p>
                    {property.currency === "BTC" ? (
                      <Bitcoin className="h-5 w-5 text-orange-500" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to List Your Property?</h3>
          <p className="text-xl text-muted-foreground">Join the crypto real estate revolution</p>
          <Button size="lg" asChild>
            <Link to="/properties/new">List Your Property</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
