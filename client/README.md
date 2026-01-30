# Client (React + Vite) — find-addis (Project README)

**Purpose:** This file documents how to run and build the frontend for the find-addis project. The app consumes the `find-addis` API (default `http://localhost:3000/api`).

---

## Functional Highlights

- Browse restaurants, view details, filter by category/rating.
- Users: signup/login, add favorites, write reviews.
- Owners: signup/login, add restaurants, manage own restaurants.

---

## How to run (dev)

1. Install

```bash
cd client
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the app at the URL printed by Vite (usually `http://localhost:5173`).

---

## Build & Preview (production)

```bash
npm run build
npm run preview # or npm start
```

---

## Environment configuration

- Recommended: add `VITE_API_URL` to `.env` to avoid hard-coded `http://localhost:3000` strings.

Example `.env`

```
VITE_API_URL="http://localhost:3000"
```

---

## Linting

```bash
npm run lint
```

---

---

## Configuration hygiene

- Some files reference the API base URL directly (for example, `http://localhost:3000`). For production, centralize the base URL using `VITE_API_URL` and an HTTP client helper (see suggested `src/utils/api.js` above).
- Images are sent as base64; keep payloads within the server limit (default `5MB`) or use dedicated storage (e.g., S3 or Cloudinary) for large media.

---

If you'd like, I can open a PR to replace the remaining direct API calls with the centralized helper and add `VITE_API_URL` to the repository's environment templates.
