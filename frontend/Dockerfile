FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app (creates dist directory)
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]