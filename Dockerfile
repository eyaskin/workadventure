###############################################
# Base step — install ALL workspaces properly
###############################################
FROM node:20-slim AS base
WORKDIR /app

# Copy entire monorepo BEFORE npm install (critical for workspaces!)
COPY . .

# Install dependencies for ALL workspaces
RUN npm install --omit=dev


###############################################
# Build PLAY (front-end)
###############################################
FROM base AS play
WORKDIR /app

RUN npm --prefix play run build


###############################################
# Build BACK (server)
###############################################
FROM base AS back
WORKDIR /app

RUN npm --prefix back run build


###############################################
# Final runtime image
###############################################
FROM node:20-slim
WORKDIR /app

# Copy built artifacts
COPY --from=play /app/play/dist ./public
COPY --from=back /app/back/dist ./dist

# Copy root package.json for runtime deps only
COPY package*.json ./
RUN npm install --omit=dev

ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/index.js"]
