# ---------------------------------------------------
# 1. Build PLAY (front-end + game engine)
# ---------------------------------------------------
FROM node:20-slim AS play-builder
WORKDIR /app
COPY package*.json ./
COPY play ./play
RUN npm install
RUN npm run build --workspace=workadventure-play

# ---------------------------------------------------
# 2. Build BACK (game server)
# ---------------------------------------------------
FROM node:20-slim AS back-builder
WORKDIR /app
COPY package*.json ./
COPY back ./back
RUN npm install
RUN npm run build --workspace=workadventure-back

# ---------------------------------------------------
# 3. Final runtime image
# ---------------------------------------------------
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

# Copy built artifacts
COPY --from=play-builder /app/play/dist ./play/dist
COPY --from=back-builder /app/back/dist ./back/dist

# Install only runtime deps
COPY package*.json ./
RUN npm install --omit=dev

CMD ["node", "back/dist/index.js"]
