FROM node:18.17-alpine as base

# Copy Files
WORKDIR /app/services/transaction
COPY package.json  ./
RUN npm i --verbose
COPY . .

FROM base as production
ENV NODE_PATH=./build

RUN npm run build