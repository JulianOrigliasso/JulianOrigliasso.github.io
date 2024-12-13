import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useAuth } from '../context/AuthContext';

interface BuyerProfileFormProps {
  onSubmit?: () => void;
}

export function BuyerProfileForm({ onSubmit }: BuyerProfileFormProps) {
  const [preferredLocation, setPreferredLocation] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profiles/buyer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferred_location: preferredLocation,
          max_budget: maxBudget ? parseFloat(maxBudget) : null,
          user_id: user?.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create buyer profile');
      }

      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create buyer profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Buyer Profile</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Set up your buyer profile to help us find properties that match your preferences.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="preferredLocation" className="block text-sm font-medium mb-1">
            Preferred Location
          </label>
          <Input
            id="preferredLocation"
            type="text"
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
            disabled={loading}
            placeholder="Enter your preferred location"
          />
        </div>
        <div>
          <label htmlFor="maxBudget" className="block text-sm font-medium mb-1">
            Maximum Budget (in ETH)
          </label>
          <Input
            id="maxBudget"
            type="number"
            value={maxBudget}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || parseFloat(value) >= 0) {
                setMaxBudget(value);
              }
            }}
            disabled={loading}
            placeholder="Enter your maximum budget"
            step="0.01"
            min="0"
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Create Buyer Profile'}
        </Button>
      </form>
    </Card>
  );
}
