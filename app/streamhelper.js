var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');
var languagehelper = require('./languagehelper');
var config = require('./config');

var bounding_box = geohelper.getBoundingBoxArray(config.geo.box.SW, config.geo.box.NE);

var getStream = function(handler) {

    var stream_options = { 
      locations: geohelper.getLocationFromCoords(config.geo.box.SW, config.geo.box.NE) 
    };
    var stream = twitterstream.getStream(stream_options, handler);
    return stream;
};

var insideBox = function(tweet, box) {
  var tweet_geo = {
    latitude: tweet.coordinates.coordinates[1], 
    longitude: tweet.coordinates.coordinates[0]
  };

  return geolib.isPointInside(tweet_geo, box);
};

var qualified = function(tweet) {
    return  tweet.coordinates && 
            languagehelper.tweetOtherThanEnglish(tweet) &&
            insideBox(tweet, bounding_box) &&
            !languagehelper.likelyFalsePositive(tweet);
};

// TODO: http://socket.io/

module.exports.getStream = getStream;
module.exports.bounding_box = bounding_box;
module.exports.qualified = qualified;
module.exports.insideBox = insideBox;
