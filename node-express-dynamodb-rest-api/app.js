const server = require(`./server`);

require(`dotenv`).config();

console.log("create server");
server.createServer();
