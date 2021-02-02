FROM node:12.18.4-slim

COPY ./ /app

COPY ./.env.example /app/.env

WORKDIR /app

RUN npm install -g ts-node typescript nodemon

RUN npm install

# ENV MONGODB_URI=mongodb://mongo:27017/mydb
ENV URL_AGILE_ENGINE=http://interview.agileengine.com
ENV API_KEY_AGILE_ENGINE=23567b218376f79d9415
ENV CACHE_TIME=10

EXPOSE 3000
