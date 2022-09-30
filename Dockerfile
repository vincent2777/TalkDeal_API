FROM node:16.17.0-slim

WORKDIR /demo_app

COPY package.json /demo_app
# OR => COPY package.json .

COPY yarn.lock /demo_app

RUN yarn install

COPY . /demo_app
# OR => COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]
# OR
# CMD [ "node", "/src/app.js" ]