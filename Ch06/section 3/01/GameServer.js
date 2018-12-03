// import the net module
const net = require("net");
const crypto = require("crypto");
const Client = require("./Client.js");
const Game = require("./Game.js");

module.exports = class GameServer {

  constructor(port, address) {
    this.port = port;
    this.address = address;

    // all our clients
    this.clients = [];

    // a list of clients looking for a match
    this.lookingForMatches = [];

    // a list of active games
    this.games = [];    

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
    client.send({type:"hello", data:client.id});

    // add client to our clients list
    this.clients.push(client);

    console.log(`client count: ${this.clients.length}`);    

    // clean up for the server when the client disconnects   
    client.on('end', (client) => this.onClientDisconnected(client));
    // client is looking for a match
    client.on('match', (client) => this.onMatchRequest(client));
    // client cancelled matchmaking or ended a game
    client.on('quit', (client) => this.onStopPlaying(client));

  }

  // client requests to be matched with another player
  onMatchRequest(client) {
    this.lookingForMatches.push(client);

    if(this.lookingForMatches.length >= 2) {
      let gameID = this.getRandomID();

      this.games.push(new Game(gameID,this.lookingForMatches[0], this.lookingForMatches[1]));
      this.games[this.games.length-1].on('end',(game) => this.onGameEnd(game));

      this.lookingForMatches.splice(0,1);
      this.lookingForMatches.splice(0,1);

      return;
    }

    // if no matches are found at the moment, we ask the client to wait
    client.send({type:"wait"});

  }  

  // client requests to be matched with another player
  onStopPlaying(client) {
    // if we quit while waiting for players then remove the client from the list
    let m = this.getIndexWithID(this.lookingForMatches, client.id);
    if(m != -1) {
      this.lookingForMatches.splice(m, 1);
    } else {
      // if we were not in the waiting list, then we may have been in a game
      let g = this.games[this.getIndexWithID(this.games, client.currentGameID)];
      g.end(); 
    }

  }   

  // when a game ends, if everyone is still connected, move them back to the lobby
  onGameEnd(game) {
    if(game.p1.socket.writable) {
      game.p1.room = "lobby";
      game.p1.send({type: "game-msg", "data":"game-end"});
    } else {
      game.p1.room = "closed";
    }

    if(game.p2.socket.writable) {
      game.p2.room = "lobby";
      game.p2.send({type: "game-msg", "data":"game-end"});
    } else {
      game.p2.room = "closed";
    }

    // remove the game from the games array and cleanup
    let i = this.getIndexWithID(this.games, game.id);
    var g = this.games.splice(i, 1)[0];
    g.removeAllListeners('end');
    g = null;

    console.log("game deleted");

  }  

  onClientDisconnected(client) {
    console.log(`${client.clientName} has disconnected!`);

    // if we quit while waiting for players then remove the client from the list
    let m = this.getIndexWithID(this.lookingForMatches, client.id);
    if(m != -1) {
      this.lookingForMatches.splice(m, 1);
    }

    // if the client was quit while playing a game, notify other player and end game
    if(client.room == "game") {
      let g = this.games[this.getIndexWithID(this.games, client.currentGameID)];
      g.end(); 
    }    
    
    // remove the client from our clients list once it has been disconnected!
    let c = this.getIndexWithID(this.clients, client.id);
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