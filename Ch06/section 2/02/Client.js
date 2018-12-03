const EventEmitter = require('events');

class Client extends EventEmitter {

  constructor(id, socket) {
    super();

    this.id = id;
    this.room = "lobby";
    this.socket = socket;
    this.remoteAddress = socket.remoteAddress;
    this.remotePort = socket.remotePort;
    this.clientName = `${this.id}:${this.remoteAddress}:${this.remotePort}`;
    this.currentGameID = "";

    // set a callback to handle data form clients
    this.socket.on('data', (data) => this.onClientData(data));

    // set a callback to handle client disconnection
    this.socket.on('end', () => this.onClientDisconnected());

  }

  // callback for when a client disconnects
  onClientDisconnected() {
    // tell any listeners that we have disconnected
    this.emit('end', this);
  }

  // callback for when a client sends us some data
  onClientData(message) {

    console.log(`${this.clientName} says: ${message.trim()}`);

    // trim the message and try parsing it, if it fails tell the client.
    var data;
    try {
      data = JSON.parse(message.trim());
    } catch(e) {
      this.send("parseerror");
      return;
    }

    // client is requesting a match
    if(data.type === "find" && data.data === "match") {
      if(this.room == "lobby") {
        this.room = "wait";
        this.emit('match', this);
      }
    // client is quitting matchmaking or a game
    } else if(data.type === "quit") {
      this.room = "lobby";
      this.emit('quit', this);
    }   

  }

  // write data to the open socket
  send(data) {
    if(this.socket.writable) {
      this.socket.write(JSON.stringify(data));
    }
  }

}

module.exports = Client;