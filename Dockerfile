FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node


WORKDIR /usr/src/app


COPY package*.json ./

RUN npm ci --production
RUN npm install -g ts-node

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
CMD [ "node", "npm", "start" ]