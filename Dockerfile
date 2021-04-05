FROM node:14-alpine

WORKDIR /app
RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build 

CMD ["npm", "run","start"]