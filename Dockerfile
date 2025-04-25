FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev --omit=optional --prefer-offline
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
