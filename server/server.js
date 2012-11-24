// Require libraries
var express = require("express"),
  url = require('url'),
  path = require('path'),
  http = require('http'),
  _ = require('underscore'),
  app, server,
  fs = require('fs-extra'),
  env = process.env.NODE_ENV || 'dev',
  rootFolder = 'client',
  conf = {},
  rooms = {},
  socketio = require('socket.io');

// Read configuration
env = env.trim();
var data = fs.readFileSync(path.join(__dirname, 'conf/'+env+'.json'), 'utf8');
conf=JSON.parse(data);

var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

// Serving static files
var statics = ['css', 'js', 'img', 'nls', 'template', 'sound'];
for (var i = 0, len = statics.length; i < len; i++) {
  app.use("/" + statics[i], express['static'](path.join(rootFolder, statics[i])));
}

app.get('/api/rooms', function(req, res) {
  var frees = [];
  // only return rooms with only one player
  for (var name in rooms) {
    if (rooms[name].length === 1) {
      frees.push(name);
    }
  }
  res.json(frees);
})

app.get('*', function(req, res, next) {
  // Static resources
  for (var i = 0, len = statics.length; i < len; i++) {
    if (0 === req.url.indexOf("/" + statics[i])) {
      return next();
    }
  }
  if (req.url.match(/^\/api\//) ) {
    return next();
  }

  // Pushstate SPA : always serve index.html
  var pathname = url.parse(req.url).pathname;
  if (pathname.indexOf('.html') === -1 && pathname !== '/') {
    pathname = '/index.html';
  }
  pathname = pathname.substring(1);
  res.header('Content-Type', 'text/html; charset=UTF-8');
  return fs.createReadStream(path.join(rootFolder, pathname || 'index.html')).on('error', function() {
    return res.send(404);
  }).pipe(res);
});

var server = http.createServer(app);
var io = socketio.listen(server);
io.set('log level', 0);

io.on('connection', function(socket) {

  // when the client emits 'register', register its room
  socket.on('register', function(player, room){
    socket.player = player;
    socket.room = room;
    // add player to room
    if (room in rooms) {
      rooms[room].push(player);
    } else {
      rooms[room] = [player];
    }
    socket.join(room);
    var msg = socket.player+' enter the room '+socket.room;
    console.log(msg);
    // send connected players
    io.sockets.in(socket.room).emit('players', rooms[room]);
  });

  // when the client emits 'message', then broadcast to room
  socket.on('message', function (data) {
    io.sockets.in(socket.room).emit('message', socket.player, data);
  });

  // when the user disconnects, leaves the room
  socket.on('disconnect', function(){
    if (!socket.room) {
      return;
    }
    var msg = socket.username+' leave the room '+socket.room;
    console.log(msg);
    io.sockets.in(socket.room).emit('players', msg);
    socket.leave(socket.room);
  });

});

server.listen(conf.port, conf.host, function () {
  console.log('Starting server in ' + env + ' mode on ' + server.address().address + ':' + server.address().port);
});