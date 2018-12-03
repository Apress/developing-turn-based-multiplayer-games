// import the net module
const net = require("net");
var crypto = require("crypto");

// the port and address that our server will be on
const PORT = 5836;
const ADDRESS = "127.0.0.1";

// create our server and pass the callback to be called when a client connects
let server = net.createServer(onClientConnected);
// start listening for requests on our port and address
server.listen(PORT, ADDRESS);

// callback function for handling connections
function onClientConnected(socket) {

	// set the encoding for data on this socket to text
	socket.setEncoding('utf8');

	// log a message when a new client connects
	var cid = getRandomID();
	var clientName = `${cid}:${socket.remoteAddress}:${socket.remotePort}`
	console.log(`New client connected: ${clientName}`);

	// set a callback to handle data form clients
	socket.on('data', onClientData);
  
  	// set a callback to handle client disconnection
  	socket.on('end', onClientDisconnected);

}


// callback for when a client sends us some data
function onClientData(message) {

	// trim the data so that there are no empty spaces or line breaks etc
	var data = message.trim();

	console.log(`Client says: ${data}`);

	// roll a 1d6
	if(data == "roll") {
		var r = Math.floor((Math.random()*6)+1).toString();		
		this.write(JSON.stringify([data, r]));
		console.log(`Server rolls: ${r}`);
	} else {
		this.write(JSON.stringify([data, data]));
	}

}


// callback for when a client disconnects
function onClientDisconnected() {
	var clientName = `${this.remoteAddress}:${this.remotePort}`
	console.log(`${clientName} disconnected.`);
}

// Returns a random unique ID to use for new players and games
function  getRandomID() {
	return crypto.randomBytes(16).toString('hex');
}

// log our server details when the server starts
console.log(`Server started at ${ADDRESS}:${PORT}`);