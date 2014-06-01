la-tech-hack-2014
=============


## Heroku Setup

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
