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
      'underscore' : 'bower_components/underscore/underscore',
      'tinycolor' : 'bower_components/tinycolor/tinycolor'
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


require(['socket.io', 'jquery', 'leaflet', 'underscore', 'tinycolor',
          'esri-leaflet', 'jquery-ui', 'bootstrap', 'twidgets'],
  function(io, $, L, _, tinycolor) {

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

    var language_count = {};
    var code_to_color = {};

    var sortedCounts = function() {
      return _.sortBy(_.pairs(language_count), function(array) { return array[1]; }).reverse();
    }

    var refreshColors = function() {

      var sorted_counts = sortedCounts(language_count);
      var total = sorted_counts.length;

      var i = 0;
      _.each(sorted_counts, function(pair) {
          i++;
          var color = tinycolor("hsv " + ((i / total) * 360) + " 100 75").toHexString();
          code_to_color[pair[0]] = color;
      });

    };

    var refreshCounts = function() {
      $.ajax({url: "/counts"}).done(function(data) {
        language_count = data;
        refreshColors();
      });
    }


    var getLangColor = function(code) {
      if(code_to_color[code]) {
        return code_to_color[code];
      } else {
        return "#f03";
      }
    }


    refreshCounts();
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
      return "<a target='_blank' href='https://twitter.com/" + username.trim() + " /statuses/" + id + "'>" + text + "</a>";
    }

    var notEnglish = function(desc) {
      return desc !== 'English';
    }

    var getLanguageDisplay = function(tweet) {
      var descriptions = [];
      if (notEnglish(tweet['tweet_lang'])) {
        descriptions.push("T: " + tweet['tweet_lang']);
      }
      if (notEnglish(tweet['user_lang'])) {
        descriptions.push("U: " + tweet['user_lang']);
      }
      return descriptions.join(' / ');
    }

    var popupText = function(tweet) {
      var result = "<b>" + getLanguageDisplay(tweet) + "</b><br/>";
      result = result + tweet['text'] + "<br/>";
      result = result + getStatusLink(tweet['screen_name'], tweet['id_str'], tweet['screen_name']);
      return result;
    }

    var getMarker = function(tweet) {
      //var marker = L.marker(tweet['latlng']);
      var marker = L.circleMarker(tweet['latlng'], {
        radius: 8,
        color: "black",
        fillColor: getLangColor(tweet['tweet_lang_code']),
        fillOpacity: 0.5
      });
      return marker;
    }

    var renderTweetToPage = function(tweet, last) {
      //console.log(tweet);
      var marker = getMarker(tweet).addTo(map);

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

