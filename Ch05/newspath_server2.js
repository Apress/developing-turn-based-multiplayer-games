var fs = require("fs");
var path = require("path");
var http = require("http");
var parser = require("url");

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
      console.log(file);
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

    // we parse the incoming request url
    var url = parser.parse(req.url, true);

    // we check if the path name is something that we can use and respond accordingly
    if(url.pathname == "/") {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write('Welcome to the news server go to <a href="/news">news</a> for more news.');
    } else if(url.pathname == "/news") {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write("<ol>");
      news.forEach((item)=>{
        res.write(`<li>${item}</li>`);
      });
      res.write("</ol>");
    } else if(url.pathname == "/plain") {
      res.writeHead(200, {'Content-Type':'text/plain'});
      news.forEach((item)=>{
        res.write(`${item}\n`);
      });  
    } else {
      res.writeHead(404, {'Content-Type':'text/html'});
      res.write("Resource not found");
    }
    
    res.end();

  });

  // ask the server to listen to requests coming on port 8080
  server.listen(8080);
  console.log("server started at http://localhost:8080");

}
