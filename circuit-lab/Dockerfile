FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json tsconfig*.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/simulator-core/package.json packages/simulator-core/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
RUN npm ci

FROM deps AS build
COPY . .
RUN npx tsc -b
RUN cd packages/client && npx vite build

FROM base AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends sqlite3 && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/server/.env.example ./packages/server/.env
COPY --from=build /app/packages/client/dist ./packages/client/dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/packages/server/package.json ./packages/server/
COPY --from=build /app/packages/client/package.json ./packages/client/

EXPOSE 3001
ENV NODE_ENV=production
ENV CLIENT_URL=http://localhost:3001

CMD ["node", "packages/server/dist/index.js"]
