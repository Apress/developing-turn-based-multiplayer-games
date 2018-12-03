// load the file system module
var fs = require("fs");

// read the data synchronously
var data = fs.readFile("news.txt", "utf8", fileFinishedReading);

// callback function to be called once the file is done loading
function fileFinishedReading(err, data) {

  // in case of an error reading the file, throw the error and stop the program
  if(err) throw err;

  // our file contains news, each news item split into multiple lines
  var news = data.split("\n");

  //// we print each news item to the console
  let i=0;
  news.forEach((e) => {
  	i += 1;
  	console.log(`${i}. ${e}`);
  });


}
