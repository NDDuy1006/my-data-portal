FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 8080

CMD ["yarn", "start"]
