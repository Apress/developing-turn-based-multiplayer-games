const EventEmitter = require('events');

class Game extends EventEmitter {

  constructor(id, p1, p2) {
    super();

    // game id
    this.id = id;

    // the players
    this.p1 = p1;
    this.p2 = p2;

    // setting some player properties
    this.p1.room = "game";
    this.p2.room = "game";
    this.p1.currentGameID = this.id;
    this.p2.currentGameID = this.id;

    // our current player, when the game starts is always player one!
    this.currentPlayer = this.p1;   
    
    // a game over flag
    this.gameOver = false;

    // a flag to mark who won the game
    this.gameWinner = 0; 

    this.broadcast({type: "game-start", data:this.state});

  }

  // broadcasts a message to both the players
  broadcast(msg) {
    this.p1.send(msg);
    this.p2.send(msg);
  }  

  // the current state of the game bits
  get state() {
    return {
      "id": this.id,
      "currentPlayer": this.currentPlayer.id,
      "gameOver": this.gameOver,
      "gameWinner": this.gameWinner
    };
  }

  end() {
    this.gameEnded = true;
    this.emit('end', this);
  }

  cleanup() {
    // clean up if any
  }  

}

module.exports = Game;