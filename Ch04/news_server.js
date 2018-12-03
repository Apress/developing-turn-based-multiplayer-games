var fs = require("fs");
var path = require("path");
var http = require("http");

// our news folder
var newsFolder = __dirname + "/news/";

// an array to hold our text files
var newsFiles = [];

// all news data
var news = [];

// getting ready to read files
console.log("reading files...")

// read our news directory using readdir
fs.readdir(newsFolder, "utf8", (err, files) => {
  // for each file in the folder, check if it is a text file and save it to our array
  files.filter((file) => {
    if(path.extname(file).toLowerCase() == ".txt") {
      newsFiles.push(file);
    }
  });

  // for each file in our array, read its contents and saves data to our news variable
  newsFiles.forEach((file) => {
    fs.readFile(`${newsFolder}${file}`, "utf8", (err, data) => {
      data.split("\n").forEach((item)=>{
        news.push(item);
      });
    });
  }); 

  // done reading news, starting files
  console.log("starting server...");

  // once all news is loaded, we start our server.
  startServer();
  
});


function startServer() {

  let server = http.createServer(function(req, res) {

    res.writeHead(200, {'Content-Type':'text/plain'});

    news.forEach((item)=>{
      res.write(`${item}\n`);
    });
    
    res.end();

  });

  // ask the server to listen to requests coming on port 8080
  server.listen(8080);
  console.log("server started at http://localhost:8080");

}