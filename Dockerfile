###############################################
# Install dependencies for ALL workspaces
###############################################
FROM node:20-slim AS base
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install root workspace dependencies
RUN npm install

# Install dependencies for play, back, and all libs
RUN npm --prefix play install
RUN npm --prefix back install
RUN npm --prefix libs/shared-utils install || true
RUN npm --prefix libs/store-utils install || true
RUN npm --prefix libs/tailwind install || true
RUN npm --prefix libs/room-api-clients/room-api-client-js install || true

###############################################
# Build PLAY (front-end)
###############################################
FROM node:20-slim AS play
WORKDIR /app

COPY . .

# Ensure node_modules from base are available
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/play/node_modules ./play/node_modules

RUN npm --prefix play run build

###############################################
# Build BACK (server)
###############################################
FROM node:20-slim AS back
WORKDIR /app

COPY . .

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/back/node_modules ./back/node_modules

RUN npm --prefix back run build

###############################################
# Final Production Image
###############################################
FROM node:20-slim
WORKDIR /app

# Copy built artifacts
COPY --from=play /app/play/dist ./public
COPY --from=back /app/back/dist ./dist

# Copy root package.json for runtime dependencies only
COPY package*.json ./
RUN npm install --omit=dev

ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/index.js"]
