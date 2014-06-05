var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../server/mongohelper');

var languagehelper = require('../server/languagehelper');

var streamhelper = require('../server/streamhelper');
var mongohelper = require('../server/mongohelper');
var config = require('../server/config');


var removeLikelyFalsePositives = function(db) {
    var collection = db.collection(config.mongo.TWEET_COLLECTION);
    collection.find().toArray(function(err, documents) {
        var count = 0;
        _.each(documents, function(tweet) {
            if (!streamhelper.qualified(tweet)) {
                console.log('Likely false positive: ' + tweet.text);
                collection.remove({"_id": tweet._id}, function(err) {
                    if (err) throw err;
                });
                count = count + 1;
            }
        });
        console.log('Removed: ' + count);
    });
};


// Initialize connection once

/*
MongoClient.connect(config.mongo.LOCAL_CONNECTION, function(err, database) {
  if(err) throw err;
    removeLikelyFalsePositives(database);
    console.log('Done');
});
*/


MongoClient.connect(config.mongo.LOCAL_MONGOHQ, function(err, database) {
  if(err) throw err;
    removeLikelyFalsePositives(database);
    console.log('Done');
});



/*
MongoClient.connect(connection, function(err, db) {
  if(err) throw err;
  db.collection(mongohelper.TWEET_COLLECTION).find().toArray(function(err, documents) {
      if(err) throw err;
      _.each(documents, function(doc) {
        mongohelper.insertDocument(mongohelper.TWEET_COLLECTION, doc);
      });

      console.log("Documents inserted");
      process.exit();
  });
});
*/
