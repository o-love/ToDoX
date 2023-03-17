# build stage
FROM node:16.18-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY ./ /app/
RUN npm run build --prod


FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./index.html /usr/share/nginx/html/
RUN apk add --no-cache bash
# daemon off runs nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
