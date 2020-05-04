# Flask settings
settings = {}
# Do not use debug mode in production
settings["FLASK_DEBUG"]=True
#, "SERVER_NAME"
settings["REQUIRED_ENV_VARS"] = ["TOPIC_CONTROL","KAFKA_CONFIG"]

# Flask-Restplus settings
settings["RESTPLUS_SWAGGER_UI_DOC_EXPANSION"]='list'
settings["RESTPLUS_VALIDATE"]=True
settings["RESTPLUS_MASK_SWAGGER"]=False
settings["RESTPLUS_ERROR_404_HELP"]=False
settings["SERVER_PORT"]=5000



