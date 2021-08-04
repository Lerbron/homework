FROM nginx:latest
# FROM node:10.16.3 AS builder
# WORKDIR /app

COPY ./dist/index.html /usr/share/nginx/html
COPY ./dist /usr/share/nginx/html/sub-vue


# RUN yarn && yarn run build

# COPY /app/dist /usr/share/nginx/html

ADD default.conf /etc/nginx/conf.d/

EXPOSE 7777

WORKDIR /usr/share/nginx/html