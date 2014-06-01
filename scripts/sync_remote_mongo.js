var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../app/mongohelper');

var connection = process.env.LOCAL_MONGOHQ

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

