import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SellerProfileFormProps {
  onSubmit: (data: any) => void;
}

export const SellerProfileForm: React.FC<SellerProfileFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Seller Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Name
            </label>
            <Input name="businessName" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Information
            </label>
            <Input name="contactInfo" required />
          </div>
          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </div>
      </form>
    </Card>
  );
};
