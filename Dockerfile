###############################################
# Build PLAY (front-end)
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
# Build BACK (server)
###############################################
FROM node:20-slim AS back
WORKDIR /app
COPY package*.json ./
COPY libs ./libs
COPY back ./back

# Copy PREGENERATED protobuf files
COPY messages/ts-proto-generated ./libs/messages/ts-proto-generated
COPY messages/generated ./libs/messages/generated

RUN npm install --omit=dev
RUN npm --prefix back install --omit=dev
RUN npm --prefix back run build

###############################################
# Final runtime image
###############################################
FROM node:20-slim
WORKDIR /app

COPY --from=play /app/play/dist ./public
COPY --from=back /app/back/dist ./dist

COPY package*.json ./
RUN npm install --omit=dev

ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/index.js"]
