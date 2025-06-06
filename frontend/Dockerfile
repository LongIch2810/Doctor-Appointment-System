FROM node:22.16.0-alpine3.21

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]