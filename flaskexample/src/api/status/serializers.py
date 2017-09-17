from flask_restplus import fields
from api.restplus import api

text_message = api.model('text message', {
    'text': fields.String(readOnly=True, description='the message text')
})

