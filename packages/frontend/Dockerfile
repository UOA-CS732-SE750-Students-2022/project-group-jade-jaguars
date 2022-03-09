FROM node:16-alpine

WORKDIR /CountMeIn/packages/frontend
COPY . /CountMeIn/packages/frontend
RUN npm install
CMD [ "npm", "run", "start" ]

EXPOSE 3001
