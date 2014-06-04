var config = {};

config.mongo = {};
config.web = {};
config.twitter = {};
config.geo = {};
config.process = {};
config.lang = {};


config.web.PORT = process.env.PORT || 3000;

config.twitter.CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY_LAHACK;
config.twitter.CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET_LAHACK;
config.twitter.ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN_LAHACK;
config.twitter.ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET_LAHACK;

config.process.SHUTDOWN_WAIT = 2;



var locations = {
    "LA": {
        "title": "Los Angeles",
        "box": {
            "NE": {
                "latitude": 34.8233, 
                "longitude": -117.6462
            },
            "SW": {
                "latitude" : 32.8007, 
                "longitude": -118.9448
            }
        },
        "mapconfig": {
            "center": {
                "latitude" : 34.057, 
                "longitude": -118.238
            },
            "zoom": 10
        },
        "db" : "lahack",
        "minimum_tokens": 8
    }, 
    "BOS": {
        "title": "Boston",
        "box": {
            "NE": {
                "latitude": 42.424049, 
                "longitude": -70.923042
            },
            "SW": {
                "latitude" : 42.202671, 
                "longitude": -71.270477
            }
        },
        "mapconfig": {
            "center": {
                "latitude" : 42.346791, 
                "longitude": -71.0706010
            }, 
            "zoom": 12
        },
        "db" : "bostontweets",
        "minimum_tokens" : 6
    }
};

var locale = process.env.LANGHACK_LOCALE || "LA";

config.lang.MINIMUM_TOKENS = locations[locale].minimum_tokens;


var DB_NAME = locations[locale].db;

config.mongo.LOCAL_CONNECTION = "mongodb://127.0.0.1:27017/" + DB_NAME;
config.mongo.CONNECTION = process.env.MONGOHQ_URL || config.mongo.LOCAL_CONNECTION;
config.mongo.LOCAL_MONGOHQ = process.env.LOCAL_MONGOHQ;

config.mongo.TWEET_COLLECTION = "tweets";

config.geo.title = locations[locale].title;
config.geo.box = locations[locale].box;
config.geo.mapconfig = locations[locale].mapconfig;

config.twitter.ENABLE_STREAM = true;


module.exports = config;
