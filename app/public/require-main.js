require.config({
    'baseUrl': '.',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'socket.io' : 'bower_components/socket.io-client/dist/socket.io.min',
      'twidgets' : 'lib/widgets',

    },
    'shim': {
        'jquery': {
            exports: 'jQuery'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'bootstrap': {
          deps: ['jquery']
        },
        'twidgets': {
          exports: 'w'
        }
    },
});

require(['socket.io', 'jquery', 'jquery-ui', 'bootstrap', 'twidgets'],
  function(io, $) {

    var loc = window.location;
    var url = location.protocol + '//' + location.hostname + ':' + location.port;

    var socket = io.connect(url);

    socket.on('disconnect', function () {
     console.log('Socket disconnected.');
    });

    socket.on('connect', function () {
     console.log('Socket connected.');
    });


    var getTweetHtml = function(tweet) {

      var result = "<h3>";
      result = result + tweet['tweet_lang'] + "/" + tweet['user_lang'];
      if (tweet['time_zone']) {
        result = result + " :: " + tweet['time_zone'];
      }
      result = result + " [" + tweet['coordinates']['coordinates'][0] +
              "," + tweet['coordinates']['coordinates'][1] + "]";
      result = result + "</h3>";
      return result;
    }

    var renderTweetToPage = function(tweet) {

      $.ajax({
          url: "https://api.twitter.com/1/statuses/oembed.json",
          type: "GET",
          // the name of the callback parameter, as specified by the YQL service
          jsonp: "callback",
          // tell jQuery we're expecting JSONP
          dataType: "jsonp",
 
          data: { 
            id : tweet.id_str,
            omit_script: "true"
          },
          // work with the response
          success: function( data ) {
            var result = getTweetHtml(tweet);
            result = result + data.html;
            $("#tweets" ).prepend(result);
          }
      });

    };

    
    socket.on('tweet', function (tweet) {
      renderTweetToPage(tweet);
    });

});

