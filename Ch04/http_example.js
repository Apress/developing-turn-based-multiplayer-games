// we import the http module
var http = require("http");

// we create the server. The createServer function takes a function with two parameters, a request and a response object.
let server = http.createServer(function(req, res) {

  res.writeHead(200, {'Content-Type':'text/plain'});
  res.write("Hello Hello\n");
  // end the response
  res.end("Bye bye");

// ask the server to listen to requests coming on port 8080
});

server.listen(8080);
