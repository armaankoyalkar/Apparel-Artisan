# Apparel Artisan

A full-stack MERN storefront: a React catalog with cart and checkout, backed by an Express/MongoDB API with JWT authentication.

## Features

- Product catalog with category browsing, product detail pages, and size selection
- Registration and login with JWT-based authentication (passwords hashed with bcrypt)
- Persistent per-user cart — add, update quantity, and remove items, checked against live stock
- Checkout that validates the shipping address, decrements inventory, and creates an order
- Order history for the logged-in user
- Admin-protected product management endpoints (create, update, delete)
- Sample product data via a seed script

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, React Router 6, Create React App |
| Backend  | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Auth     | JSON Web Tokens, bcryptjs |

## Project structure

```
ecommerce-website/
├── Dockerfile              # builds frontend + backend into one image
├── ecommerce-backend/      # Express API
│   ├── config/db.js        # MongoDB connection
│   ├── middleware/         # JWT auth (protect, admin)
│   ├── models/             # User, Product, Cart, Order (Mongoose schemas)
│   ├── routes/             # authRoutes, productRoutes, cartRoutes, orderRoutes
│   ├── seed.js             # populates sample products
│   └── server.js           # app entry point
└── ecommerce-frontend/     # React app (Create React App)
    └── src/App.js          # routes, pages, and API calls
```

## API reference

All routes are mounted under `/api`. Private routes require an `Authorization: Bearer <token>` header (the token returned by register/login).

| Method | Route                       | Access  | Description |
|--------|------------------------------|---------|--------------|
| POST   | `/api/auth/register`         | Public  | Create an account, returns a JWT |
| POST   | `/api/auth/login`             | Public  | Log in, returns a JWT |
| GET    | `/api/products`               | Public  | List all products |
| GET    | `/api/products/:id`           | Public  | Get one product |
| POST   | `/api/products`               | Admin   | Create a product |
| PUT    | `/api/products/:id`           | Admin   | Update a product |
| DELETE | `/api/products/:id`           | Admin   | Delete a product |
| GET    | `/api/cart`                   | Private | Get the current user's cart |
| POST   | `/api/cart/add`               | Private | Add an item (`productId`, `qty`) |
| PUT    | `/api/cart/update/:productId` | Private | Change an item's quantity |
| DELETE | `/api/cart/remove/:productId` | Private | Remove an item |
| GET    | `/api/orders`                 | Private | List the current user's orders |
| POST   | `/api/orders`                 | Private | Checkout the current cart |

## Environment variables

Set these for the backend (a `.env` file in `ecommerce-backend/` for local dev, or your host's environment settings in production):

| Variable        | Required | Description |
|-----------------|----------|--------------|
| `MONGODB_URI`   | Yes      | MongoDB connection string (local or Atlas) |
| `JWT_SECRET`    | Yes      | Any long, random string used to sign auth tokens |
| `CLIENT_ORIGIN` | No       | Frontend URL, for CORS. Defaults to `http://localhost:3000`. Not needed when frontend and backend are served from the same origin (see Docker below) |
| `PORT`          | No       | Defaults to `5000` |

For the frontend, `REACT_APP_API_URL` controls where API calls are sent. It's read at **build time**, not runtime — Create React App bakes it into the compiled JS.

## Run locally (without Docker)

Prerequisites: Node.js 20+ and a MongoDB instance (local, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster).

1. **Backend:**
   ```bash
   cd ecommerce-backend
   npm install
   ```
   Create a `.env` file in `ecommerce-backend/` with `MONGODB_URI` and `JWT_SECRET` (see table above).
   ```bash
   npm run seed   # optional: adds sample products
   npm run dev    # starts on http://localhost:5000
   ```

2. **Frontend**, in a second terminal:
   ```bash
   cd ecommerce-frontend
   npm install
   npm start      # starts on http://localhost:3000
   ```
   By default it calls the API at `http://localhost:5000/api`; override with a `REACT_APP_API_URL` env var if your backend runs elsewhere.

## Run with Docker

The root `Dockerfile` builds the frontend and backend into a single image: the backend serves the built frontend as static files from the same origin, so no CORS setup is needed.

```bash
docker build -t apparel-artisan .
docker run -p 5000:5000 \
  -e MONGODB_URI="your-connection-string" \
  -e JWT_SECRET="your-secret" \
  apparel-artisan
```

Open `http://localhost:5000` — both the site and the API are served from there.

To build for a different deployed domain (only needed if you split frontend/backend into separate services instead), override the API URL at build time:
```bash
docker build --build-arg REACT_APP_API_URL=https://your-api.com/api -t apparel-artisan .
```

## Deploying

**Render (Docker):** create a Web Service, set Environment to *Docker*, point it at this repo (Dockerfile at the root, build context `.`), and add `MONGODB_URI` and `JWT_SECRET` as environment variables.

**Render (native Node), split into two services:** deploy `ecommerce-backend` as a Web Service (`npm install` / `npm start`) and `ecommerce-frontend` as a Static Site (`npm install && npm run build`, publish directory `build`), with `REACT_APP_API_URL` set to the backend's URL at build time and `CLIENT_ORIGIN` on the backend set to the frontend's URL.

Either way, use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the database if you don't have MongoDB hosted elsewhere.

## Verify a production build

```bash
cd ecommerce-frontend
npm run build
```
