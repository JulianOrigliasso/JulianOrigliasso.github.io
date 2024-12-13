import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ProfileSelectionProps {
  onSelect: (type: 'BUYER' | 'SELLER' | 'BOTH') => void;
}

export const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Select Your Profile Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Buyer</h3>
          <p className="mb-4">Looking to purchase properties</p>
          <Button onClick={() => onSelect('BUYER')} className="w-full">
            Select Buyer
          </Button>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Seller</h3>
          <p className="mb-4">Want to list properties for sale</p>
          <Button onClick={() => onSelect('SELLER')} className="w-full">
            Select Seller
          </Button>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Both</h3>
          <p className="mb-4">Interested in buying and selling</p>
          <Button onClick={() => onSelect('BOTH')} className="w-full">
            Select Both
          </Button>
        </Card>
      </div>
    </div>
  );
};
