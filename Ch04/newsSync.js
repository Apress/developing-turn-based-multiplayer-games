// load the file system module
var fs = require("fs");

// read the file synchronously 
var data = fs.readFileSync("news.txt", "utf8");

// our file contains news, each news item split into multiple lines
var news = data.split("\n");

// we print each news item to the console
for(var i=0; i<news.length; i++) {
	console.log(`${i+1}. ${news[i]}`);
}
