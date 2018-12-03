// import the net module
const net = require("net");

// the port and address that our server will be on
const PORT = 5836;
const ADDRESS = "127.0.0.1";

// a variable to store the client's name
var clientName = "";

var clientSocket;

// an array full of strings to be returned to any client who connects
var news = ["There is no news like good news!", "Welcome to this game!", "Thanks for playing!"];

// create our server and pass the callback to be called when a client connects
let server = net.createServer(onClientConnected);
// start listening for requests on our port and address
server.listen(PORT, ADDRESS);

// callback function for handling connections
function onClientConnected(socket) {

	clientSocket = socket;

	socket.setEncoding('utf8');

	// log a message when a new client connects
	clientName = `${socket.remoteAddress}:${socket.remotePort}`
	console.log(`New client connected: ${clientName}`);
  
  	// set a callback to handle client disconnection
  	socket.on('end', onClientDisconnected);

  	socket.on('data', onClientData);

  	// write our data to the client socket as a JSON string
	//socket.write(JSON.stringify(news));
	
	// destroy the socket - disconnects the client
	// socket.end();
}

// callback for when a client sends us some data
function onClientData(message) {

	console.log(`Client says: ${message}`);

	if(message == "hello") {
		console.log(`Server says: hello yourself`);
		clientSocket.write(JSON.stringify(["hello yourself"]));
	} else if(message == "roll") {
		var r = Math.floor((Math.random()*6)+1).toString();
		console.log(`Server says: ${r}`);
		clientSocket.write(JSON.stringify([r]));
	} else {
		console.log(`Server echos: ${message}`);
		clientSocket.write(JSON.stringify([message]));	
		//math.floor(0.1);		
	}

}

// callback for when a client disconnects
function onClientDisconnected() {
	console.log(`${clientName} disconnected.`);
}

// log our server details when the server starts
console.log(`Server started at ${ADDRESS}:${PORT}`);