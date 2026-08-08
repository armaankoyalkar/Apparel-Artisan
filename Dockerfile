
# --- Stage 1: build the React frontend ---
FROM node:20-alpine AS frontend-build
 
WORKDIR /app/frontend
 
COPY ecommerce-frontend/package*.json ./
RUN npm ci
 
COPY ecommerce-frontend/ ./
 
# Both frontend and backend are served from this one container on the same
# origin, so the frontend can call the API with a relative path — no need
# to know the deployed domain ahead of time, and no CORS involved.
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
 
RUN npm run build
 
# --- Stage 2: backend, serving the built frontend as static files ---
FROM node:20-alpine
 
WORKDIR /app
 
COPY ecommerce-backend/package*.json ./
RUN npm ci --omit=dev
 
COPY ecommerce-backend/ ./
 
# server.js serves anything in ./public and falls back to index.html for
# client-side routes, so drop the built frontend straight in there.
COPY --from=frontend-build /app/frontend/build ./public
 
ENV NODE_ENV=production
EXPOSE 5000
 
USER node
 
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --spider -q http://localhost:5000/ || exit 1
 
CMD ["node", "server.js"]