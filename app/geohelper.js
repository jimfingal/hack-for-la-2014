var geolib = require('geolib');

var getLocationFromCoords = function(sw, ne) {
    return [sw['longitude'], sw['latitude'], ne['longitude'], ne['latitude']].join();
}

var getPoint = function(lat, lng) { 
    return { latitude: lat, longitude: lng};
};

var getBoundingBoxArray = function(sw, ne) {
    return [ 
        getPoint(ne.latitude, sw.longitude),
        getPoint(ne.latitude, ne.longitude),
        getPoint(sw.latitude, ne.longitude),
        getPoint(sw.latitude, sw.longitude)
    ];
};



module.exports.getLocationFromCoords = getLocationFromCoords;
module.exports.getBoundingBoxArray = getBoundingBoxArray;
module.exports.isPointInside = geolib.isPointInside;
