# Server (Express + MongoDB) — find-addis

**Purpose:** Backend API for find-addis. Implements authentication (users & owners), restaurant CRUD, reviews and favorites. The server runs on `http://localhost:3000` by default.

---

## 🔧 Technical Overview

- Node + Express
- MongoDB + Mongoose
- JWT-based authentication for users & owners
- Nodemailer used for sending verification emails

---

## ✅ Getting started

Prerequisites

- Node 18+ and npm
- MongoDB (local or Atlas)

Install

```bash
cd server
npm install
```

Environmental variables
Create a `.env` file in `server/` (see `.env.example` below). Required vars:

- `PORT` (optional, default 3000)
- `MONGO_URI` (mongodb connection string)
- `JWT_SECRET` (secret for signing tokens)
- `EXPIRESIN` (token expiry, e.g. `1d`)
- `EMAIL` (sender Gmail address for verification emails)
- `EMAILPASS` (Gmail app password)

Example `.env` (server)

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/findaddis
JWT_SECRET=supersecretkey
EXPIRESIN=1d
EMAIL=your.email@gmail.com
EMAILPASS=your-app-password
```

Run server (dev)

```bash
npm run dev
# uses nodemon to restart on changes
```

Run server (production)

```bash
npm start
```

---

## 📦 Models & Example Payloads

User (signup)

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Restaurant (owner add)

```json
{
  "name": "Cafe Roma",
  "category": "Italian",
  "address": "123 Main St",
  "price": "$$",
  "images": ["base64string"],
  "hours": "9:00-21:00",
  "description": "Cozy italian cafe",
  "menu": ["pizza", "pasta"],
  "location": { "lat": 9.0, "lng": 38.7 }
}
```

Review (user)

```json
{ "rating": 4, "text": "Great food!" }
```

---

## �️ Collections & Data Model

Below is an overview of how documents are organized, sample schemas and example documents. The current implementation uses small embedded review objects inside `restaurants.reviews`, but below we show both the embedded (current) and a normalized approach (recommended when reviews grow large).

### Users (collection: `users`)

- Fields: `_id`, `name`, `email` (unique), `password` (hashed), `isVerified`, `token`, `emailVerificationExpiry`, `favorites` (array of ObjectId]

Mongoose (example):

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: Boolean,
  token: String,
  emailVerificationExpiry: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "restaurants" }],
});
```

Example document:

```json
{
  "_id": "64b...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "favorites": ["64a...", "64b..."]
}
```

---

### Owners (collection: `owners`)

- Fields: `_id`, `name`, `email`(unique), `password`, `phoneNumber` (array), `isVerified`, `restaurantsOwned` (array of ObjectId)

Example document:

```json
{
  "_id": "64o...",
  "name": "Alice Owner",
  "email": "owner@example.com",
  "restaurantsOwned": ["64r..."]
}
```

---

### Restaurants (collection: `restaurants`)

- Fields: `_id`, `name`, `category`, `rating`, `price`, `address`, `images`, `hours`, `description`, `menu`, `location` (lat/lng)
- Two design options for reviews:
  1. Embedded (current): `reviews` is an array of small subdocuments stored inside the restaurant document.
  2. Normalized (recommended at scale): `reviews` are stored in their own `reviews` collection and referenced by `restaurantId` (and optionally by the restaurant as an array of review ids or via query/populate).

Mongoose (embedded example):

```js
const reviewSchema = new mongoose.Schema({
  userId: String,
  rating: Number,
  text: String,
  date: Date,
});
const restaurantSchema = new mongoose.Schema({
  name: String,
  category: String,
  rating: Number,
  reviews: [reviewSchema],
  location: { lat: Number, lng: Number },
});
```

Example document (embedded):

```json
{
  "_id": "64r...",
  "name": "Cafe Roma",
  "reviews": [{ "userId": "64u...", "rating": 4, "text": "Great" }]
}
```

Mongoose (normalized review model):

```js
const Review = mongoose.model(
  "reviews",
  new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurants" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    rating: Number,
    text: String,
    date: Date,
  }),
);
```

Example review document (normalized):

```json
{
  "_id": "64rev...",
  "restaurantId": "64r...",
  "userId": "64u...",
  "rating": 4,
  "text": "Great food!",
  "date": "2024-01-01T12:00:00Z"
}
```

To fetch a restaurant with its normalized reviews you can run a query like:

```js
// Option A: get restaurant then query reviews
const restaurant = await Restaurant.findById(id);
const reviews = await Review.find({ restaurantId: id });

// Option B: aggregate with $lookup
const result = await Restaurant.aggregate([
  { $match: { _id: ObjectId(id) } },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "restaurantId",
      as: "reviews",
    },
  },
]);
```

---

### Favorites

- Implementation: `users.favorites` is an array of ObjectId referencing `restaurants`.
- This allows quick retrieval of a user's favorite restaurants via `User.findById(userId).populate('favorites')`.

---

### Indexes & Performance

- Ensure indexing on frequently queried fields:
  - `users.email` (unique)
  - `restaurants.category` and `restaurants.rating` for filtered queries
  - `reviews.restaurantId` when reviews are normalized
- If using embedded reviews, watch document sizes (MongoDB max document size is 16MB).

---

## �🔐 Authentication

- Authenticated endpoints expect a header:
  Authorization: Bearer <token>
- Tokens are issued on successful login for both users and owners.

---

## 🧭 Endpoints (full list with examples)

Base URL: `http://localhost:3000/api`

Users

- GET `/users` — Get all users (no auth)
  - Example: `GET /api/users`
  - Response: `{ users: [...] }`

- POST `/users` — Register a new user
  - Body: `{ name, email, password }`
  - Example cURL:
    ```bash
    curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"Jane","email":"jane@example.com","password":"pass123"}'
    ```
  - Response: 201 on success, sends a verification email

- GET `/users/verify?token=...&email=...` — Verify user email
  - Example: `GET /api/users/verify?token=abc&email=jane@example.com`
  - Response: 200 and message on success

- POST `/users/login` — Login user
  - Body: `{ email, password }`
  - Response: `{ token: "<JWT>", expiresIn: "<EXPIRESIN>" }`

- POST `/users/favorites/:restaurantId` — Add restaurant to user's favorites (requires user auth)
  - Header: `Authorization: Bearer <token>`
  - Response: 200 and updated list of favorite restaurant objects
  - Example cURL:
    ```bash
    curl -X POST http://localhost:3000/api/users/favorites/64b123... -H "Authorization: Bearer $TOKEN"
    ```

- GET `/users/favorites` — Get user's favorites (requires user auth)
  - Header: `Authorization: Bearer <token>`

- DELETE `/users/favorites/:restaurantId` — Remove from favorites (requires user auth)
  - Header: `Authorization: Bearer <token>`

Restaurant Owners

- POST `/owners` — Register owner
  - Body: `{ name, email, password, phoneNumber }` (phoneNumber is an array)
  - Sends verification email

- GET `/owners/verify?token=...&email=...` — Verify owner email

- POST `/owners/login` — Owner login
  - Response: `{ token, expiresIn }` (token includes role: 'owner')

- GET `/owners/restaurants` — Get restaurants owned by the authenticated owner (requires owner auth)
  - Header: `Authorization: Bearer <token>`
  - Example response: `[{...}, {...}]`

Restaurants

- POST `/restaurants` — Create a new restaurant (requires owner auth)
  - Body: Restaurant object (see model example above)
  - Header: `Authorization: Bearer <owner-token>`
  - Example cURL:
    ```bash
    curl -X POST http://localhost:3000/api/restaurants -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Cafe","category":"Cafe","address":".."}'
    ```
  - Response: 201 with created restaurant object

- POST `/restaurants/:id/reviews` — Add a review to a restaurant (requires user auth)
  - Header: `Authorization: Bearer <user-token>`
  - Body: `{ rating: Number, text: String }`
  - Response: 201 with `{ rating, reviews }

- GET `/restaurants` — List restaurants (supports queries)
  - Query params: `?category=Italian&rating=4`
  - Response: 200 with an array of restaurants

- PATCH `/restaurants/:id` — Update restaurant (requires owner auth)
  - Body: partial restaurant fields to update
  - Header: `Authorization: Bearer <owner-token>`

- DELETE `/restaurants/:id` — Delete restaurant (requires owner auth)
  - Header: `Authorization: Bearer <owner-token>`
  - Response: 200 on success

---

## 💥 Error cases & status codes (common)

- 400 — Bad request or operation not allowed (e.g., non-owner attempting owner-only ops)
- 401 — No token provided or Invalid token
- 403 — Forbidden (role mismatch)
- 404 — Resource not found
- 409 — Conflict (e.g., duplicate email, duplicate review by same user)

---

## 🔧 Troubleshooting & Tips

- If emails fail, check `EMAIL` and `EMAILPASS` in `.env` and ensure Gmail app passwords are set or use a robust transactional email service.
- If images fail, make sure JSON payload sizes are within the `5mb` limit set by the server.
- Run `npm run dev` to get helpful nodemon restarts during development.

---

If you'd like, I can add an OpenAPI / Swagger spec (auto-generated) for these endpoints and add a Postman collection to the repo.
