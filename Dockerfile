# syntax=docker/dockerfile:1
FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable yarn
RUN yarn --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NUXT_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable yarn

RUN --mount=type=secret,id=sentry_token,env=SENTRY_AUTH_TOKEN \
    yarn build

FROM base AS runner
WORKDIR /app

# Drizzle data & dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY drizzle.config.ts ./
COPY drizzle ./drizzle

COPY --from=build /app/.output/ ./

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable yarn
RUN yarn add drizzle-kit

ENV NODE_ENV=production
ENV PORT=80
ENV HOST=0.0.0.0
ENV NUXT_TELEMETRY_DISABLED=1
EXPOSE 80

ENTRYPOINT ["node", "./server/index.mjs"]