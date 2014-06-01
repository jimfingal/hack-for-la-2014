define(['jquery', 'leaflet', 'underscore', 'tinycolor',
          'esri-leaflet', 'jquery-ui', 'bootstrap'], 
          function($, L, _, tinycolor) {

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

    var renderTweetToPage = function(tweet, last, map) {
      //console.log(tweet);
      var marker = getMarker(tweet).addTo(map);
      marker.bindPopup(popupText(tweet));
      markers[tweet.id_str] = marker;
    };

    var popUpTweet = function(tweet, last, map) {

      var marker = markers[tweet.id_str];
      if (last) {
        last.closePopup();
        last_marker = marker;
      }
      marker.openPopup();
      map.panTo(tweet['latlng'], {
        animate: true
      });
    }

    var initializeMap = function(socket) {

        refreshCounts();

        var map = L.map('map').setView([34.057, -118.238], 10);
        L.esri.basemapLayer("Topographic").addTo(map);

        socket.on('tweet', function (tweet) {
            renderTweetToPage(tweet, last_marker, map);
            popUpTweet(tweet, last_marker, map);
        });

        socket.on('tweetbatch', function (tweet) {
          renderTweetToPage(tweet, last_marker, map);
        });

        /*
        L.esri.featureLayer("http://services3.arcgis.com/fVH6HoncLPR9JkHX/arcgis/rest/services/LA_Neighborhoods/FeatureServer/0?token=42vjHoSzm-ODU9McyevtW4P8nfjvX8O-njT9WvWgh3y12LafHNo-K42p0TuDhOVyVwMbzcw_o8t0yZ0paIxfqdgTiCXMi88YYSyuGV06fOx7NW_idWvEsvztm_ge0i77FkepJaqy3rZeNwEgU4dws7Wp6IqRmF45X4Qi3TQGBsM720Gzz3plxNbwIVZ2JweS", {
           style: function (feature) {
              return { fillColor: "#70ca49"};
            }
        }).addTo(map);
        */

    }

   
    return initializeMap;

});
