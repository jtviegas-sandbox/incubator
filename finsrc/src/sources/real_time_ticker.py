import logging
import time
from datetime import datetime

import pytz
import ystockquote as ys
from dateutil import parser

from app import config
from common.ticker import Ticker
from source_thread import SourceThread

log = logging.getLogger(__name__)


class RealTimeTicker(SourceThread):

    def __init__(self, context_dict, consumer_function):
        log.debug("init<IN>")
        SourceThread.__init__(self, context_dict, consumer_function)

        if 'ticker' not in context_dict:
            raise Exception('!!! no ticker in the context !!!')

        if 'intervalMillis' not in context_dict:
            raise Exception('!!! no intervalMillis in the context !!!')

        self.tickers = []
        for t in context_dict['ticker'].split(','):
            self.tickers.append(t.strip())

        self.intervalInSecs = int(context_dict['intervalMillis'])/1000
        log.debug("init<OUT>")

    def run(self):
        log.debug("run<IN>")

        while self.status:
            for _ticker in self.tickers:
                log.debug("run|going to get ticker data for %s" % _ticker)
                try:
                    price = ys.get_last_trade_price(_ticker)
                    if config.TICKER_DATA_NOT_AVAILABLE == price:
                        log.debug("run|no price !!!")
                        continue
                    _date = ys.get_last_trade_date(_ticker).replace('"', '')
                    if config.TICKER_DATA_NOT_AVAILABLE == _date:
                        log.debug("run|no date !!!")
                        continue
                    _time = ys.get_last_trade_time(_ticker).replace('"', '')
                    if config.TICKER_DATA_NOT_AVAILABLE == _time:
                        log.debug("run|no time !!!")
                        continue
                    _dt = parser.parse("%s %s" % (_date, _time))
                    aware = pytz.timezone("US/Eastern").localize(_dt, is_dst=None)
                    ts = (aware - datetime(1970, 1, 1, tzinfo=pytz.utc)).total_seconds()

                    volume = ys.get_volume(_ticker)
                    point = Ticker(_ticker, ts, price, volume).to_point()
                    self.consumer_function(point.asJsonStrBytes())
                    log.debug("run|processed %s" % point)
                except Exception as err:
                    log.error(err)

            time.sleep(self.intervalInSecs)

        log.debug("run<OUT>")