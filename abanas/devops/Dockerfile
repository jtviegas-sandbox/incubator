FROM node:0.12.14-wheezy

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y --fix-missing update && apt-get -y install apt-utils && apt-get -y install sed bc vim imagemagick wget

WORKDIR /
RUN mkdir -p /opt/app
ADD ../dist /opt/app
ADD ../dist/package.json /opt/app/
WORKDIR /opt/app
RUN npm install -d --production 
RUN mkdir -p logs
EXPOSE 8080
CMD ["node", "backend/index.js"]
