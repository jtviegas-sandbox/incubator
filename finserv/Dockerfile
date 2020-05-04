FROM python:3.6.2-jessie

ENV APP_DIR /usr/src/app
ENV PYTHONPATH=.:$APP_DIR

EXPOSE 5000

ADD ./src $APP_DIR
WORKDIR $APP_DIR
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python", "./app.py" ]