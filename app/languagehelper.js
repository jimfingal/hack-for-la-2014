var language_data = require('../data/languages.json');
var _ = require('underscore');
var mongohelper = require('./mongohelper');
var twittertexthelper = require('./twittertexthelper');
var config = require('./config');

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
    console.log("Swapping count cache");
    mongohelper.refreshCountsCache(counts);
}

var getCounts = function() {
    return _.clone(counts);
}


var notEnOrUnd = function(lang) {
    return lang !== "en" && lang !== "und" && lang !== 'en-gb';
};

var tweetOtherThanEnglish = function(tweet) {

    var user_lang = tweet.user.lang;
    var tweet_lang = tweet.lang

    return notEnOrUnd(user_lang) || notEnOrUnd(tweet_lang);
};


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

var isCommonAlternateCharacterSetLanguage = function(tweet) {
    return _.indexOf(incompleteCommonAltCharset, tweet.lang) > -1;
}

var languageAndUserMatch = function(tweet) {

  return tweet.lang === tweet.user.lang;

};

var likelyFalsePositive = function(tweet) {

  // Detecting Arabic, Korean, Chinese, Japanese, etc. likely better
  if (isCommonAlternateCharacterSetLanguage(tweet)) {
    return false;
  }

  if (languageAndUserMatch(tweet)) {
    return false;
  }

  return true;
  
  
  var clean_text = twittertexthelper.removeAllTwitterEntities(tweet.text);
  clean_text = clean_text.replace(/\s{2,}/g, ' ').trim();
  if (clean_text.split(' ').length < MINIMUM_TOKENS) {
    return true;
  } else {
    return false;
  }
  
};

// TODO put somewhere else
refreshCounts();
setInterval(refreshCounts, 600 * 1000);

module.exports.getDescriptionFromCode = getDescriptionFromCode;
module.exports.getLanguageMap = getLanguageMap;
module.exports.getCounts = getCounts;
module.exports.likelyFalsePositive = likelyFalsePositive;
module.exports.tweetOtherThanEnglish = tweetOtherThanEnglish;
