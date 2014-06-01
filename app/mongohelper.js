
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var gracefulshutdown = require('./gracefulshutdown');

var db_name = "lahack";
var TWEET_COLLECTION = "tweets"

var local_connection = "mongodb://127.0.0.1:27017/" + db_name;
var connection = process.env.MONGOHQ_URL || local_connection;


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
MongoClient.connect(connection, function(err, database) {
  if(err) throw err;
  db = database;
  gracefulshutdown.addShutdownCallback(closeConnection);

});


var insertErrorCheck = function (err, inserted) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
}

var insertDocument = function(collection, doc) {
    db.collection(collection).insert(doc, insertErrorCheck);
};

var insertDocIntoCollection = function(collection) {
    return _.partial(insertDocument, collection);
}

var getDB = function() {
    return db;
};


module.exports.insertDocument = insertDocument;
module.exports.insertDocIntoCollection = insertDocIntoCollection;
module.exports.TWEET_COLLECTION = TWEET_COLLECTION;
module.exports.getDB = getDB; // bad encapsulation
