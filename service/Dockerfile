FROM node:10.15.3-alpine

WORKDIR /service

COPY package*.json ./
COPY src ./src
COPY config ./config

RUN npm install