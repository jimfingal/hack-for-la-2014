var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../app/mongohelper');

var languagehelper = require('../app/languagehelper');

var lastream = require('../app/lastream');

var mongohq = process.env.LOCAL_MONGOHQ

var removeLikelyFalsePositives = function(db) {
    var collection = db.collection(mongohelper.TWEET_COLLECTION);
    collection.find().toArray(function(err, documents) {
        var count = 0;
        _.each(documents, function(tweet) {
            if (!lastream.qualified(tweet)) {
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
MongoClient.connect(mongohelper.local_connection, function(err, database) {
  if(err) throw err;
    removeLikelyFalsePositives(database);
    console.log('Done');
});
*/


MongoClient.connect(mongohq, function(err, database) {
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
