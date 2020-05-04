import threading
import logging

log = logging.getLogger(__name__)


class SourceThread(threading.Thread):

    def __init__(self, context_dict, consumer_function):
        log.debug("init<IN>")
        threading.Thread.__init__(self)
        self.status = True
        self.context = context_dict
        self.consumer_function = consumer_function
        log.debug("init<OUT>")

    def exit(self):
        log.debug("exit<IN>")
        self.status = False
        log.debug("exit<OUT>")

    def run(self):
        raise NotImplementedError("Please Implement this method")