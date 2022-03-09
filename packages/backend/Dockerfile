FROM node:16-alpine

WORKDIR /CountMeIn/packages/backend
COPY . /CountMeIn/packages/backend
RUN npm install
CMD [ "npm", "run", "start" ]

EXPOSE 3000
