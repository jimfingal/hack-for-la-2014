var twitterstream = require('../server/twitterstream');
var streamhelper = require('../server/streamhelper');
var _ = require('underscore');
var mongohelper = require('../server/mongohelper');
var config = require('../server/config');


var Q = '';

var latitude = 42.366791;
var longitude = -71.106010;
var radius = '5mi';

console.log('Searching');
var searchFunction = _.partial(twitterstream.searchGeo, Q, latitude, longitude, radius);

var max_times = 5;
var count = 0;
var last_max;
var timeout = 10 * 1000;


var getMaxId = function(next_results) {
  return next_results.split('?')[1].split('&')[0].split('=')[1];
}

var counts = {};

var processData = function(err, data, response) {
    console.log(err); 
    _.each(data['statuses'], function(tweet) {
        if (streamhelper.qualified(tweet)) {
            console.log("Qualified: " + tweet.text); 
            mongohelper.insertDocument(config.mongo.TWEET_COLLECTION, tweet);
        }
    });
};

/*
var searchAndRecurse = function rSearchAndRecurse(max_id, lang, times_left) { 

    if (times_left > 0) {
        searchFunction(processData, max_id, lang);
        var new_left = times_left - 1;

    }


    count = count + 1;
    console.log("Search " + count); 
    
    if (next_results && count < max_times) {
        var next_max = getMaxId(next_results);

        var func = function() {
            rSearchAndRecurse(max_id, lang);
        };
        setTimeout(func, timeout);
        
    } else {
        console.log('Done');
    }
};
*/



var incompleteCommonAltCharset = [
    'ja', // japanese
    'th', // thai
    'ar', 'ur', 'ps', // arabic
    'ko', // korean
    'zh', // chinese
    'fa', 'ps', // persian
    'sa', // sanskrit
    'ka', // Georgian
    'iw', 'he', // hebrew
    'hi', 'mr', 'ne', // Deva
    'hy', // Armenian
    'bn', // bengali
    'ab', 'be', 'bg', 'kk', 'mk', 'ru', 'uk', // Cyrl
    'am', 'ti', // Ethi
    'as', 'bn', // Beng
    'az', // Azerbaijani
    'el', // greek
    'lo', // lao
    'gu', 'dl', 'dv', 'dz', 'km', 'kn', 'ml', 'or', 'pj',
    'si', 'ta', 'te' // misc
];


var la_counts = [
"ja",
"es",
"ru",
"fr",
"fa",
"ar",
"ko",
"th",
"it",
"nl",
"pt",
"tr",
"zh",
"ka",
"de",
"gu",
"bg",
"uk",
"iw",
"sv",
"ur",
"el",
"hi"
];

var all_langs = _.union(incompleteCommonAltCharset, la_counts);
console.log(all_langs.length);

var two_langs = ["ja", "es"];

_.each(all_langs, function(lang) {
    var func = function() {
        searchFunction(processData, undefined, lang);
    };
    setTimeout(func, Math.random() * 30000);
});





