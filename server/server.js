// Require libraries
var express = require("express"),
  url = require('url'),
  path = require('path'),
  http = require('http'),
  app, server,
  fs = require('fs-extra'),
  env = process.env.NODE_ENV || 'dev',
  rootFolder = 'client',
  conf = {},
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
var statics = ['css', 'js', 'img', 'nls', 'template'];
for (var i = 0, len = statics.length; i < len; i++) {
  app.use("/" + statics[i], express['static'](path.join(rootFolder, statics[i])));
}

app.get('*', function(req, res, next) {
  // Static resources
  for (var i = 0, len = statics.length; i < len; i++) {
    if (0 === req.url.indexOf("/" + statics[i])) {
      return next();
    }
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

io. on('connection', function(socket) {
  socket.on('message', function(player, content) {
    console.log('>', player, content);
  });
});

server.listen(conf.port, conf.host, function () {
  console.log('Starting server in ' + env + ' mode on ' + server.address().address + ':' + server.address().port);
});