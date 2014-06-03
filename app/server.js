var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  request = require('request'),
  _ = require('underscore'),
  io = require('socket.io');

var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var streamhelper = require('./streamhelper');
var languagehelper = require('./languagehelper');
var config = require('./config');


var app = express();

app.configure(function() {
  app.set('port', config.web.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

var TITLE = config.geo.title + " Linguistic Geography";

app.get('/stream', function(req, res) {
  res.render('index', { title: TITLE });
});

app.get('/', function(req, res) {
  res.render('map', { title: TITLE });
});


app.get('/counts', function(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(languagehelper.getCounts()));
});

app.get('/counts', function(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(languagehelper.getCounts()));
});


var server = http.createServer(app);
var serverio = io.listen(server).set('log level', 2);


var descriptionOrCode = function(code) {
  
  var desc = languagehelper.getDescriptionFromCode(code);

  if (desc) {
    return desc;
  } else {
    return code;
  }

}


var minnifyTweet = function(tweet) {
 
  var abbreviatedTweet = _.pick(tweet, "id_str", "text");
  abbreviatedTweet['latlng'] = [tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]];
  abbreviatedTweet['tweet_lang_code'] = tweet.lang;
  abbreviatedTweet['user_lang_code'] = tweet.user.lang;
  abbreviatedTweet['tweet_lang'] = descriptionOrCode(tweet.lang);
  abbreviatedTweet['user_lang'] = descriptionOrCode(tweet.user.lang);
  abbreviatedTweet['time_zone'] = tweet.user.time_zone;
  abbreviatedTweet['screen_name'] = tweet.user.screen_name;
  return abbreviatedTweet;
};

var broadcastTweets = function(tweets, socket) {
  _.each(tweets, function(tweet) {
    socket.emit('tweetbatch', minnifyTweet(tweet));
  });
};

var cache = [];

var refreshCache = function() {
   mongohelper.connect(function(err, db) {
      db.collection(config.mongo.TWEET_COLLECTION).find().sort([['created_at', -1]]).limit(2000).toArray(function(err, documents) {
        cache = documents;
      });
    });
}

refreshCache();
setInterval(refreshCache, 300 * 1000);

serverio.sockets.on('connection', function(socket) {  
  _.each(cache, function(tweet) {
      var smallerTweet = minnifyTweet(tweet);
      serverio.sockets.emit('tweetbatch', smallerTweet);
  });
});

server.listen(app.get('port'));
console.log('listening on port ' + app.get('port'));

var broadcastTweet = function(tweet) {

  var smallerTweet = minnifyTweet(tweet);
  serverio.sockets.emit('tweet', smallerTweet);

};


var handleIncomingTweet = function(tweet) {
  if (streamhelper.qualified(tweet)) {
    console.log("Got Tweet: " + tweet.id_str);
    mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, tweet);
    broadcastTweet(tweet);
  }
};

var stream_options = { 
  locations: geohelper.getLocationFromCoords(config.geo.box.SW, config.geo.box.NE) 
};

var stream = twitterstream.getStream(stream_options, handleIncomingTweet);


