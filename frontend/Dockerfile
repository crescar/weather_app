FROM node:20-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY frontend ./
COPY --from=dependencies /app/node_modules ./node_modules
ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/.next/ ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json

CMD ["pnpm", "start"]

