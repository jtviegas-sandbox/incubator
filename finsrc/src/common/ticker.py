from point import Point

class Ticker:

    def __init__(self, name, ts, price, volume):
        self.name = name
        self.ts = ts
        self.price = price
        self.volume = volume

    def __str__(self):
        return '<Ticker | name: {:s} ts {:s} price: {:s} volume: {:s}>'.format(self.name, self.ts, self.price, self.volume)

    def get_name(self):
        return self.name

    def get_ts(self):
        return self.ts

    def get_volume(self):
        return self.volume

    def get_price(self):
        return self.price

    def to_point(self):
        tags = {}
        tags['name'] = self.name
        fields = {}
        fields['price'] = self.price
        fields['volume'] = self.volume
        return Point('ticker', tags, fields, self.ts)


