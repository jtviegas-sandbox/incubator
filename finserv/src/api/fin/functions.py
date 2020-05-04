import logging
from kafka import KafkaProducer
from src.Config import Configuration
import src.models.Point as Point

log = logging.getLogger(__name__)
producer = KafkaProducer(bootstrap_servers=Configuration.get('KAFKA_CONFIG'))
topic = Configuration.get('TOPIC_CONTROL')

def post_control(json):
    log.debug("post_control<IN>")
    try:
        point = Point.json2Point(json)
        producer.send(topic, value=point.asJsonStrBytes())
    except Exception as err:
        log.error(err)
        raise
    log.debug("post_control<OUT>")


