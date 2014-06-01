var MongoClient = require('mongodb').MongoClient;
var db_name = "lahack";
var TWEET_COLLECTION = "tweets"

var connection = process.env.LOCAL_MONGOHQ

var MongoClient = require('mongodb').MongoClient;


MongoClient.connect(connection, function(err, db) {
  if(err) throw err;
  db.collection(TWEET_COLLECTION).count(function(err, count) {
      if(err) throw err;
      console.log(count);
  });
});

MongoClient.connect(connection, function(err, db) {
  if(err) throw err;
  db.collection(TWEET_COLLECTION).group(
        ['lang'],
        {},
        { "count": 0 },
        "function( curr, result ) { result.count++; }", 
        function(err, results) {
            if(err) throw err;
            console.log(results);
        });
});
