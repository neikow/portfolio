# syntax=docker/dockerfile:1
FROM node:24.4-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install -g corepack && corepack enable yarn
RUN yarn --frozen-lockfile --network-timeout 100000

FROM base AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NUXT_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install -g corepack && corepack enable yarn

ENV NODE_OPTIONS=--max-old-space-size=4096
RUN --mount=type=secret,id=sentry_auth_token \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_auth_token) && \
    yarn build

FROM base AS migration
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock* ./
COPY drizzle ./drizzle
COPY drizzle.config.ts .

COPY migrate.sh .
RUN chmod +x migrate.sh

CMD ["./migrate.sh"]


FROM base AS runner
WORKDIR /app

RUN apk add --no-cache curl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    font-noto-cjk

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production
ENV PORT=80
ENV HOST=web
ENV NUXT_TELEMETRY_DISABLED=1
EXPOSE 80

ENTRYPOINT ["node", "./server/index.mjs"]