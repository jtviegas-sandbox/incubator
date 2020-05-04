import json

def json2Point(jsonDict):
    measurement = jsonDict['measurement']
    tags = jsonDict['tags']
    fields = jsonDict['fields']
    timestamp = jsonDict['timestamp']
    return Point(measurement, tags, fields, timestamp)

def jsonStr2Point(jsonStr):
    j = json.loads(jsonStr)
    return Point(j["measurement"], j["tags"], j["fields"], j["timestamp"])

class Point:

    def __init__(self, measurement, tags, fields, timestamp):
        self.measurement = measurement
        self.tags = tags
        self.fields = fields
        self.timestamp = timestamp

    def asStrBytes(self):
        _asStr = str(self)
        return bytes(_asStr, "ascii")
        #return ' '.join(map(bin,bytearray(_asStr,'utf8')))

    def asJson(self):
        s = {}
        s["measurement"] = self.measurement
        s["timestamp"] = self.timestamp
        _tags = {}
        for k in self.tags:
            _tags[k] = self.tags[k]
        s["tags"] = _tags
        _fields = {}
        for k in self.fields:
            _fields[k] = self.fields[k]
        s["fields"] = _fields

        return s

    def asJsonStr(self):
        return json.dumps(self.asJson())

    def asJsonStrBytes(self):
        return bytes(self.asJsonStr())

    def __str__(self):
        result = self.measurement

        for k in self.tags:
            result += ','
            result += '%s=%s' % (k, self.tags[k])

        result += ' '
        fieldsCount = 0
        for k in self.fields:
            if 0 < fieldsCount:
                result += ','
            result += '%s=%s' % (k, self.fields[k])
            fieldsCount+= 1

        result += ' '
        result += str(self.timestamp)

        return result

    def get_measurement(self):
        return self.measurement

    def get_timestamp(self):
        return self.timestamp

    def get_tags(self):
        return self.tags

    def get_fields(self):
        return self.fields