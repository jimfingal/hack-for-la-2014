var language_data = require('../data/languages.json');
var _ = require('underscore');
var mongohelper = require('./mongohelper');

var code_to_description = {};
var counts = {};

_.each(language_data, function(atom) {
    if (atom['Type'] === 'language') {
        code_to_description[atom['Subtag']] = atom['Description'];
    }
});

var getDescriptionFromCode = function(tag) {
    return code_to_description[tag];
}

var getLanguageMap = function() {
    return _.clone(code_to_description);
}

var refreshCounts = function() {
   console.log("Refreshing counts");
   mongohelper.connect(function(err, db) {
        if (err) {
            console.log(err);
        } else {
            var new_counts = {};
            db.collection(mongohelper.TWEET_COLLECTION).group(
                ['lang'],
                {},
                { "count": 0 },
                "function( curr, result ) { result.count++; }", 
                function(err, results) {
                    if(err) throw err;
                    _.each(results, function(result) {
                        new_counts[result['lang']] = result['count'];
                    });

                    counts = new_counts;
                });
        }
   });
}

var getCounts = function() {
    return _.clone(counts);
}

refreshCounts();
setInterval(refreshCounts, 60 * 1000);

module.exports.getDescriptionFromCode = getDescriptionFromCode;
module.exports.getLanguageMap = getLanguageMap;
module.exports.getCounts = getCounts;
