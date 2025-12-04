###############################################
# 1. Build protobuf messages
###############################################
FROM node:20-slim AS proto
WORKDIR /app/messages
COPY messages/package*.json ./
COPY messages/protos ./protos
RUN npm install
RUN npm run ts-proto

###############################################
# 2. Build PLAY (front-end)
###############################################
FROM node:20-slim AS play
WORKDIR /app
COPY package*.json ./
COPY libs ./libs
COPY play ./play
RUN npm install
RUN npm --prefix play install
RUN npm --prefix play run build

###############################################
# 3. Build BACK (server)
###############################################
FROM node:20-slim AS back
WORKDIR /app
COPY package*.json ./
COPY libs ./libs
COPY back ./back

# Copy protobuf generated files into back service
COPY --from=proto /app/messages/ts-proto-generated ./libs/messages/ts-proto-generated
COPY --from=proto /app/messages/generated ./libs/messages/generated

RUN npm install
RUN npm --prefix back install
RUN npm --prefix back run build

###############################################
# 4. Final runtime image
###############################################
FROM node:20-slim
WORKDIR /app

# Copy built artifacts
COPY --from=play /app/play/dist ./public
COPY --from=back /app/back/dist ./dist

# Install only runtime dependencies
COPY package*.json ./
RUN npm install --omit=dev

ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/index.js"]
