var mongohelper = require('../app/mongohelper');

var insertDoc = mongohelper.insertDocIntoCollection('test_collection');

insertDoc({'name' : 'this is a test doc using the partial'});
