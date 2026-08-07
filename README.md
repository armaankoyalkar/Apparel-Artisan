# Apparel Artisan

A full-stack apparel storefront with a responsive React catalog, persistent cart, account authentication, checkout, and order history.

## What is included

- Product catalog with search, category filtering, product detail, stock state, and size selection
- Guest cart persisted in the browser; authenticated cart synchronization
- Registration and login using JWT authentication
- Checkout with shipping address validation, inventory reduction, and order history
- Admin-protected product API routes and a sample data seed command

## Run locally

Prerequisites: Node.js 20+ and a running MongoDB instance (local MongoDB or Atlas).

1. Configure the API:

   ```powershell
   cd ecommerce-backend
   Copy-Item .env.example .env
   ```

   Set a secure `JWT_SECRET` in `.env`. Update `MONGODB_URI` if your MongoDB instance is not the local default.

2. Install and seed the API:

   ```powershell
   npm install
   npm run seed
   npm run dev
   ```

3. In a second terminal, run the frontend:

   ```powershell
   cd ecommerce-frontend
   npm install
   npm start
   ```

Open `http://localhost:3000`. The frontend calls the API at `http://localhost:5000/api` by default; override it with `REACT_APP_API_URL` when needed.

## Verification

```powershell
cd ecommerce-frontend
npm run build
```

The production build completes successfully in the repaired project.
