FROM python:2.7.13-alpine3.6

ENV APP_DIR /usr/src/app
ADD ./src $APP_DIR
WORKDIR $APP_DIR
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./run.py" ]