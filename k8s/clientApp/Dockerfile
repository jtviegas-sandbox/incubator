FROM ubuntu:14.04
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes --fix-missing update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes install curl nmap dnsutils git sed bc vim zip unzip wget 
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

RUN mkdir -p /opt/app
WORKDIR /opt

RUN wget http://www-eu.apache.org/dist/cassandra/3.11.1/apache-cassandra-3.11.1-bin.tar.gz \
 && tar xzpvf apache-cassandra-3.11.1-bin.tar.gz \
 && rm apache-cassandra-3.11.1-bin.tar.gz

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs

ADD app /opt/app
ENV CASS_PATH /opt/apache-cassandra-3.11.1/bin

WORKDIR /opt/app
RUN npm update
RUN npm install -d --production 

EXPOSE 8080

CMD [ "node", "/opt/app/app.js" ]

