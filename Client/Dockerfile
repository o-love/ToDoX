FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./index.html /usr/share/nginx/html/


# FROM node:16.18-alpine as build

# WORKDIR /app

# COPY package.json /app/package.json

# # Install app dependencies
# RUN npm install

# COPY ./ /app/

# RUN npm run build --prod

# # Initiate Angular app
# CMD ["npm", "start"]
