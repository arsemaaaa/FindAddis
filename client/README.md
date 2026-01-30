# FindAddis

A small React + Vite project with an Express + MongoDB backend. This README describes how to run the app locally.

## Prerequisites
- Node.js (16+ recommended)
- npm
- MongoDB (local `mongod`) or a MongoDB Atlas connection string

## Run locally (Frontend + Backend)

1) Frontend (run from project root):

```bash
cd "C:\Users\PC\Downloads\ReactProject-zip\ReactProject\FindAddis"
npm install
npm run dev
```

Vite will print a local URL (e.g. `http://localhost:5173` or another available port).

2) Backend (in a separate terminal):

```bash
cd backend
npm install
node server.js
```

The backend defaults to port `5000` and uses the `MONGO_URI` environment variable to connect to MongoDB.

Create `backend/.env` (already added in this repo) with values like:

```
MONGO_URI=mongodb://localhost:27017/findaddis
PORT=5000
```

3) Seed sample data (optional):

```bash
curl http://localhost:5000/api/seed
```

4) Verify:
- Restaurants API: `http://localhost:5000/api/restaurants`
- Frontend: visit the Vite URL printed by `npm run dev`.

## Notes
- Bootstrap is included and used sparingly for Navbar, Buttons, Forms and Grid.
- If MongoDB is not running locally, replace `MONGO_URI` in `backend/.env` with your Atlas connection string.
- Do not commit secrets. `backend/.env` in this repository should be replaced with safe values before sharing publicly.

## Development tips
- To enable automatic backend reloads, install `nodemon` and run `npx nodemon server.js` from the `backend` folder.
- Linting: `npm run lint` (configured in the root `package.json`).

If you want, I can add a GitHub Actions workflow to run tests/lint on push.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
