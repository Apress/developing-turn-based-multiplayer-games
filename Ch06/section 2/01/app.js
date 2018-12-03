const GameServer = require("./GameServer.js");

// the port and address that our server will be on
const PORT = 5836;
const ADDRESS = "127.0.0.1";

// create our game server
let game = new GameServer(PORT, ADDRESS);

// log our server details when the server starts
console.log(`Server started at ${ADDRESS}:${PORT}`);