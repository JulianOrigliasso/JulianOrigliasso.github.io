import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface PropertyPaymentProps {
  propertyId: number;
  price: number;
  currency: string;
  paymentStatus: string;
  paymentAddress?: string | null;
}

export function PropertyPayment({ propertyId, price, currency, paymentStatus, paymentAddress }: PropertyPaymentProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          amount: price,
          currency: currency,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to initiate payment");
      }

      // Refresh the page to show updated payment status
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Price:</span>
            <span>{price} {currency}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="capitalize">{paymentStatus.toLowerCase()}</span>
          </div>
          {paymentAddress && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Address:</p>
              <code className="block p-2 bg-gray-100 rounded text-sm break-all">
                {paymentAddress}
              </code>
            </div>
          )}
          {paymentStatus === "AVAILABLE" && (
            <Button
              className="w-full"
              onClick={handleInitiatePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                "Initiate Payment"
              )}
            </Button>
          )}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
