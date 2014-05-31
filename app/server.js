var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  request = require('request'),
  _ = require('underscore'),
  io = require('socket.io');
var geolib = require('geolib');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.render('index', { title: 'La Hack Day' });
});


var server = http.createServer(app);
var serverio = io.listen(server).set('log level', 2);

serverio.sockets.on('connection', function(socket) {  
  console.log("Connected to socket: " + socket);
});

server.listen(app.get('port'));
console.log('listening on port ' + app.get('port'));



