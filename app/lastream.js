var twitterstream = require('./twitterstream');
var mongohelper = require('./mongohelper');
var geohelper = require('./geohelper');
var geolib = require('geolib');


var NE = {latitude: 34.8233, longitude: -117.6462};
var SW = {latitude: 32.8007, longitude: -118.9448};

var la_box = geohelper.getBoundingBoxArray(SW, NE);

var getLAStream = function(handler) {

    var stream_options = { locations: geohelper.getLocationFromCoords(SW, NE) };
    var stream = twitterstream.getStream(stream_options, handler);
    return stream;
};


module.exports.getLAStream = getLAStream
module.exports.bounding_box = la_box
