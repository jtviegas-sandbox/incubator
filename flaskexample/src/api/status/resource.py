import logging

from flask import request
from flask_restplus import Resource

from api.restplus import api
from api.status.serializers import text_message

log = logging.getLogger(__name__)
ns = api.namespace('status', description='status Operations')


@ns.route('/echo')
class Echo(Resource):

    @api.response(200, 'ok')
    @api.expect(text_message)
    def post(self):
        """
        Echoes a message

        * Send a JSON object with the message

        ```
        {
          "text": "hello"
        }
        ```
        """
        return request.json

