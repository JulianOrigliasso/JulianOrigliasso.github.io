import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type CryptoCurrency = "BTC" | "ETH" | "USDC";

interface CreatePropertyForm {
  title: string;
  description: string;
  location: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  currency: CryptoCurrency;
  area: string;
}

export function CreateProperty() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePropertyForm>({
    title: "",
    description: "",
    location: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    currency: "ETH",
    area: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
          price: parseFloat(form.price),
          area: parseFloat(form.area),
        }),
      });

      if (response.ok) {
        navigate("/properties");
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to create property. Please try again.");
      }
    } catch (err) {
      setError("Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: CreatePropertyForm) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>List Your Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                name="title"
                placeholder="Property Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="property_type"
                placeholder="Property Type"
                value={form.property_type}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="bedrooms"
                type="number"
                min="0"
                placeholder="Bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                required
              />
              <Input
                name="bathrooms"
                type="number"
                min="0"
                placeholder="Bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="price"
                type="number"
                step="0.000001"
                min="0"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
              />
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div className="space-y-2">
              <Input
                name="area"
                type="number"
                step="0.01"
                min="0"
                placeholder="Area (square meters)"
                value={form.area}
                onChange={handleChange}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Property...
                </>
              ) : (
                "Create Property"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
