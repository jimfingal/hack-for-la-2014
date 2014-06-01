
var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');
var lastream = require('./lastream');


var insideBox = function(tweet, box) {
  var tweet_geo = {latitude: tweet.coordinates.coordinates[1], 
                  longitude: tweet.coordinates.coordinates[0]};

  return geolib.isPointInside(tweet_geo, box);
}


var getTweetDescription = function(tweet) {
      var msg = "Tweet [" + tweet.id + "] TL: " + tweet.user.lang + "; UL: " + tweet.lang;
      msg = msg + " [" + tweet.coordinates.coordinates[1] + "," + tweet.coordinates.coordinates[0] + "]";
      msg = msg + " :: " + tweet.text;
      return msg;
}


var printGeoData = function(tweet) { 
  if (tweet.coordinates && 
      insideBox(tweet, lastream.bounding_box) && 
      lastream.tweetOtherThanEnglish(tweet)) {
      
      console.log(getTweetDescription(tweet));
  
  }
};


var handleIncomingTweet = function(tweet) {
    printGeoData(tweet);
    mongohelper.insertDocument(mongohelper.TWEET_COLLECTION, tweet);
};


var stream = lastream.getLAStream(handleIncomingTweet);
