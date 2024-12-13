#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Kill any existing FastAPI processes
pkill -f "uvicorn" || true

# Start the FastAPI server in the background
echo "Starting FastAPI server..."
poetry run python reset_db.py && poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload --port 8002 &
SERVER_PID=$!

# Wait for server to start
sleep 5

BASE_URL="http://localhost:8002/api"

echo "=== Testing User Registration and Profiles ==="

# Test 1: Register user with BUYER profile
echo "1. Registering buyer user..."
BUYER_REGISTER=$(curl -s -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "testpass123",
    "name": "Buyer User",
    "profile_type": "BUYER",
    "wallet_address": "0x1234567890abcdef1234567890abcdef12345678"
  }')

if [[ $BUYER_REGISTER == *"email"* ]]; then
  echo -e "${GREEN}✓ Buyer registration successful${NC}"
else
  echo -e "${RED}✗ Buyer registration failed${NC}"
  echo $BUYER_REGISTER
fi

# Test 2: Register user with SELLER profile
echo "2. Registering seller user..."
SELLER_REGISTER=$(curl -s -X POST "${BASE_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "testpass123",
    "name": "Seller User",
    "profile_type": "SELLER",
    "wallet_address": "0x2234567890abcdef1234567890abcdef12345678"
  }')

if [[ $SELLER_REGISTER == *"email"* ]]; then
  echo -e "${GREEN}✓ Seller registration successful${NC}"
else
  echo -e "${RED}✗ Seller registration failed${NC}"
  echo $SELLER_REGISTER
fi

# Test 3: Login as seller
echo "3. Logging in as seller..."
SELLER_LOGIN=$(curl -s -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "testpass123"
  }')
SELLER_TOKEN=$(echo $SELLER_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [[ -n "$SELLER_TOKEN" ]]; then
  echo -e "${GREEN}✓ Seller login successful${NC}"
else
  echo -e "${RED}✗ Seller login failed${NC}"
  echo $SELLER_LOGIN
fi

# Test 4: Create property as seller
echo "4. Creating property as seller..."
PROPERTY_RESPONSE=$(curl -s -X POST "${BASE_URL}/properties/" \
  -H "Authorization: Bearer ${SELLER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "description": "A test property listing",
    "price": 500000,
    "currency_type": "ETH",
    "location": "Test Location",
    "bedrooms": 3,
    "bathrooms": 2,
    "square_feet": 2000,
    "photos": []
  }')

if [[ $PROPERTY_RESPONSE == *"id"* ]]; then
  echo -e "${GREEN}✓ Property creation successful${NC}"
  PROPERTY_ID=$(echo $PROPERTY_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
else
  echo -e "${RED}✗ Property creation failed${NC}"
  echo $PROPERTY_RESPONSE
fi

# Test 5: Login as buyer
echo "5. Logging in as buyer..."
BUYER_LOGIN=$(curl -s -X POST "${BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "testpass123"
  }')
BUYER_TOKEN=$(echo $BUYER_LOGIN | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [[ -n "$BUYER_TOKEN" ]]; then
  echo -e "${GREEN}✓ Buyer login successful${NC}"
else
  echo -e "${RED}✗ Buyer login failed${NC}"
  echo $BUYER_LOGIN
fi

# Test 6: Try to create property as buyer (should fail)
echo "6. Attempting property creation as buyer (should fail)..."
BUYER_PROPERTY_RESPONSE=$(curl -s -X POST "${BASE_URL}/properties/" \
  -H "Authorization: Bearer ${BUYER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "description": "A test property listing",
    "price": 500000,
    "currency_type": "ETH",
    "location": "Test Location",
    "bedrooms": 3,
    "bathrooms": 2,
    "square_feet": 2000,
    "photos": []
  }')

if [[ $BUYER_PROPERTY_RESPONSE == *"Only sellers can create properties"* ]]; then
  echo -e "${GREEN}✓ Property creation correctly denied for buyer${NC}"
else
  echo -e "${RED}✗ Property creation unexpectedly succeeded for buyer${NC}"
  echo $BUYER_PROPERTY_RESPONSE
fi

# Test 7: View property as buyer (should succeed)
echo "7. Viewing property as buyer..."
VIEW_RESPONSE=$(curl -s -X GET "${BASE_URL}/properties/" \
  -H "Authorization: Bearer ${BUYER_TOKEN}")

if [[ $VIEW_RESPONSE == *"Test Property"* ]]; then
  echo -e "${GREEN}✓ Property viewing successful${NC}"
else
  echo -e "${RED}✗ Property viewing failed${NC}"
  echo $VIEW_RESPONSE
fi

# Clean up
echo "Cleaning up..."
kill $SERVER_PID

echo "=== All tests completed ==="
