FROM node:4.7

ENV PORT 3000
#RUN sysctl -w net.ipv4.ip_forward=1
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes --fix-missing update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y --force-yes install apt-utils vim

WORKDIR /tmp
RUN mkdir -p /opt/app
ADD dist /opt/app
WORKDIR /opt/app
RUN npm update
RUN npm install --production
# replace this with your application's default port
EXPOSE $PORT

ENTRYPOINT ["node"]
CMD [ "app.js" ]

