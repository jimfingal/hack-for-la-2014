
var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');
var streamhelper = require('./streamhelper');
var languagehelper = require('./languagehelper');
var config = require('./config')

var getTweetDescription = function(tweet) {
      var msg = "Tweet [" + tweet.id + "] TL: " + tweet.user.lang + "; UL: " + tweet.lang;
      msg = msg + " [" + tweet.coordinates.coordinates[1] + "," + tweet.coordinates.coordinates[0] + "]";
      msg = msg + " :: " + tweet.text;
      return msg;
};

var printGeoData = function(tweet) { 
  if (tweet.coordinates && 
      streamhelper.insideBox(tweet, streamhelper.bounding_box) && 
      languagehelper.tweetOtherThanEnglish(tweet)) {
      
      console.log(getTweetDescription(tweet));
  
  }
};


var handleIncomingTweet = function(tweet) {
    printGeoData(tweet);
    mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, tweet);
};


var stream = streamhelper.getStream(handleIncomingTweet);
