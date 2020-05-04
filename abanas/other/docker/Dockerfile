FROM node:0.12.14-wheezy

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get -y --fix-missing update && apt-get -y install apt-utils && apt-get -y install sed bc vim imagemagick wget

WORKDIR /
RUN mkdir -p /opt/abanas
ADD dist /opt/abanas
ADD package.json /opt/abanas/
WORKDIR /opt/abanas
RUN npm install -d --production 
RUN mkdir -p logs
EXPOSE 8080
CMD ["node", "backend/index.js"]
