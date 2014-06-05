var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var mongohelper = require('../server/mongohelper');
var config = require('../server/config');
var clusterfck = require('clusterfck');



var averagePoint = function(array_of_points) {

  var totals = _.reduce(array_of_points,
                        function(memo, r) { return [memo[0] + r[0], memo[1] + r[1]]; },
                        [0 , 0]);
  return [totals[0] / array_of_points.length, totals[1] / array_of_points.length];

};


MongoClient.connect(config.mongo.LOCAL_CONNECTION, function(err, db) {
  if (err) throw err;
  db.collection(config.mongo.TWEET_COLLECTION).
    find({'lang': 'ja'}).
    toArray(function(err, documents) {

    var points = [];
    _.each(documents, function(doc) {
      points.push(doc.coordinates.coordinates);
    });

    var clusters = clusterfck.kmeans(points, 10);
    var centerpoints = [];

    _.each(clusters, function(cluster) {
      centerpoints.push(averagePoint(cluster));
    });

    console.log(centerpoints);
    db.close();
    process.exit();

  });

});
