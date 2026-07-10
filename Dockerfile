### STAGE 1: Build ###
FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json .npmrc* ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

### STAGE 2: Run ###
FROM nginx:1.27-alpine

COPY --from=build /usr/src/app/dist/sistema-salud/browser /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./entrypoint.sh .

RUN chmod +x ./entrypoint.sh
ARG APP_VERSION=unknown
ARG APP_BUILD_DATE
ENV APP_VERSION=$APP_VERSION
ENV APP_BUILD_DATE=$APP_BUILD_DATE

RUN find /usr/share/nginx/html -name "*.js" \
  -exec sed -i "s#APP_VERSION_PLACEHOLDER#$APP_VERSION#g" {} \; \
  -exec sed -i "s#APP_DEPLOY_DATE_PLACEHOLDER#$APP_BUILD_DATE#g" {} \;
CMD ["sh", "./entrypoint.sh"]
