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

    // trim the data so that there are no empty spaces or line breaks etc
    var data = message.trim();

    console.log(`${this.clientName} says: ${data}`);

  }

  // write data to the open socket
  send(data) {
    if(this.socket.writable) {
      this.socket.write(JSON.stringify(data));
    }
  }

}

module.exports = Client;