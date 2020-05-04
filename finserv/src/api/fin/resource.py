import logging

from flask import request
from flask_restplus import Resource
import api.fin.functions as functions
from api.fin.serializers import point
from api.restplus import api

log = logging.getLogger(__name__)

ns = api.namespace('fin', description='fin Operations')

@ns.route('/control')
class Control(Resource):

    @api.response(200, 'ok')
    @api.response(400, 'bad request')
    @api.response(500, 'server error')
    @api.expect(point)
    def post(self):
        """
        post a control point broadcasting instructions to the nodes

        * Sends a point with control info to the nodes

        ```
        {
          "fields": {"ticker": "GOOG,BAE", "intervalMillis": 30000, "on": 1},
          "tags": {"type": "source", "name": "real_time_ticker"},
          "timestamp": 0,
          "measurement": "control"
        }
        ```
        """
        try:
            functions.post_control(request.json)
        except ValueError as ve:
            log.error(ve)
            return None, 400
        except Exception as err:
            log.error(err)
            return None, 500
        else:
            return None, 200