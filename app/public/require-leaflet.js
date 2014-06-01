require.config({
    'baseUrl': '.',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'socket.io' : 'bower_components/socket.io-client/dist/socket.io.min',
      'twidgets' : 'lib/widgets',
      'leaflet': "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet",
      'esri-leaflet': "lib/esri-leaflet",

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
        },
        'leaflet': {
            exports: 'L'
        },
        'esri-leaflet': {
          deps: ['leaflet']
        },
    },
});

require(['socket.io', 'jquery', 'leaflet', 'esri-leaflet', 'jquery-ui', 'bootstrap', 'twidgets'],
  function(io, $, L) {

    var loc = window.location;
    var url = location.protocol + '//' + location.hostname + ':' + location.port;

    var socket = io.connect(url);

    socket.on('disconnect', function () {
     console.log('Socket disconnected.');
    });

    socket.on('connect', function () {
     console.log('Socket connected.');
    });

    var map = L.map('map').setView([34.057, -118.238], 10);

    L.esri.basemapLayer("Topographic").addTo(map);

    /*
    L.esri.featureLayer("http://services3.arcgis.com/fVH6HoncLPR9JkHX/arcgis/rest/services/LA_Neighborhoods/FeatureServer/0?token=42vjHoSzm-ODU9McyevtW4P8nfjvX8O-njT9WvWgh3y12LafHNo-K42p0TuDhOVyVwMbzcw_o8t0yZ0paIxfqdgTiCXMi88YYSyuGV06fOx7NW_idWvEsvztm_ge0i77FkepJaqy3rZeNwEgU4dws7Wp6IqRmF45X4Qi3TQGBsM720Gzz3plxNbwIVZ2JweS", {
       style: function (feature) {
          return { fillColor: "#70ca49"};
        }
    }).addTo(map);
    */

    var markers = {};

    var last_marker;

    var getStatusLink = function(username, id, text) {
      return "<a href='https://twitter.com/" + username.trim() + " /statuses/" + id + "'>" + text + "</a>";
    }

    var popupText = function(tweet) {
      var result = "<b>";
      result = result + tweet['tweet_lang'] + "/" + tweet['user_lang'];
      result = result + "</b><br/>";
      result = result + tweet['text'] + "<br/>";
      result = result + getStatusLink(tweet['screen_name'], tweet['id_str'], tweet['screen_name']);
      return result;
    }

    var renderTweetToPage = function(tweet, last) {
      //console.log(tweet);
      var marker = L.marker(tweet['latlng']).addTo(map);
      map.panTo(tweet['latlng'], {
        animate: true

      });
      
      if (last) {
        last.closePopup();
      }
      marker.bindPopup(popupText(tweet)).openPopup();

      last_marker = marker;

      markers[tweet.id_str] = marker;
    };

    socket.on('tweet', function (tweet) {
      renderTweetToPage(tweet, last_marker);
    });
              

});

