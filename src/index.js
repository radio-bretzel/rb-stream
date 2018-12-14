const http = require('http');
const StreamReader = require('./StreamReader')

let clients = [];

const stream = new StreamReader('https://s2.radio.co/sdf9aeb4e9/listen')

stream.startReading()


// When a chunk of data is received on the stream, push it to all connected clients
stream.on("data", function (chunk) {
  if (clients.length > 0) {
    for (client in clients) {
      clients[client].write(chunk);
    };
  }
});

// Listen on a web port and respond with a chunked response header. 
var server = http.createServer(function (req, res) {
  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    'Transfer-Encoding': 'chunked'
  });
  // Add the response to the clients array to receive streaming
  clients.push(res);
  console.log('Client connected; streaming');
});
server.listen("8000", "127.0.0.1");

console.log('Server running at http://127.0.0.1:8000'); 