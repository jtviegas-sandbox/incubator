import logging.config
import os

from kafka import KafkaConsumer
from kafka import KafkaProducer

from app import config
from common import point
from sources import source

logging.config.fileConfig('logging.conf')
log = logging.getLogger(__name__)

class App:

    def __init__(self, topic_control, topic_out, kafka_conf):
        log.debug("<IN>")
        self.topic_control = topic_control
        self.topic_out = topic_out
        self.kafka_conf = kafka_conf
        self.threads = {}
        log.debug("<OUT>")

    def __str__(self):
        return '<App | topic_control: {:s} topic_out {:s} kafka_conf: {:s}>'.format(self.topic_control, self.topic_out, self.kafka_conf)

    def run(self):
        log.debug("run<IN>")

        consumer = KafkaConsumer(bootstrap_servers=self.kafka_conf)
        consumer.subscribe([self.topic_control])
        log.info('consumer has connected with kafka server[%s] and subscribed to topic: %s' % (self.kafka_conf, self.topic_control))
        producer = KafkaProducer(bootstrap_servers=self.kafka_conf)
        log.info('producer has connected with kafka server : %s' % self.kafka_conf)

        for msg in consumer:
            log.info('new msg received: %s' % msg.value)
            try:
                _point = point.jsonStr2Point(msg.value)
                measurement = _point.get_measurement()
                if measurement != 'control':
                    log.warning("!!! wrong measurement received[%s] !!!" % _point.get_measurement())
                    continue

                type = None
                if 'type' not in _point.tags:
                    log.warning("!!! point with no type !!!")
                    continue
                else:
                    type = _point.tags['type']
                    if 'source' != type:
                        log.warning("!!! point type is not 'source' !!!")
                        continue

                source_descriptor = source.createDescriptor(_point)
                if None != source_descriptor:
                    if source_descriptor.is_on():
                        if source_descriptor.get_id() in self.threads:
                            log.warning("!!! thread already on [%s] !!!" % source_descriptor.get_id())
                        else:
                            sourceThread = source.createSource(source_descriptor, lambda obj_as_bytes: producer.send(self.topic_out, value=obj_as_bytes))
                            sourceThread.start()
                            self.threads[source_descriptor.get_id()] = sourceThread
                            log.info('started source thread: %s' % source_descriptor.get_id())
                    else:
                        if source_descriptor.get_id() not in self.threads:
                            log.warning("!!! no thread on [%s] !!!" % source_descriptor.get_id())
                        else:
                            sourceThread = self.threads.pop(source_descriptor.get_id())
                            sourceThread.exit()
                            log.info('stopped source thread: %s' % source_descriptor.get_id())
            except Exception as err:
                log.error(err)

        consumer.unsubscribe()
        log.debug("run<OUT>")


def main():
    log.debug("main<IN>")

    if config.ENV_VAR_TOPIC_CONTROL not in os.environ:
        log.error("!!! missing env var %s going to exit !!!" % config.ENV_VAR_TOPIC_CONTROL)
        return 1
    else:
        _topic_control = os.environ[config.ENV_VAR_TOPIC_CONTROL]

    if config.ENV_VAR_TOPIC_OUT not in os.environ:
        log.error("!!! missing env var %s going to exit !!!" % config.ENV_VAR_TOPIC_OUT)
        return 1
    else:
        _topic_out = os.environ[config.ENV_VAR_TOPIC_OUT]

    if config.ENV_VAR_KAFKA_CONFIG not in os.environ:
        log.error("!!! missing env var %s going to exit !!!" % config.ENV_VAR_KAFKA_CONFIG)
        return 1
    else:
        _kafka_config = os.environ[config.ENV_VAR_KAFKA_CONFIG]


    app = App(_topic_control, _topic_out, _kafka_config)
    log.info('starting app with params: _topic_control=%s _topic_out=%s _kafka_config=%s' % (_topic_control, _topic_out, _kafka_config))
    app.run()


    log.debug("main<OUT>")


if __name__ == "__main__":
    main()


