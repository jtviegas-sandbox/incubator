import logging.config

from flask import Flask, Blueprint

from Config import Configuration
from api.fin.resource import ns as fin_namespace
from api.restplus import api


app = Flask(__name__)
logging.config.fileConfig('logging.conf')
log = logging.getLogger(__name__)


def configure_app(flask_app):
    flask_app.config['SWAGGER_UI_DOC_EXPANSION'] = Configuration.get("RESTPLUS_SWAGGER_UI_DOC_EXPANSION")
    flask_app.config['RESTPLUS_VALIDATE'] = Configuration.get("RESTPLUS_VALIDATE")
    flask_app.config['RESTPLUS_MASK_SWAGGER'] = Configuration.get("RESTPLUS_MASK_SWAGGER")
    flask_app.config['ERROR_404_HELP'] = Configuration.get("RESTPLUS_ERROR_404_HELP")


def initialize_app(flask_app):
    configure_app(flask_app)

    blueprint = Blueprint('api', __name__, url_prefix='/api')
    api.init_app(blueprint)
    api.add_namespace(fin_namespace)
    flask_app.register_blueprint(blueprint)

def main():
    initialize_app(app)
    log.info('>>>>> Starting development server at http://{}/api/ <<<<<'.format(app.config['SERVER_NAME']))
    app.run(debug=Configuration.get("FLASK_DEBUG"), port = Configuration.get("SERVER_PORT"), host = "0.0.0.0")

if __name__ == "__main__":
    main()
