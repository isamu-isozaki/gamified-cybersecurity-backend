FROM node:16-slim

WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 10000