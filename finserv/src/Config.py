import logging
import os
from settings import settings

log = logging.getLogger(__name__)

class _Config:

    def __init__(self, settings):
        log.debug("<IN>")

        self.map = {}
        for k in settings:
            self.map[k] = settings[k]

        for env_var in settings["REQUIRED_ENV_VARS"]:
            if env_var not in os.environ:
                raise ValueError("!!! missing env var %s going to exit !!!" % env_var)
            else:
                self.map[env_var] = os.environ[env_var]

        log.debug("<OUT>")

    def get(self, key):
        return self.map[key]

    def __str__(self):
        s = ''
        for k in self.map:
            s += '%s: %s\n' % (k, self.map(k))
        return s


Configuration = _Config(settings)