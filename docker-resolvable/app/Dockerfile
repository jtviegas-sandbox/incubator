FROM ubuntu:14.04
RUN apt-get -y --force-yes --fix-missing update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes install curl nmap dnsutils git sed bc vim zip unzip openssh-server openssh-client 
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs
WORKDIR /tmp
RUN mkdir -p /opt/app

ADD ./app/app.js /opt/app/
ADD ./app/package.json /opt/app/

WORKDIR /opt/app
RUN npm update
RUN npm install -d --production 

CMD [ "node", "/opt/app/app.js" ]
