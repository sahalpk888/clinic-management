FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# for typescript
RUN npm run build   

EXPOSE 8000

CMD ["npm", "start"]