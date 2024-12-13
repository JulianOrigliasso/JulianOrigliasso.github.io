import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from '../context/AuthContext';

interface SellerProfileFormProps {
  onSubmit?: () => void;
}

export function SellerProfileForm({ onSubmit }: SellerProfileFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/seller`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user?.id,
          verification_status: 'PENDING',
          rating: 0.0,
          total_listings: 0,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create seller profile');
      }

      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create seller profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Seller Profile</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Create your seller profile to start listing properties. Your profile will be reviewed for verification.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Seller Profile'}
        </Button>
      </form>
    </Card>
  );
}
