
var Twit = require('twit');
var gracefulshutdown = require('./gracefulshutdown');

var CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY_LAHACK;
var CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET_LAHACK;
var ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_LAHACK;
var ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET_LAHACK;

var T = new Twit({
    consumer_key: CONSUMER_KEY
  , consumer_secret: CONSUMER_SECRET
  , access_token: ACCESS_TOKEN
  , access_token_secret: ACCESS_TOKEN_SECRET
});


var getStream = function(stream_options, tweet_callback) {

    // See: https://dev.twitter.com/docs/streaming-apis/parameters#locations
    var stream = T.stream('statuses/filter', stream_options);

    stream.on('tweet', function (tweet) {
        tweet_callback(tweet);
    });

    stream.on('limit', console.log);
    stream.on('warning', console.log);
    stream.on('disconnect', console.log);

    // Don't double-stop
    var stop = function() {
      if (stream.request) {
        stream.stop();
      }
    }

    gracefulshutdown.addShutdownCallback(stop);

};

module.exports.getStream = getStream;

