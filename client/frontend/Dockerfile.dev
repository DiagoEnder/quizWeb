FROM node:18.17.0-slim

WORKDIR /app

COPY package.json .

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "npm", "run", "start" ]