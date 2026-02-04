# Database Schema Documentation

## Overview
This document describes the MongoDB database schema for the FindAddis application. The application uses Mongoose ODM with three main collections: `restaurants`, `users`, and `owners`.

---

## Collections

### 1. Restaurants Collection (`restaurants`)

**Model:** `Restaurant`  
**File:** `server/models/Restaurant.js`

#### Schema Structure

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | Yes | - | Restaurant name |
| `category` | String | Yes | - | Restaurant category (e.g., "Ethiopian", "Cafe") |
| `rating` | Number | Yes | 0 | Average rating (0-5) |
| `price` | String | Yes | - | Price range indicator |
| `address` | String | Yes | - | Physical address of the restaurant |
| `images` | Array[String] | No | [] | Array of image URLs or base64 strings |
| `hours` | String | No | - | Operating hours |
| `description` | String | No | - | Restaurant description |
| `menu` | Array[String] | No | [] | Array of menu items |
| `reviews` | Array[Review] | No | [] | Array of review subdocuments |
| `location.lat` | Number | No | - | Latitude coordinate for map |
| `location.lng` | Number | No | - | Longitude coordinate for map |
| `createdAt` | Date | Auto | - | Timestamp of creation |
| `updatedAt` | Date | Auto | - | Timestamp of last update |

#### Review Subdocument Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | String | No | ID of the user who wrote the review |
| `rating` | Number | No | Rating given (0-5) |
| `text` | String | No | Review text content |
| `date` | Date | No | Date of the review |

#### Example Document

```json
{
  "_id": "ObjectId",
  "name": "Tomoca Coffee",
  "category": "Cafe",
  "rating": 4.5,
  "price": "$$",
  "address": "Bole Road, Addis Ababa",
  "images": ["image1.jpg", "image2.jpg"],
  "hours": "Mon-Sun: 7:00 AM - 10:00 PM",
  "description": "Traditional Ethiopian coffee house",
  "menu": ["Espresso", "Macchiato", "Cappuccino"],
  "reviews": [
    {
      "userId": "user123",
      "rating": 5,
      "text": "Amazing coffee!",
      "date": "2024-01-15T10:00:00Z"
    }
  ],
  "location": {
    "lat": 9.005401,
    "lng": 38.763611
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### 2. Users Collection (`users`)

**Model:** `User`  
**File:** `server/models/User.js`

#### Schema Structure

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | Yes | - | User's full name |
| `email` | String | Yes | - | User's email address (unique) |
| `password` | String | Yes | - | Hashed password |
| `isVerified` | Boolean | No | false | Email verification status |
| `token` | String | No | - | Email verification token |
| `emailVerificationExpiry` | Date | No | - | Token expiration date |
| `favorites` | Array[ObjectId] | No | [] | Array of restaurant IDs (references) |
| `createdAt` | Date | Auto | - | Timestamp of creation |
| `updatedAt` | Date | Auto | - | Timestamp of last update |

#### Relationships
- `favorites`: References `Restaurant` collection via ObjectId

#### Example Document

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$hashed...",
  "isVerified": true,
  "token": null,
  "emailVerificationExpiry": null,
  "favorites": ["restaurantId1", "restaurantId2"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-10T00:00:00Z"
}
```

---

### 3. Restaurant Owners Collection (`owners`)

**Model:** `RestaurantOwners`  
**File:** `server/models/RestaurantOwner.js`

#### Schema Structure

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | String | Yes | - | Owner's full name |
| `email` | String | Yes | - | Owner's email address (unique) |
| `password` | String | Yes | - | Hashed password |
| `phoneNumber` | Array[String] | Yes | [] | Array of phone numbers |
| `isVerified` | Boolean | No | false | Email verification status |
| `emailVerificationExpiry` | Date | No | - | Token expiration date |
| `token` | String | No | - | Email verification token |
| `restaurantsOwned` | Array[ObjectId] | No | [] | Array of restaurant IDs (references) |
| `createdAt` | Date | Auto | - | Timestamp of creation |
| `updatedAt` | Date | Auto | - | Timestamp of last update |

#### Relationships
- `restaurantsOwned`: References `Restaurant` collection via ObjectId

#### Example Document

```json
{
  "_id": "ObjectId",
  "name": "Jane Smith",
  "email": "jane@restaurant.com",
  "password": "$2b$10$hashed...",
  "phoneNumber": ["+251911234567", "+251922345678"],
  "isVerified": true,
  "emailVerificationExpiry": null,
  "token": null,
  "restaurantsOwned": ["restaurantId1", "restaurantId2"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-10T00:00:00Z"
}
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │  Restaurant  │         │   Owner     │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ _id         │◄──┐     │ _id          │     ┌──►│ _id         │
│ name        │   │     │ name         │     │   │ name        │
│ email       │   │     │ category     │     │   │ email       │
│ password    │   │     │ rating       │     │   │ password    │
│ favorites[] │───┼─────┤ reviews[]    │     │   │ phoneNumber │
│             │   │     │ location     │     │   │ restaurants │
└─────────────┘   │     │              │     │   │ Owned[]     │
                  │     └──────────────┘     │   └─────────────┘
                  │            ▲             │
                  │            │             │
                  └────────────┴─────────────┘
                    (Many-to-Many via favorites)
```

### Relationship Details

1. **User ↔ Restaurant (Many-to-Many)**
   - Users can favorite multiple restaurants
   - Stored in `User.favorites` array (references Restaurant._id)

2. **Owner ↔ Restaurant (One-to-Many)**
   - Owners can own multiple restaurants
   - Stored in `RestaurantOwner.restaurantsOwned` array (references Restaurant._id)

3. **User ↔ Review (One-to-Many)**
   - Users can write multiple reviews
   - Stored as subdocuments in `Restaurant.reviews` array
   - Linked via `review.userId` (String, not ObjectId reference)

---

## Indexes

### Recommended Indexes

1. **Users Collection**
   - `email`: Unique index (enforced by schema)
   
2. **Owners Collection**
   - `email`: Unique index (enforced by schema)

3. **Restaurants Collection**
   - `category`: Index for filtering/searching
   - `location.lat`, `location.lng`: Geospatial index for map queries
   - `rating`: Index for sorting

---

## Notes

- All collections use Mongoose's `timestamps: true` option, which automatically adds `createdAt` and `updatedAt` fields
- Password fields should always be hashed before storage (using bcrypt or similar)
- Email verification tokens should have expiration dates set
- Review `userId` is stored as String, not ObjectId reference (consider migrating to ObjectId for referential integrity)
- Images can be stored as base64 strings or URLs depending on implementation

---

## Data Types Reference

- **String**: Text data
- **Number**: Numeric data (ratings, coordinates)
- **Boolean**: True/false values
- **Date**: Timestamp data
- **Array**: List of values
- **ObjectId**: MongoDB ObjectId for references
- **Object**: Nested object (e.g., `location: { lat, lng }`)

---

*Last Updated: Based on current model files in `server/models/`*
