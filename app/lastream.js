var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');
var languagehelper = require('./languagehelper');

var NE = {latitude: 34.8233, longitude: -117.6462};
var SW = {latitude: 32.8007, longitude: -118.9448};

var la_box = geohelper.getBoundingBoxArray(SW, NE);

var getLAStream = function(handler) {

    var stream_options = { locations: geohelper.getLocationFromCoords(SW, NE) };
    var stream = twitterstream.getStream(stream_options, handler);
    return stream;
};

var insideBox = function(tweet, box) {
  var tweet_geo = {latitude: tweet.coordinates.coordinates[1], 
                  longitude: tweet.coordinates.coordinates[0]};

  return geolib.isPointInside(tweet_geo, box);
};

var qualified = function(tweet) {
    return  tweet.coordinates && 
            languagehelper.tweetOtherThanEnglish(tweet) &&
            insideBox(tweet, la_box) &&
            !languagehelper.likelyFalsePositive(tweet);
};

// TODO: http://socket.io/

module.exports.getLAStream = getLAStream;
module.exports.bounding_box = la_box;
module.exports.qualified = qualified;
module.exports.insideBox = insideBox;
