
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var gracefulshutdown = require('./gracefulshutdown');
var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
var db;

var closed = false;

var closeConnection = function() {
    if (!closed) {
        db.close();
        closed = true;
    }
}

// Initialize connection once
MongoClient.connect(config.mongo.CONNECTION, function(err, database) {
  if(err) throw err;
  db = database;
  gracefulshutdown.addShutdownCallback(closeConnection);
});


var insertErrorCheck = function (err, inserted) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
};

var insertDocument = function(collection, doc) {
    db.collection(collection).insert(doc, insertErrorCheck);
};

var insertDocIntoCollection = function(collection) {
    return _.partial(insertDocument, collection);
}

var getDB = function() {
    return db;
};

var refreshCountsCache = function(counts) {
  MongoClient.connect(config.mongo.CONNECTION, function(err, database) {
    database.collection(config.mongo.TWEET_COLLECTION).group(
        ['lang'],
        {},
        { "count": 0 },
        "function( curr, result ) { result.count++; }", 
        function(err, results) {
            if(err) throw err;
            _.each(results, function(result) {
                counts[result['lang']] = result['count'];
            });
            database.close();
        });
  });
};

var refreshTweetCache = function(cache) {
  MongoClient.connect(config.mongo.CONNECTION, function(err, database) {

    database.collection(config.mongo.TWEET_COLLECTION).find().sort([['created_at', -1]]).limit(2000).toArray(function(err, documents) {
      console.log("Swapping cache");
      cache.length = 0;
      Array.prototype.push.apply(cache, documents);
      database.close();
    });
  });
};


module.exports.insertDocument = insertDocument;
module.exports.insertDocIntoCollection = insertDocIntoCollection;
module.exports.refreshTweetCache = refreshTweetCache;
module.exports.refreshCountsCache = refreshCountsCache;
