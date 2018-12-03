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
    
    // holds the player's turn total and score for a game
    this.score = 0;
    this.turnTotal = 0;

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
      this.send({type: "error", "data":"parseerror"});
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
    // ready to start the game
    } else if(data.type === "msg" && data.data === "ready") {
      if(this.room === "game") {
        this.emit('ready', this);
      }
    // if we are in the game and the client wants to roll  
    } else if(data.type === "do" && data.data ==="roll") {
      if(this.room === "game") {
        console.log(this.clientName, data.type, data.data);
        this.emit('roll', this);
      }
    // if we are in the game and the client wants to hold the current turn total  
    } else if(data.type === "do" && data.data ==="hold") {
      if(this.room === "game") {
        console.log(this.clientName, data.type, data.data);
        this.emit('hold', this);
      }
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