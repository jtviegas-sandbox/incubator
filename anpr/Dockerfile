FROM registry-ice.ng.bluemix.net/ibmnode:latest
RUN apt-get -y update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git sed bc vim tesseract-ocr-eng tesseract-ocr-osd tesseract-ocr-equ imagemagick
RUN apt-get -y build-dep tesseract-ocr
RUN apt-get -y install devscripts

ENV SERVER_DIR /server
ENV APP_DIR /app
ENV TMP_DIR /tmp
ENV TMP_FOLDER /tmp
ENV OUTPUT_FILE /app/OUT
ENV ANPR_COMMAND /usr/local/bin/anpr
ENV PORT 8080

RUN mkdir -p /server
RUN mkdir -p /app

WORKDIR /tmp

RUN wget http://http.debian.net/debian/pool/main/t/tesseract/tesseract_3.03.03-1.dsc
RUN wget http://http.debian.net/debian/pool/main/t/tesseract/tesseract_3.03.03.orig.tar.gz
RUN wget http://http.debian.net/debian/pool/main/t/tesseract/tesseract_3.03.03-1.diff.gz

RUN tar xvzf tesseract_3.03.03.orig.tar.gz
WORKDIR /tmp/tesseract-3.03
RUN zcat ../tesseract_3.03.03-1.diff.gz | patch -p1
RUN debuild -us -uc
WORKDIR /tmp
RUN dpkg -i *.deb

# apply some config on teseract
RUN echo "load_unambig_dawg		0" > /usr/share/tesseract-ocr/tessdata/configs/custom
RUN sed -i -- 's/load_bigram_dawg.*/load_bigram_dawg\t0/g' /usr/share/tesseract-ocr/tessdata/configs/bigram

# verify config
#RUN grep -ir dawg /usr/share/tesseract-ocr/tessdata/configs/

WORKDIR /
ADD script/anpr.sh /app/
RUN chmod +x /app/anpr.sh
RUN ln -s /app/anpr.sh /usr/local/bin/anpr

ADD node/fun.js /server/
ADD node/package.json /server/
WORKDIR /server
RUN npm install -d --production 
EXPOSE 8080
CMD ["node", "fun.js"]
