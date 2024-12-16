import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Loader2, Home, Bath, MapPin } from "lucide-react";
import { Property } from "../types/property";

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    const filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <div className="w-72">
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                    {property.price} {property.currency}
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
