import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Box,
} from '@mui/material';

interface PropertyListing {
  title: string;
  category: 'Residential' | 'Commercial';
  type: 'House' | 'Apartment' | 'Office' | 'Retail';
  transactionType: 'Sale' | 'Lease';
  price: string;
  cryptoPrice: string;
  cryptoType: 'BTC' | 'ETH' | 'USDT';
  description: string;
  features: string[];
  amenities: string[];
}

export const CreateListing: React.FC = () => {
  const [listing, setListing] = useState<PropertyListing>({
    title: '',
    category: 'Residential',
    type: 'House',
    transactionType: 'Sale',
    price: '',
    cryptoPrice: '',
    cryptoType: 'BTC',
    description: '',
    features: [],
    amenities: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setListing(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting listing:', listing);
    // TODO: Add API call to save listing
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Property Listing
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                name="title"
                value={listing.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={listing.category}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  <MenuItem value="Residential">Residential</MenuItem>
                  <MenuItem value="Commercial">Commercial</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={listing.type}
                  onChange={handleChange}
                  label="Type"
                  required
                >
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Retail">Retail</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  name="transactionType"
                  value={listing.transactionType}
                  onChange={handleChange}
                  label="Transaction Type"
                  required
                >
                  <MenuItem value="Sale">Sale</MenuItem>
                  <MenuItem value="Lease">Lease</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price (AUD)"
                name="price"
                type="number"
                value={listing.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Crypto Price"
                name="cryptoPrice"
                type="number"
                value={listing.cryptoPrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Crypto Type</InputLabel>
                <Select
                  name="cryptoType"
                  value={listing.cryptoType}
                  onChange={handleChange}
                  label="Crypto Type"
                  required
                >
                  <MenuItem value="BTC">BTC</MenuItem>
                  <MenuItem value="ETH">ETH</MenuItem>
                  <MenuItem value="USDT">USDT</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={listing.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Create Listing
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateListing;
