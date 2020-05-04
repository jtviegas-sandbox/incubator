var express = require('express');
var multer = require('multer');
var app = express();
var done = false;
var _ = require('underscore'); // for some utility goodness
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var fs = require('fs');
var uploadedFile;
var TMP_FOLDER = process.env.TMP_FOLDER;
var OUTPUT_FILE = process.env.OUTPUT_FILE;
var ANPR_COMMAND = process.env.ANPR_COMMAND;
var PORT = process.env.PORT;

console.log('checking variables:');
console.log('TMP_FOLDER: ' + TMP_FOLDER);
console.log('OUTPUT_FILE: ' + OUTPUT_FILE);
console.log('ANPR_COMMAND: ' + ANPR_COMMAND);
console.log('PORT: ' + PORT);


/*Configure the multer.*/
app.use(
  multer(
    {
      dest: TMP_FOLDER,
      rename: function (fieldname, filename) {
        var newFileName = filename + Date.now();
        console.log('renaming to: ' + newFileName);
        return newFileName;
      },
      onFileUploadStart: function (file) {
        console.log(file.originalname + ' upload is starting ...');
      },
      onFileUploadComplete: function (file) {
        uploadedFile = file.path;
        console.log(file.fieldname + ' uploaded to ' + uploadedFile);
        done = true;
      }
    }
  )
);


app.post('/api/photo',function(req,res){

  if(done==true){

    console.log(req.files);
    //1-  I received the file and I saved to myFilePath
    //2- invoque anpr by a command cmd (specified by Joao)
    console.log('going to execute command: ' + ANPR_COMMAND);
    child = exec( ANPR_COMMAND + ' ' + uploadedFile,
      function (error, stdout, stderr) {
        console.log('stdout: \n ' + stdout);
        console.log('stderr: \n' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
    //3- waiting 3 seconds for the output file to be in place then read it
    setTimeout(function() {
      console.log('Reading file ...');//// please specify the path of the file to be read (e.g., ./lala.txt)
      var content;
      fs.readFile(OUTPUT_FILE, function read(err, data) {
        if (err) {
          throw err;
        }
        content = data;//the content of the file
        console.log(content);
        res.end(content);

      });
    }, 3000);
  }

});

/*Run the server.*/
app.listen(PORT);
console.log('Listening on port ' + PORT);

