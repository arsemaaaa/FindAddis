# find-addis

**Short description:** find-addis is a small React + Express + MongoDB application to discover and review restaurants. The repo contains a `client` (React + Vite) and a `server` (Express + MongoDB) folder.

---

## ⚙️ Structure

- `client/` — React frontend (Vite)
- `server/` — Express API server (MongoDB)

---

## 🔧 Quick start

Prerequisites

- Node 18+ / npm or yarn
- MongoDB (local or Atlas)

Install

```bash
# from repository root
npm install
# or install separately under each subfolder
cd client && npm install
cd ../server && npm install
```

Development

Run both services concurrently (recommended)

```bash
# from repository root (uses npm workspaces + concurrently)
npm install
npm run dev
```

Run individually (alternatives)

```bash
# run server in dev (nodemon)
cd server && npm run dev
# run client in dev (Vite)
cd client && npm run dev
```

Production (build & serve frontend + run server)

```bash
# build frontend
cd client && npm run build
# serve client/build with any static file server (Nginx, serve, etc.) or configure server to serve static files
# run server
cd server && npm start
```

---

## 📚 Contributing & Notes

- Follow the existing code style and ESLint in `client/` (use `npm run lint`).
- If you add new env vars, document them in `server/.env.example` (see `server/README.md`).

---

> For more details about usage, roadmap and endpoints, see `client/README.md` and `server/README.md`.
