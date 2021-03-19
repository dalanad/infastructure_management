FROM node:14-alpine

WORKDIR /app
COPY . .

RUN yarn 
RUN apk add --no-cache git

CMD [ "npm start" ]