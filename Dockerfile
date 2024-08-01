FROM node:20-alpine as build


WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 60000 && npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/todo-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
