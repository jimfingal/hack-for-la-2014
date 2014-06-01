var language_data = require('../data/languages.json');
var _ = require('underscore');

var code_to_description = {};

_.each(language_data, function(atom) {
    if (atom['Type'] === 'language') {
        code_to_description[atom['Subtag']] = atom['Description'];
    }
});

var getDescriptionFromCode = function(tag) {
    return code_to_description[tag];
}

var getLanguageMap = function() {
    return code_to_description;
}

module.exports.getDescriptionFromCode = getDescriptionFromCode;
module.exports.getLanguageMap = getLanguageMap;
