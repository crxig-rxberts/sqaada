FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm i
RUN cd client && npm i

RUN cd client && npm run build

EXPOSE 9000

CMD ["npm", "start"]
