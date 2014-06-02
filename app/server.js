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
var lastream = require('./lastream');
var languagehelper = require('./languagehelper');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/stream', function(req, res) {
  res.render('index', { title: 'La Hack Day' });
});

app.get('/', function(req, res) {
  res.render('map', { title: 'La Hack Day' });
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

serverio.sockets.on('connection', function(socket) {  
  
  mongohelper.getDB().collection(mongohelper.TWEET_COLLECTION).
    find().sort([['created_at', -1]]).limit(1000).toArray(function(err, documents) {
        broadcastTweets(documents, socket);
  });
  
});

server.listen(app.get('port'));
console.log('listening on port ' + app.get('port'));


var NE = {latitude: 34.8233, longitude: -117.6462};
var SW = {latitude: 32.8007, longitude: -118.9448};



var broadcastTweet = function(tweet) {

  var smallerTweet = minnifyTweet(tweet);
  serverio.sockets.emit('tweet', smallerTweet);

};


var handleIncomingTweet = function(tweet) {
  if (lastream.qualified(tweet)) {
    console.log("Got Tweet: " + tweet.id_str);
    mongohelper.insertDocument(mongohelper.TWEET_COLLECTION, tweet);
    broadcastTweet(tweet);
  }
};

var stream_options = { locations: geohelper.getLocationFromCoords(SW, NE) };
//var stream = twitterstream.getStream(stream_options, handleIncomingTweet);


