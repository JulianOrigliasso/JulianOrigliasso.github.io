export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: 'BTC' | 'ETH';
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'house' | 'apartment' | 'condo';
  owner_id: number;
  payment_status: 'AVAILABLE' | 'PENDING' | 'SOLD';
  payment_address: string | null;
  last_updated: string;
}
