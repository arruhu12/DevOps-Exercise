FROM node:18.17-alpine as base

# Copy Files
WORKDIR /app/services/data-management
COPY package.json  ./
RUN npm i
COPY . .

FROM base as production
ENV NODE_PATH=./build

RUN npm run build