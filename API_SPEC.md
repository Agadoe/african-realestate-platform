# API_SPEC.md — Scervy Peak Backend API

Base URL: `https://african-realestate-platform.onrender.com/api`

**Auth:** JWT Bearer token in `Authorization` header. Public endpoints require no auth. Protected endpoints require `Authorization: Bearer <token>`.

**Error format:**
```json
{ "error": "Human-readable error message" }
```

---

## Auth — `/api/auth`

### `POST /auth/register`
Register a new user.

**Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "password": "string (required)",
  "role": "buyer | owner | agent (default: buyer)"
}
```
**Response 200:**
```json
{
  "token": "<jwt>",
  "user": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "string",
    "createdAt": "ISO date"
  }
}
```

---

### `POST /auth/login`
**Body:** `{ "email": "string", "password": "string" }`
**Response 200:** Same as register

---

### `POST /auth/refresh`
Refresh JWT token.
**Body:** `{ }` (requires `Authorization` header)
**Response 200:** `{ "token": "<new jwt>" }`

---

### `POST /auth/forgot-password`
**Body:** `{ "email": "string" }`
**Response 200:** `{ "message": "Reset email sent" }`

---

### `POST /auth/reset-password`
**Body:** `{ "token": "string", "newPassword": "string" }`
**Response 200:** `{ "message": "Password updated" }`

---

## Properties — `/api/properties`

### `GET /api/properties`
Get all properties with filtering + pagination.

**Query params:**
| Param | Type | Notes |
|-------|------|-------|
| page | number | default 1 |
| limit | number | default 12 |
| propertyType | string | apartment, house, land, commercial |
| listingType | string | sale, rent, rent-to-own |
| minPrice | number | GHS |
| maxPrice | number | GHS |
| bedrooms | number | |
| bathrooms | number | |
| city | string | regex match |
| sortBy | string | default createdAt |
| order | asc\|desc | default desc |

**Response 200:**
```json
{
  "properties": [Property],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

---

### `GET /api/properties/:id`
Get single property by ID.

**Response 200:** `{ Property }`

---

### `POST /api/properties/search`
Advanced search (body, not query params).

**Body:**
```json
{
  "query": "string (optional)",
  "filters": {
    "propertyType": "string",
    "listingType": "string",
    "minPrice": 0,
    "maxPrice": 0,
    "bedrooms": 0,
    "city": "string"
  },
  "page": 1,
  "limit": 12
}
```
**Response 200:** `{ "properties": [Property], "total": 0, "page": 1, "pages": 1 }`

---

### `POST /api/properties` 🔒
Create a property listing (auth required, owner or agent role).

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "GHS | USD",
  "propertyType": "apartment | house | land | commercial",
  "listingType": "sale | rent | rent-to-own",
  "bedrooms": 0,
  "bathrooms": 0,
  "area": 0,
  "areaUnit": "sqm | sqft",
  "yearBuilt": 0,
  "condition": "good | excellent | fair",
  "features": ["string"],
  "amenities": ["string"],
  "images": [{ "url": "string", "public_id": "string" }],
  "address": {
    "street": "string",
    "city": "string",
    "region": "string",
    "country": "string"
  }
}
```

---

### `PUT /api/properties/:id` 🔒
Update property (owner/agent of that listing only).

---

### `DELETE /api/properties/:id` 🔒
Delete property (owner/agent of that listing only).

---

### `GET /api/properties/my-listings` 🔒
Get authenticated user's own listings.

---

### `GET /api/properties/favorites/:userId` 🔒
Get user's favorited properties.

---

### `POST /api/properties/favorites/:userId` 🔒
Add property to favorites. **Body:** `{ "propertyId": "string" }`

---

### `DELETE /api/properties/favorites/:userId/:propertyId` 🔒
Remove from favorites.

---

### `GET /api/properties/recommendations/:userId` 🔒
AI-powered recommendations for a user (stub — requires AI service integration).

---

## Agents — `/api/agents`

### `GET /api/agents`
Get all agents with pagination.

**Query:** `?page=1&limit=12&specialization=<type>&verified=true|false`

**Response 200:**
```json
{
  "agents": [Agent],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

---

### `GET /api/agents/:id`
**Response 200:** `{ Agent }`

---

### `GET /api/agents/:id/reviews`
**Response 200:** `{ "reviews": [Review], "averageRating": 4.5 }`

---

### `PUT /api/agents/:id` 🔒
Update agent profile (own profile only).

---

## Neighborhoods — `/api/neighborhoods`

### `GET /api/neighborhoods`
**Query:** `?city=Accra&page=1&limit=12&search=<query>`
**Response 200:**
```json
{
  "neighborhoods": [Neighborhood],
  "total": 0,
  "page": 1,
  "pages": 1
}
```

---

### `GET /api/neighborhoods/:id`
**Response 200:** `{ Neighborhood }`

---

### `GET /api/neighborhoods/:id/intelligence`
Market intelligence for a neighborhood.

**Response 200:**
```json
{
  "neighborhoodId": "string",
  "safetyScore": 8,
  "investmentScore": 7,
  "rentalDemand": "high",
  "priceTrends": "appreciating",
  "averagePrice": 450000,
  "totalListings": 24
}
```

---

## Upload — `/api/upload`

### `POST /api/upload/image` 🔒
Upload single property image (max 10MB, auth required).

**Body:** `multipart/form-data` with `image` field.

**Response 200:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "african-realestate/properties/...",
  "width": 1200,
  "height": 800,
  "format": "jpg"
}
```

---

### `POST /api/upload/images` 🔒
Upload up to 10 images.

**Body:** `multipart/form-data` with `images` field (array).

**Response 200:**
```json
{
  "images": [{ "url": "...", "public_id": "...", "width": 1200, "height": 800, "format": "jpg" }],
  "count": 3
}
```

---

### `DELETE /api/upload` 🔒
Delete an image. **Body:** `{ "public_id": "string" }`

---

## Property Schema

```typescript
interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: 'GHS' | 'USD';
  propertyType: 'apartment' | 'house' | 'land' | 'commercial';
  listingType: 'sale' | 'rent' | 'rent-to-own';
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqm' | 'sqft';
  yearBuilt: number;
  condition: 'good' | 'excellent' | 'fair';
  status: 'active' | 'pending' | 'sold' | 'inactive';
  features: string[];
  amenities: string[];
  images: Array<{ url: string; public_id: string }>;
  address: { street: string; city: string; region: string; country: string };
  agentId?: Agent;
  ownerId?: User;
  views: number;
  inquiries: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Agent Schema

```typescript
interface Agent {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyName: string;
  licenseNumber: string;
  specialization: 'residential' | 'commercial' | 'land' | 'luxury';
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearsExperience: number;
  totalTransactions: number;
  responseTime: string;
  createdAt: Date;
}
```

## Neighborhood Schema

```typescript
interface Neighborhood {
  _id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  country: string;
  imageUrl: string;
  averagePrice: number;
  priceTrends: 'appreciating' | 'stable' | 'declining';
  totalListings: number;
  safetyRating: number;
  walkability: number;
  amenities: string[];
}
```