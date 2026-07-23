FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js server.js tracing.js ./
COPY public ./public

FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
ENV NODE_ENV=production
ARG GIT_SHA=dev
ARG BUILD_DATE=inconnue
ENV APP_VERSION=$GIT_SHA
ENV BUILD_DATE=$BUILD_DATE
COPY --from=build /app /app
USER appuser
EXPOSE 3000
CMD ["node", "-r", "./tracing.js", "server.js"]
