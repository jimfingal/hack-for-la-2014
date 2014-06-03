
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

var connect = function(callback) {
   MongoClient.connect(config.mongo.CONNECTION, function(err, db) {
      callback(err, db);
   });
}


module.exports.insertDocument = insertDocument;
module.exports.insertDocIntoCollection = insertDocIntoCollection;
module.exports.getDB = getDB; // bad encapsulation
module.exports.connect = connect;
