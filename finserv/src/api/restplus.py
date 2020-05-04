import logging

from flask_restplus import Api
import settings

log = logging.getLogger(__name__)

api = Api(version='1.0', title='finserv API', description='testing API for financial data')


@api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred.'
    log.exception(message)

    if not settings.FLASK_DEBUG:
        return {'message': message}, 500

'''
@api.errorhandler(NoResultFound)
def database_not_found_error_handler(e):
    log.warning(traceback.format_exc())
    return {'message': 'A database result was required but none was found.'}, 404
'''