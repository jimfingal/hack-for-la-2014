var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../app/mongohelper');
var config = require('../app/config');

MongoClient.connect(config.mongo.LOCAL_MONGOHQ, function(err, db) {
  if(err) throw err;
  db.collection(config.mongo.TWEET_COLLECTION).find().toArray(function(err, documents) {
      if(err) throw err;
      _.each(documents, function(doc) {
        mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, doc);
      });

      console.log("Documents inserted");
      db.close();
      process.exit();
  });
});
