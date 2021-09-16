FROM node:16.9.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY out ./out/

ENV PORT 5000
EXPOSE $PORT
CMD ["npm", "start"]