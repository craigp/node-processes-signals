var net = require('net'),
  port = 1337,
  host = "127.0.0.1";

process.send("child process started on pid " + process.pid);
process.send("alive");

var sock = net.createConnection(port, host, function() {
  console.log("created connection");
});

sock.on("connect", function() {
  console.log("connected");
  sock.setEncoding('utf8');
  sock.write("zomg", function() {
    console.log("data sent");
    sock.end();
  });
}).on('end', function() {
  console.log("socket closed");
});

process.on('message', function(msg) {
  console.log("parent message:", msg);
  process.send("received message -> " + msg);
  if (/die/.test(msg)) {
    process.exit();
  }
}).on('exit', function () {
  console.log("child process exiting");
}).on("SIGHUP", function() {
  console.log("SIGHUP received");
  process.exit();
});
