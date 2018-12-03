const EventEmitter = require('events');

class Game extends EventEmitter {

  constructor(id, p1, p2) {
    super();

    console.log("Creating game - " + id);
    // game id
    this.id = id;

    // the players
    this.p1 = p1;
    this.p2 = p2;

    // setting some player properties
    this.p1.room = "game";
    this.p1.currentGameID = this.id;
    this.p1.turnTotal = 0;
    this.p1.score = 0;  
    this.readyP1 = false; 

    this.p2.room = "game"; 
    this.p2.currentGameID = this.id; 
    this.p2.turnTotal = 0;
    this.p2.score = 0; 
    this.readyP2 = false;

    // our current player, when the game starts is always player one!
    this.currentPlayer = this.p1;   
    
    // a game over flag
    this.gameOver = false;

    // a flag to mark who won the game
    this.gameWinner = ""; 

    // our last die roll
    this.lastRoll = 0;

    // clients are ready
    this.p1.on('ready', (client) => this.onPlayersReady(client));
    this.p2.on('ready', (client) => this.onPlayersReady(client));    

    // client requested to do a die roll
    this.p1.on('roll', (client) => this.onDoRoll(client));
    this.p2.on('roll', (client) => this.onDoRoll(client));    

    // client requested to hold current turn total
    this.p1.on('hold', (client) => this.onDoHold(client));
    this.p2.on('hold', (client) => this.onDoHold(client));

    // ask the player's if they are ready
    this.broadcast({type: "game-ready", data:this.state});

  }  

  // players are ready!
  onPlayersReady(client) {
    if(client.id === this.p1.id) {
      this.readyP1 = true;
    }

    if(client.id === this.p2.id) {
      this.readyP2 = true;
    }

    // are the players ready?
    this.playersReady = (this.readyP1 && this.readyP2);

    // check if both players have sent in a ready signal
    if(this.playersReady) {
      this.playersReady = false;
      this.readyP1 = false;
      this.readyP2 = false;
      this.broadcast({type: "game-start", data:this.state});
    }
  }  

  // callback handles client roll die requests
  onDoRoll(client) {
    this.lastRoll = this.roll();

    if(this.currentPlayer == this.p1) {
      if(this.lastRoll == 1) {
        this.currentPlayer = this.p2;
        this.p1.turnTotal = 0; 
      } else {
        this.p1.turnTotal += this.lastRoll;
      }
    } else {
      if(this.lastRoll == 1) {
        this.currentPlayer = this.p1;
        this.p2.turnTotal = 0;
      } else {
        this.p2.turnTotal += this.lastRoll;
      }
    }

    this.broadcast({type: "game-update", data:this.state});
  }

  // callback handles client hold requests
  onDoHold(client) {

    if(this.currentPlayer == this.p1) {
      this.p1.score += this.p1.turnTotal;
      this.p1.turnTotal = 0;

      if(this.p1.score >= 100) {
        this.gameWinner = this.p1.id;
        this.gameOver = true;
      } else {
        this.currentPlayer = this.p2;
      }
    } else {
      this.p2.score += this.p2.turnTotal;
      this.p2.turnTotal = 0;

      if(this.p2.score >= 100) {
        this.gameWinner = this.p2.id;
        this.gameOver = true;
      } else {
        this.currentPlayer = this.p1;
      }
    }

    this.broadcast({type: "game-update", data:this.state});

    if(this.gameOver) {
      console.log("Ending game: " + this.id);
      // end the game and send end game messages after a second.
      setTimeout(() => this.end(), 1000);
    }
  }  

  // roll a 1d6
  roll() {
    return Math.floor((Math.random()*6)+1);
  }

  // broadcasts a message to both the players
  broadcast(msg) {
    console.log("game " + this.id + " says: " + JSON.stringify(msg))
    this.p1.send(msg);
    this.p2.send(msg);
  }  

  // the current state of the game bits
  get state() {
    return {
      "id": this.id,
      "currentPlayer": this.currentPlayer.id,
      "gameOver": this.gameOver,
      "gameWinner": this.gameWinner,
      "p1TurnTotal": this.p1.turnTotal,
      "p2TurnTotal": this.p2.turnTotal,
      "p1Score": this.p1.score,
      "p2Score": this.p2.score,
      "lastRoll": this.lastRoll
    };
  }

  end() {
    this.gameEnded = true;
    console.log("Emitting end event!");
    this.emit('end', this);
    this.cleanup();
  }

  cleanup() {
    // clean up if any
    this.p1.turnTotal = 0;
    this.p1.score = 0;
    this.p2.turnTotal = 0;
    this.p2.score = 0;

    // clients are ready
    this.p1.removeAllListeners('ready');
    this.p2.removeAllListeners('ready');    

    // client requested to do a die roll
    this.p1.removeAllListeners('roll');
    this.p2.removeAllListeners('roll');

    // client requested to hold current turn total
    this.p1.removeAllListeners('hold');
    this.p2.removeAllListeners('hold');

    console.log("Cleanup complete!");
  }  

}

module.exports = Game;