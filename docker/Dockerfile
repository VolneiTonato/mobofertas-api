FROM node:12
LABEL name volneitonato@gmail.com

RUN apt-get update && apt-get install -y vim

RUN apt-get install chromium -y

RUN apt-get install libgtk-3-dev -y

RUN mkdir app
WORKDIR /app

# Install app dependencies
COPY package.json /app
COPY process.json /app
COPY build /app
COPY .babelrc /app

RUN mkdir /app/tmp
RUN mkdir /app/logs

RUN npm install

RUN npm install -g @babel/cli @babel/core @babel/node @babel/preset-env core-js@2

RUN npm install -g pm2@^3.3.1


EXPOSE 3000
EXPOSE 27017
EXPOSE 6379

CMD ["pm2-runtime","process.json"]
