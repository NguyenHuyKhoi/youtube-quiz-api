FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g concurrently

# Development
# CMD ["npm", "run", "dev"]

# Production
RUN npm install -g pm2
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]