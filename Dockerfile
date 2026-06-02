FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
