#!/bin/bash

# Test user registration and profile creation
echo "Testing user registration with profile..."
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "profile_type": "SELLER"
  }'

# Test profile retrieval
echo "\nTesting profile retrieval..."
curl -X GET http://localhost:8000/api/profiles/me \
  -H "Authorization: Bearer ${TOKEN}"

# Test property creation as seller
echo "\nTesting property creation as seller..."
curl -X POST http://localhost:8000/api/properties \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "description": "A test property listing",
    "price": 100000,
    "currency_type": "USD",
    "location": "Test Location",
    "square_feet": 1000,
    "photos": []
  }'

# Test property creation as buyer (should fail)
echo "\nTesting property creation as buyer (should fail)..."
curl -X POST http://localhost:8000/api/properties \
  -H "Authorization: Bearer ${BUYER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "description": "A test property listing",
    "price": 100000,
    "currency_type": "USD",
    "location": "Test Location",
    "square_feet": 1000,
    "photos": []
  }'

# Test profile update
echo "\nTesting profile update..."
curl -X PUT http://localhost:8000/api/profiles/me \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_type": "BOTH"
  }'
