FROM node:lts

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN yarn global add serve
EXPOSE 3000
CMD sh -c 'serve -s build -l tcp://0.0.0.0:$PORT'