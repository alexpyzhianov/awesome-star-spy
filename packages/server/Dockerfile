FROM node:13.14.0-alpine3.11

RUN mkdir /deploy
COPY . /deploy

WORKDIR /deploy
RUN yarn
RUN yarn build

CMD [ "node", "./dist/index.js" ]