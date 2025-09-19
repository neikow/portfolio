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

COPY --from=build /app/.output/ ./

ENV NODE_ENV=production
ENV PORT=80
ENV HOST=0.0.0.0
ENV NUXT_TELEMETRY_DISABLED=1
EXPOSE 80

ENTRYPOINT ["node", "./server/index.mjs"]