import logging
import collections
from real_time_ticker import RealTimeTicker

log = logging.getLogger(__name__)

def createDescriptor(point):
    result = None
    name = None
    fields = {}

    if 'name' not in point.tags:
        log.warning("!!! no name in source !!!")
        return result
    else:
        name = point.tags['name']

    for k in point.fields:
        fields[k] = point.fields[k]

    result = Descriptor(name, fields)

    return result


def createSource(source_descriptor, consumer_function):
    log.debug("createSource<IN>")
    source = None
    if source_descriptor.get_name() == 'real_time_ticker':
        source = RealTimeTicker(source_descriptor.get_args(), consumer_function)

    log.debug("createSource<OUT>")
    return source




class Descriptor():

    def __init__(self, name, args):
        self.name = name
        self.args = args
        self.id = None

    def get_name(self):
        return self.name

    def get_arg(self, name):
        result = None
        if name in self.args:
            result = self.args[name]
        return result

    def get_args(self):
        return self.args

    def is_on(self):
        result = False
        if "on" in self.args:
            _on = self.args["on"]
            if 1 == _on or True == _on:
                result = True
        return result

    def get_id(self):
        if None == self.id:
            result = collections.OrderedDict()
            result["name"] = self.name
            for k in sorted(self.args):
                result[k] = self.args[k]
            self.id = str(result)

        return self.id