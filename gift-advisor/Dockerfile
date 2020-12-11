# Stage 1
FROM node:10-alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
CMD ["npm", "start"]

FROM nginx:1.17.1-alpine
COPY default.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/gift-advisor /usr/share/nginx/html
