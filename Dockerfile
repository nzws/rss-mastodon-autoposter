FROM node:18-slim AS builder
RUN apt-get update && apt-get install -y ca-certificates gnupg openssl libssl-dev libc6

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node ./yarn.lock ./*.json ./.yarnrc.yml ./
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./.yarn ./.yarn

RUN yarn install --immutable && yarn build

FROM node:18-slim
RUN apt-get update && apt-get install -y ca-certificates gnupg openssl libssl-dev libc6

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node ./*.json ./*.yml ./yarn.lock ./
COPY --chown=node:node ./.yarn ./.yarn
RUN yarn install --immutable

COPY --chown=node:node --from=builder /home/node/app/dist ./dist

CMD ["node", "./dist"]
