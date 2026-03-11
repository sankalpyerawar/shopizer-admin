#!/usr/bin/env bash
#
# Seed dummy data into Shopizer via the Admin REST API.
# Usage: ./scripts/seed-dummy-data.sh [BASE_URL]
#
set -euo pipefail

BASE_URL="${1:-http://localhost:8080/api}"
read -rp "Username: " USERNAME
read -rsp "Password: " PASSWORD
echo

# Helper: POST with error reporting
api_post() {
  local path="$1" label="$2" payload="$3"
  RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}${path}" \
    -H "${AUTH}" -H "Content-Type: application/json" \
    -d "${payload}")
  CODE=$(echo "${RESP}" | tail -1)
  BODY=$(echo "${RESP}" | sed '$d')
  if [ "${CODE}" = "200" ] || [ "${CODE}" = "201" ]; then
    echo "  ✓ ${label}"
  elif echo "${BODY}" | grep -q "Duplicate entry\|503"; then
    echo "  ✓ ${label} (already exists)"
  else
    echo "  ✗ ${label} (HTTP ${CODE}): ${BODY}"
  fi
}

echo "==> Logging in to ${BASE_URL}..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/v1/private/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"${PASSWORD}\"}")

HTTP_CODE=$(echo "${LOGIN_RESPONSE}" | tail -1)
BODY=$(echo "${LOGIN_RESPONSE}" | sed '$d')

if [ "${HTTP_CODE}" != "200" ]; then
  echo "ERROR: Login failed (HTTP ${HTTP_CODE})"
  echo "${BODY}"
  exit 1
fi

TOKEN=$(echo "${BODY}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
AUTH="Authorization: Bearer ${TOKEN}"
echo "==> Authenticated."

# --- Brands ---
echo "==> Creating brands..."
BRANDS=("Nike" "Adidas" "Puma")
BRAND_CODES=("nike" "adidas" "puma")
for i in 0 1 2; do
  api_post "/v1/private/manufacturer" "${BRANDS[$i]}" "{
    \"code\": \"${BRAND_CODES[$i]}\",
    \"order\": $((i+1)),
    \"descriptions\": [{
      \"language\": \"en\",
      \"name\": \"${BRANDS[$i]}\",
      \"title\": \"${BRANDS[$i]}\",
      \"description\": \"${BRANDS[$i]} official store\"
    }]
  }"
done

# --- Categories ---
echo "==> Creating categories..."
CAT_NAMES=("Electronics" "Clothing" "Home & Kitchen")
CAT_CODES=("electronics" "clothing" "home-kitchen")
for i in 0 1 2; do
  api_post "/v1/private/category" "${CAT_NAMES[$i]}" "{
    \"code\": \"${CAT_CODES[$i]}\",
    \"sortOrder\": $((i+1)),
    \"visible\": true,
    \"parent\": {\"id\": 0, \"code\": \"root\"},
    \"descriptions\": [{
      \"language\": \"en\",
      \"name\": \"${CAT_NAMES[$i]}\",
      \"friendlyUrl\": \"${CAT_CODES[$i]}\",
      \"title\": \"${CAT_NAMES[$i]}\",
      \"description\": \"${CAT_NAMES[$i]} department\"
    }]
  }"
done

# --- Products ---
echo "==> Creating products..."
PROD_NAMES=("Wireless Headphones" "Running Shoes" "Cotton T-Shirt" "Blender Pro" "Laptop Stand")
PROD_SKUS=("WH-1001" "RS-2001" "CT-3001" "BP-4001" "LS-5001")
PROD_PRICES=("49.99" "89.99" "19.99" "59.99" "34.99")
TODAY=$(date +%Y-%m-%d)
for i in 0 1 2 3 4; do
  SLUG=$(echo "${PROD_NAMES[$i]}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
  api_post "/v2/private/product?store=DEFAULT" "${PROD_NAMES[$i]}" "{
    \"identifier\": \"${PROD_SKUS[$i]}\",
    \"sortOrder\": $((i+1)),
    \"visible\": true,
    \"canBePurchased\": true,
    \"dateAvailable\": \"${TODAY}\",
    \"manufacturer\": \"${BRAND_CODES[$((i % 3))]}\",
    \"type\": \"GENERAL\",
    \"price\": ${PROD_PRICES[$i]},
    \"quantity\": $((10 + i * 5)),
    \"productSpecifications\": {
      \"weight\": 1.0
    },
    \"descriptions\": [{
      \"language\": \"en\",
      \"name\": \"${PROD_NAMES[$i]}\",
      \"friendlyUrl\": \"${SLUG}\",
      \"title\": \"${PROD_NAMES[$i]}\",
      \"description\": \"High quality ${PROD_NAMES[$i]}\"
    }]
  }"
done

echo "==> Done. Seeded 3 brands, 3 categories, 5 products."
