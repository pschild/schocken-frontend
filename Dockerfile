FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

RUN npm run build -- --configuration production

FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

COPY ./cfg/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/schocken-frontend/browser /var/www/html

EXPOSE 8080
