FROM node:18.17-alpine

# Copy Files
WORKDIR /app/services/transaction
RUN chown node:node ./
USER node

# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Install dependencies first, as they change less often than code.
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY ./ ./

# Execute Server
CMD ["node", "./index.js"]