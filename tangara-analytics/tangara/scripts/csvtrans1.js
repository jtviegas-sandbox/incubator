var csv = require('ya-csv');


var file = process.argv[2];
if(null == file){
	console.log('must provide file as arg');
	process.exit(1);
}
var output = [];


var reader = csv.createCsvFileReader(file, {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
});

var writer = new csv.createCsvFileWriter(file + '.out', { 'encoding': 'utf8' });

var ts = [];

var headerHandler = function(line) {
	for(var i = 2; i < line.length ; i++)
		ts.push(line[i]);
};
var lineHandler = function(line) {
	for(var i = 0;i < ts.length ; i++){
		var l=[];
		l[0] = ts[i];	//ts
		l[1] = line[0];	//resource
		l[2] = line[1];	//metric
		l[3] = line[i+2];
		writer.writeRecord(l);
	}
};

line=0;
reader.addListener('data', function(data) {
	if(0 == line)
		headerHandler(data);
	else
    	lineHandler(data);
    line++;
});
