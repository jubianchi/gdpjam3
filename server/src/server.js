var express = require('express');
var http = require('http');
var url = require('url');
var app = express();
var fs = require('fs');
var path = require('path');

var configureRIA = function(base, rootFolder) {

  /* serve static files
  app.use "#{base}/#{stat}", express.static path.join rootFolder, stat for stat in statics*/

  // SPA root need to be treaten differently, because of pushState. Must be after compilation middleware.
  app.get(base+"*", function(req, res, next){
    // redirects with trailing slash to avoid relative path errors from browser
    if (req.url === base) {
      return res.redirect(base+"/" );
    }

    pathname = url.parse(req.url).pathname.slice(base.length+1);
    // necessary to allow resolution of relative path on client side. Urls must ends with /
    pathname = pathname.indexOf('.html') === -1 ? 'index.html' : pathname;
    res.header('Content-Type', 'text/html; charset=UTF-8');
    fs.createReadStream(path.join(rootFolder, pathname || 'index.html')).on('error', function(){ 
      res.send(404);
    }).pipe(res);
  });
};

configureRIA('/game', './client');

http.createServer(app).listen(80);
