FROM node:10.15.3-alpine

WORKDIR /frontend

COPY package*.json ./
COPY yarn.lock ./
COPY src ./src
COPY public ./public

RUN yarn install