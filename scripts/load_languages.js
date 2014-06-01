
var fs = require('fs');
var _ = require('underscore');

var INFILE = './data/language_registry.txt';
var OUTFILE = './data/languages.json';

console.log("Reading from " + INFILE);

var data = fs.readFileSync(INFILE);

var languages = [];

var buckets = (data + "").split("\n%%\n");

_.each(buckets, function(language_bucket) {
    var lines = language_bucket.split('\n');
    var this_language = {};
    _.each(lines, function(line) {
        var kv = line.split(": ");
        if (kv[0]) {
            this_language[kv[0]] = kv[1];
        }
    });
    languages.push(this_language);
});


fs.writeFile(OUTFILE, JSON.stringify(languages, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + OUTFILE);
    }
    process.exit();
}); 


