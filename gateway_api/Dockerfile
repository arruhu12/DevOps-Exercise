FROM node:18-alpine as base

# Copy Files
WORKDIR /app/gateway_api
COPY package.json  ./
RUN npm i
COPY . .

FROM base as production
ENV NODE_PATH=./build

RUN npm run build