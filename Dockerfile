FROM node:16.15.0-alpine

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm","start" ]
