FROM nginx:latest
# FROM node:10.16.3 AS builder
# WORKDIR /app

COPY ./dist /usr/share/nginx/html

# RUN yarn && yarn run build

# COPY /app/dist /usr/share/nginx/html

ADD default.conf /etc/nginx/conf.d/

EXPOSE 8080

WORKDIR /usr/share/nginx/html