var net = require('net'),
  childProcess = require('child_process'),
  child = childProcess.fork('./child.js'),
  port = 1337,
  host = "127.0.0.1";

console.log("parent process started on pid", process.pid);

var server = net.createServer(function(listener) {
  listener.setEncoding('utf8');
  listener.on('data', function(data) {
    console.log("data:", data);
  });
}).listen(port, host, function() {
  console.log("server listening");
}).on('connection', function() {
  console.log("socket connection");
});

setTimeout(function() {
  child.send("die!");
}, 3000);

child.on('message', function(msg) {
  if (/alive/.test(msg)) {
    console.log("child process alive on", child.pid);
  } else {
    console.log("child message:", msg);
  }
}).on('exit', function(code, signal) {
  console.log("child process exited:", code);
  process.exit();
});

setTimeout(function() {
  process.kill(child.pid, "SIGHUP");
}, 2000);
