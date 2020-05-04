from flask_restplus import fields
from api.restplus import api

point = api.model('point', {
    'measurement': fields.String(description='the measurement name', required=True)
    , 'tags': fields.Raw(description='the tags dict', required=True)
    , 'fields': fields.Raw(description='the fields dict', required=True)
    , 'timestamp' :fields.Integer(description='the timestamp', required=True)
})