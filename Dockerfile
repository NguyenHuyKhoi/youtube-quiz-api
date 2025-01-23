FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install

# Development
# CMD ["npm", "run", "dev"]

# Production
RUN npm run build

ENV NODE_ENV=production
CMD ["node", "./dist/main.js"]