// import the net module
const net = require("net");
const crypto = require("crypto");
const Client = require("./Client.js");

module.exports = class GameServer {

  constructor(port, address) {
    this.port = port;
    this.address = address;

    // all our clients
    this.clients = [];

    // create our server and pass the callback to be called when a client connects
    this.server = net.createServer((socket) => this.onClientConnected(socket));

    // start listening for requests on our port and address
    this.server.listen(this.port, this.address);

  }

 // callback function for handling connections
  onClientConnected(socket) {

    // set the encoding for data on this socket to text
    socket.setEncoding('utf8');

    // generate a client id
    var clientID = this.getRandomID();

    // create a new client
    var client = new Client(clientID, socket);

    // log to console
    console.log(`New client connected: ${client.clientName}`);

    // welcome message with client id
    socket.write(JSON.stringify(["hello", client.id]));

    // add client to our clients list
    this.clients.push(client);

    console.log(`client count: ${this.clients.length}`);    

    // clean up for the server when the client disconnects   
    client.on('end', (client) => this.onClientDisconnected(client));

  }

  onClientDisconnected(client) {
    console.log(`${client.clientName} has disconnected!`);
    
    // remove the client from our clients list once it has been disconnected!
    var c = this.getIndexWithID(this.clients, client.id);
    if(c != -1) {
      this.clients.splice(c, 1);
    }
    
    console.log(`client count: ${this.clients.length}`);
  }  

  // return the index of an item from an array if the item has the given id
  getIndexWithID(a, id) {
    return a.findIndex((c) => { return c["id"] === id});
  }

  // Returns a random unique ID to use for new players and games
  getRandomID() {
    return crypto.randomBytes(16).toString('hex');
  }

}