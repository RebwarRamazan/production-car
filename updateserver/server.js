const http = require("http");
const app = require("./App");

const port = process.env.PORT || 4000;

const server = http.createServer(app);
var cluster = require('cluster');

if (cluster.isMaster) {
  var cpuCount = require('os').cpus().length;
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', function () {
    cluster.fork();
  });
} else {
    server.listen(port, () => console.log(`the server ${process.pid} running on port ${port}`));
}

// server.listen(port, () => console.log(`the server running on port ${port}`));
