FROM registry-ice.ng.bluemix.net/ibmnode:latest

# RUN apt-get -y --fix-missing update
# RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git sed bc vim ssh

ENV DOCKER true

WORKDIR /
RUN mkdir -p /dist
ADD dist /dist
ADD package.json /
RUN npm install -d --production 
# EXPOSE 3000
CMD ["node", "dist/app.js"]