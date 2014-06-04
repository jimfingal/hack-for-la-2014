
var Twit = require('twit');
var gracefulshutdown = require('./gracefulshutdown');
var config = require('./config');

var T = new Twit({
    consumer_key: config.twitter.CONSUMER_KEY
  , consumer_secret: config.twitter.CONSUMER_SECRET
  , access_token: config.twitter.ACCESS_TOKEN
  , access_token_secret: config.twitter.ACCESS_TOKEN_SECRET
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


var getGeocode = function(lat, lon, rad) {
    return lat + "," + lon + "," + rad;
};

var searchGeo = function(query, latitude, longitude, radius, handler, max_id, lang) {

    var options = {q: query,
      geocode: getGeocode(latitude, longitude, radius), 
      count: 100,
      result_type: 'recent',
      include_entities: 'false'
    };

    if (max_id) {
      options['max_id'] = max_id;
    }

    if (lang) {
      options['lang'] = lang;
    }

    console.log(options);

    T.get('search/tweets', options, handler);
};

module.exports.getStream = getStream;
module.exports.searchGeo = searchGeo;

