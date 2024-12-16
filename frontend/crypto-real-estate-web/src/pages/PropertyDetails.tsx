import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PropertyPayment } from "../components/PropertyPayment";
import { useAuth } from "../contexts/AuthContext";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  payment_status: string;
  payment_address: string | null;
}

export function PropertyDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch property details");
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, token]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{property.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Location</p>
              <p>{property.location}</p>
            </div>
            <div>
              <p className="font-medium">Area</p>
              <p>{property.area} m²</p>
            </div>
            <div>
              <p className="font-medium">Bedrooms</p>
              <p>{property.bedrooms}</p>
            </div>
            <div>
              <p className="font-medium">Bathrooms</p>
              <p>{property.bathrooms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PropertyPayment
        propertyId={property.id}
        price={property.price}
        currency={property.currency}
        paymentStatus={property.payment_status}
        paymentAddress={property.payment_address || undefined}
      />
    </div>
  );
}
