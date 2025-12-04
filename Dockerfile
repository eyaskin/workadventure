###############################################
# 1. Build protobuf messages
###############################################
FROM node:18-slim AS proto
WORKDIR /app
COPY messages/package*.json ./messages/
COPY messages ./messages
COPY libs ./libs
RUN cd messages && npm install && npm run tag-version && npm run ts-proto

###############################################
# 2. Build PLAY (front-end)
###############################################
FROM node:18-slim AS play
WORKDIR /app
COPY package*.json ./
COPY play ./play
COPY libs ./libs
RUN npm install
RUN npm --prefix play install
RUN npm --prefix play run build

###############################################
# 3. Build BACK (server)
###############################################
FROM node:18-slim AS back
WORKDIR /app
COPY package*.json ./
COPY back ./back
COPY libs ./libs
COPY --from=proto /app/messages/src ./libs/messages/src
COPY --from=proto /app/messages/generated ./back/src/Messages/generated
RUN npm install
RUN npm --prefix back install
RUN npm --prefix back run build

###############################################
# 4. Final image (serve front + run back)
###############################################
FROM node:18-slim
WORKDIR /app

# Copy built assets
COPY --from=play /app/play/dist ./public
COPY --from=back /app/back/dist ./dist

# Install only runtime deps
COPY package*.json ./
RUN npm install --omit=dev

ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/index.js"]
