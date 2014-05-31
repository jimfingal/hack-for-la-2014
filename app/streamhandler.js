
var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');

// Los Angeles: https://www.flickr.com/places/info/12587688
var NE = {latitude: 34.8233, longitude: -117.6462};
var SW = {latitude: 32.8007, longitude: -118.9448};

var la_box = geohelper.getBoundingBoxArray(SW, NE);

var TWEET_COLLECTION = "tweets"


var insideBox = function(tweet, box) {
  var tweet_geo = {latitude: tweet.coordinates.coordinates[1], 
                  longitude: tweet.coordinates.coordinates[0]};

  return geolib.isPointInside(tweet_geo, la_box);
}

var notEnOrUnd = function(lang) {
    return lang !== "en" && lang !== "und";
};

var tweetOtherThanEnglish = function(tweet) {

    var user_lang = tweet.user.lang;
    var tweet_lang = tweet.lang

    return notEnOrUnd(user_lang) || notEnOrUnd(tweet_lang);
};

var getTweetDescription = function(tweet) {
      var msg = "Tweet [" + tweet.id + "] TL: " + tweet.user.lang + "; UL: " + tweet.lang;
      msg = msg + " [" + tweet.coordinates.coordinates[1] + "," + tweet.coordinates.coordinates[0] + "]";
      msg = msg + " :: " + tweet.text;
      return msg;
}


var printGeoData = function(tweet) { 
  if (tweet.coordinates && insideBox(tweet, la_box) && tweetOtherThanEnglish(tweet)) {
      console.log(getTweetDescription(tweet));
  }
};


var handleIncomingTweet = function(tweet) {
    printGeoData(tweet);
    mongohelper.insertDocument(TWEET_COLLECTION, tweet);
};


var stream_options = { locations: geohelper.getLocationFromCoords(SW, NE) };

var stream = twitterstream.getStream(stream_options, handleIncomingTweet);
