var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../app/mongohelper');
var config = require('../app/config');


/*
MongoClient.connect(connection, function(err, db) {
  if(err) throw err;
  db.collection(config.mongo.TWEET_COLLECTION).find().toArray(function(err, documents) {
      if(err) throw err;
      _.each(documents, function(doc) {
        mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, doc);
      });

      console.log("Documents inserted");
      process.exit();
  });
});
*/


var insertErrorCheck = function (err, inserted) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
};

var insertDocument = function(db, collection, doc) {
    db.collection(collection).insert(doc, insertErrorCheck);
};



MongoClient.connect(config.mongo.LOCAL_CONNECTION, function(err, db) {
  if(err) throw err;
  db.collection(config.mongo.TWEET_COLLECTION).find().toArray(function(err, documents) {
      if(err) throw err;
      MongoClient.connect(config.mongo.LOCAL_MONGOHQ, function(err2, db2) {
             if(err2) throw err2;
              _.each(documents, function(doc) {
                insertDocument(db2, config.mongo.TWEET_COLLECTION, doc);
                //console.log('Would insert doc: ' + doc);
              });
              console.log("Documents inserted");
    });
  });

});
