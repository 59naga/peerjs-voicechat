// Dependencies
const express = require('express');
const createHttpServer = require('http').createServer;
const createIo = require('socket.io');
const createPeerServer = require('peer').ExpressPeerServer;

// Environment
const port = process.env.PORT || 59798;

// Routes
const app = express();
const httpServer = createHttpServer(app);
const io = createIo(httpServer);
const peerServer = createPeerServer(httpServer);

app.use('/api', peerServer);
app.use(express.static(__dirname));

// Boot
httpServer.listen(port, () => {
  console.log(`Boot on http://localhost:${port}`);
});

// Manage p2p keys
const keys = [];
peerServer.on('connection', (key) => {
  keys.push(key);

  console.log('connected', keys);

  io.emit('keys', keys);
});
peerServer.on('disconnect', (key) => {
  const index = keys.indexOf(key);
  if (index > -1) {
    keys.splice(index, 1);
  }
  console.log('disconnect', keys);

  io.emit('keys', keys);
});
