
var _ = require('underscore');

var callbacks = [];

var SECOND_WAIT = 2;

var addShutdownCallback = function(callback) {
    callbacks.push(callback);
};

var logError = function(err) {

    if (err) {
        console.log(err);
        console.log(err.stack);
    }
};


var gracefulShutdown = function() {

    console.log("Received kill signal, shutting down gracefully.");
    console.error("Executing callbacks, closing after " + SECOND_WAIT + " seconds");

    _.each(callbacks, function(callback) {
        callback();
    });

    setTimeout(function() {
       console.error("Exiting");
       process.exit();
    }, SECOND_WAIT * 1000);

};


process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  gracefulShutdown();
});

process.on('SIGTERM', function() {
  console.log('Got SIGTERM.');
  gracefulShutdown();
});

process.on('uncaughtException', function(err) {
  console.log('Uncaught exception');
  logError(err);
  gracefulShutdown();
});


module.exports.addShutdownCallback = addShutdownCallback;
module.exports.gracefulShutdown = gracefulShutdown;
