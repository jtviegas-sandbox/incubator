var util = require('util');
var quotes = require('../dist/quotes.js');
var expect = require('chai').expect;

/*{
	'ts': null,
	'symbol': null,
	'quote' : null,
	'volume': null
}*/

suite('quotes tests', function(){

	test('getLastQuote("GOOG") should return a quote', function(){
		
		var cb = function(o){
			expect(util.isArray(o));
			expect(o.ts > 0);
			expect(o.volume > 0);
			expect(typeof o.quote === 'float');
			expect(typeof o.symbol === 'string');
		};
		quotes.getLastQuote('GOOG', cb);
	});
});

