la-tech-hack-2014
=============

## About

Los Angeles Linguistic Geography is an experiment in visualizing real-time linguistic data.

Data on tweets in languages other than English are visualized based on their location. As the tweets occur in real-time, they are displayed and pop up on the map. Each color on the 

The focus of this project is to explore the possiblities of real-time local visualization of information and communication within a city. The next steps would be to start doing analytics on the data, to give more up-to-date information on language use in the community:

* What languages are most prevalent across the city?
* What languages are most prevalent in neighborhoods?
* How do languages used on twitter correlate with census data on language spoken in the home?
* What languages do visitors use, vs. locals?
* How does language use correspond to local socio-economic trends or other demographic data?
 
Map data is sourced from Esri, using the Esri Leaflet plugin.

Linguistic data is sourced from Twitter, and is embedded within Tweets that are accessed via the Twitter API. The server subscribes to all tweets within the bounding box of Los Angeles, and filters to only store/display Tweets that either are tagged as in a language other than English, or whose users are configured as having a native language other than English.


The project can be found at: http://losangeleslinguisticgeography.herokuapp.com/

This project is open source; the source can be found on github at: https://github.com/jimmytheleaf/hack-for-la-2014

## Deployment Notes

```shell
heroku create losangeleslinguisticgeography
heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-nodejs
heroku labs:enable websockets
heroku addons:add mongolab

heroku config:set TWITTER_CONSUMER_KEY_LAHACK="XXXX"
heroku config:set TWITTER_CONSUMER_SECRET_LAHACK="XXXX"
heroku config:set TWITTER_ACCESS_TOKEN_LAHACK="XXXX"
heroku config:set TWITTER_ACCESS_TOKEN_SECRET_LAHACK="XXXX"
```
