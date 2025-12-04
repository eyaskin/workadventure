# ==========================
# Build protobuf + back
# ==========================
FROM --platform=$BUILDPLATFORM node:22.16-bullseye-slim AS proto-builder
WORKDIR /usr/src
COPY messages/package-lock.json messages/package.json ./
RUN npm ci
COPY messages .
COPY libs ./../libs
RUN npm run tag-version && npm run ts-proto

# ==========================
# Build FRONTEND
# ==========================
FROM node:22.16-bullseye-slim AS front-builder
WORKDIR /usr/src/front
COPY front/package.json front/package-lock.json ./
RUN npm ci
COPY front .
RUN npm run build

# ==========================
# Build PUSHER
# ==========================
FROM node:22.16-bullseye-slim AS pusher-builder
WORKDIR /usr/src/pusher
COPY pusher/package.json pusher/package-lock.json ./
RUN npm ci
COPY pusher .
RUN npm run build

# ==========================
# Build BACKEND (uses protobuf)
# ==========================
FROM node:22.16-bullseye-slim AS back-builder
WORKDIR /usr/src
COPY package.json package-lock.json ./
COPY back/package.json back/package.json
COPY libs/messages/package.json libs/messages/package.json
COPY libs/map-editor/package.json libs/map-editor/package.json
COPY libs/math-utils/package.json libs/math-utils/package.json
COPY libs/tailwind/package.json libs/tailwind/package.json
COPY libs/store-utils/package.json libs/store-utils/package.json
COPY libs/shared-utils/package.json libs/shared-utils/package.json

ENV NODE_ENV=production
RUN npm ci --omit=dev --workspace workadventureback

COPY libs ./libs
COPY --from=proto-builder /usr/libs/messages/src ./libs/messages/src
COPY back ./back
COPY --from=proto-builder /usr/src/generated ./back/src/Messages/generated

RUN mkdir -p /usr/src/back/dist

# ==========================
# FINAL IMAGE
# ==========================
FROM node:22.16-bullseye-slim

WORKDIR /usr/src

# Install tools
RUN apt-get update && apt-get install -y curl && \
    npm install -g concurrently http-server

# Copy compiled assets
COPY --from=front-builder /usr/src/front/dist ./front/dist
COPY --from=pusher-builder /usr/src/pusher ./pusher
COPY --from=back-builder /usr/src/back ./back

EXPOSE 10000

# Create startup script
RUN printf "#!/bin/bash\n\
concurrently -k \\\n\
  \"node /usr/src/back/dist/src\" \\\n\
  \"node /usr/src/pusher/dist/src\" \\\n\
  \"http-server /usr/src/front/dist -p \$PORT\" \n" \
> /usr/src/start.sh

RUN chmod +x /usr/src/start.sh

ENV PORT=10000

CMD [\"/usr/src/start.sh\"]
