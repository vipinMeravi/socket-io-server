// Require the express framework
const express = require("express");
// Require the http module for request-response
const http = require("http");
// Require the socket.io module
const socketIo = require("socket.io");

// Define port for server, take from environment (Default value is 4001)
const port = process.env.PORT || 4001;
// Require the routes.
const index = require("./routes/index");

// Our app is now express
const app = express();
// Use the routes in our app
app.use(index);

// Create a server using http module.
const server = http.createServer(app);
// Now our server have the property of socket io.
const io = socketIo(server); // < Interesting!

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
