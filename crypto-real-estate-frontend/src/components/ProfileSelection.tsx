import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { User } from "lucide-react";

interface ProfileSelectionProps {
  onSelect: (profileType: 'BUYER' | 'SELLER' | 'BOTH') => void;
  defaultValue?: 'BUYER' | 'SELLER' | 'BOTH';
}

export function ProfileSelection({ onSelect, defaultValue }: ProfileSelectionProps) {
  const [selected, setSelected] = useState<'BUYER' | 'SELLER' | 'BOTH'>(defaultValue || 'BUYER');

  const handleSelect = (type: 'BUYER' | 'SELLER' | 'BOTH') => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-6 h-6" />
          Select Profile Type
        </CardTitle>
        <CardDescription>
          Choose how you want to use our platform
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant={selected === 'BUYER' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => handleSelect('BUYER')}
        >
          I want to buy properties
        </Button>
        <Button
          variant={selected === 'SELLER' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => handleSelect('SELLER')}
        >
          I want to sell properties
        </Button>
        <Button
          variant={selected === 'BOTH' ? 'default' : 'outline'}
          className="w-full"
          onClick={() => handleSelect('BOTH')}
        >
          I want to do both
        </Button>
      </CardContent>
    </Card>
  );
}
