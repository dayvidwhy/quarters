FROM node:21

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

# Command is overriden by docker-compose per service
CMD ["tail", "-f", "/dev/null"]