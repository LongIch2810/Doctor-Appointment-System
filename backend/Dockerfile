FROM node:22.16.0-alpine3.21

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","run","start:dev"]