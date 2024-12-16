import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  properties: {
    list: async (): Promise<Property[]> => {
      const response = await fetch(`${API_URL}/api/properties/`);
      return response.json();
    },
    get: async (id: number): Promise<Property> => {
      const response = await fetch(`${API_URL}/api/properties/${id}/`);
      return response.json();
    }
  },
  auth: {
    register: async (data: { email: string; password: string; fullName: string }) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, full_name: data.fullName })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }
      return response.json();
    },
    login: async (username: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
      });
      return response.json();
    }
  }
};
