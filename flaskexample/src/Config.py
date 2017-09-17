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

        log.debug("<OUT>")

    def get(self, key):
        return self.map[key]

    def __str__(self):
        s = ''
        for k in self.map:
            s += '%s: %s\n' % (k, self.map(k))
        return s


Configuration = _Config(settings)