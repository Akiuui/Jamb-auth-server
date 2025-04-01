FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY /src /app/src

WORKDIR /app/src


EXPOSE 7001

CMD ["node", "app.js"]