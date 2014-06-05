define(['jquery', 'leaflet', 'underscore', 'tinycolor', 'clusterfck',
          'esri-leaflet', 'jquery-ui', 'bootstrap'],
          function($, L, _, tinycolor, clusterfck) {

    var language_count = {};
    var code_to_color = {};
    var marker_layers = {};

    var cluster_layer = new L.LayerGroup();
    var layers_control = L.control.layers({}, marker_layers, {'position': 'bottomleft'});

    var sortedCounts = function() {
      return _.sortBy(_.pairs(language_count), function(array) { return array[1]; }).reverse();
    };

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
    };

    var getLangColor = function(code) {
      if (code_to_color[code]) {
        return code_to_color[code];
      } else {
        return "#f03";
      }
    };

    var markers = {};

    var last_marker;

    var getStatusLink = function(username, id, text) {
      return "<a target='_blank' href='https://twitter.com/" +
                    username.trim() + " /statuses/" + id + "'>" +
                    text + "</a>";
    };

    var notEnglish = function(desc) {
      return desc !== 'English';
    };

    var getLanguageDisplay = function(tweet) {
      var descriptions = [];
      if (notEnglish(tweet['tweet_lang'])) {
        descriptions.push("T: " + tweet['tweet_lang']);
      }
      if (notEnglish(tweet['user_lang'])) {
        descriptions.push("U: " + tweet['user_lang']);
      }
      return descriptions.join(' / ');
    };

    var popupText = function(tweet) {
      var result = "<b>" + getLanguageDisplay(tweet) + "</b><br/>";
      result = result + tweet['text'] + "<br/>";
      result = result + getStatusLink(tweet['screen_name'], tweet['id_str'], tweet['screen_name']);
      return result;
    };

    var getMarker = function(tweet) {
      //var marker = L.marker(tweet['latlng']);
      var marker = L.circleMarker(tweet['latlng'], {
        radius: 8,
        color: "black",
        fillColor: getLangColor(tweet['tweet_lang_code']),
        fillOpacity: 0.5
      });
      return marker;
    };

    var renderTweetToPage = function(tweet, last, map) {
      //console.log(tweet);
      var lang_code = tweet['tweet_lang_code'];
      var language = tweet['tweet_lang'];

      var marker = getMarker(tweet);
      marker.bindPopup(popupText(tweet));
      markers[tweet.id_str] = marker;


      if (! _.has(marker_layers, lang_code)) {
        marker_layers[lang_code] = new L.LayerGroup();
        map.addLayer(marker_layers[lang_code]);
        // Seems like it should be easier
        layers_control.addOverlay(marker_layers[lang_code], language);
      }

      marker.addTo(marker_layers[lang_code]);


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
    };

    var averagePoint = function(array_of_points) {

      var totals = _.reduce(array_of_points,
                            function(memo, r) { return [memo[0] + r[0], memo[1] + r[1]]; },
                            [0 , 0]);
      return [totals[0] / array_of_points.length, totals[1] / array_of_points.length];

    };


    var drawPointAndLines = function(layer_group, point, list_of_points, color) {
      var marker = L.circleMarker(point, {
        radius: 5,
        color: "black",
        fillColor: "black",
        fillOpacity: 0.1
      });

      layer_group.addLayer(marker);

      _.each(list_of_points, function(point_to) {

        var polyline = L.polyline([
                                    marker.getLatLng(), 
                                    L.latLng(point_to[0], point_to[1])
                                   ], 
                                  {
                                    color: 'black', 
                                    weight: 1, 
                                    opacity: 0.9
                                });
        layer_group.addLayer(polyline);

      });
    };

    var recalculateClusters = function() {

      cluster_layer.clearLayers();
      console.log("Recalculate");

      _.each(_.pairs(marker_layers), function(pair) {
          var key = pair[0];
          var marker_group = pair[1];
          var markers = marker_group.getLayers();

          if (markers.length > 1) {
            var points = [];
            _.each(markers, function(marker) {
              //console.log(layer);
              points.push([marker.getLatLng().lat, marker.getLatLng().lng]);
            });
            //console.log(points);

            var language_clusters = clusterfck.kmeans(points, 7);

            _.each(language_clusters, function(cluster) {

                if (cluster.length > 3) {
                  //console.log("Cluster: " + cluster);
                  var average_point = averagePoint(cluster);
                  //console.log("Average Point: " + average_point);
                  drawPointAndLines(marker_group, average_point, cluster, code_to_color[key]);
                }
            });
          }
      });
    };


    var initializeMap = function(socket) {

        refreshCounts();

        $.ajax({url: "/mapconfig"}).done(function(mapconfig) {

          var point = [mapconfig['center']['latitude'], mapconfig['center']['longitude']];

          var map = L.map('map').setView(point, mapconfig['zoom']);
          L.esri.basemapLayer("Topographic").addTo(map);

          socket.on('tweet', function(tweet) {
              renderTweetToPage(tweet, last_marker, map);
              popUpTweet(tweet, last_marker, map);
          });

          socket.on('tweetbatch', function(tweet) {
            renderTweetToPage(tweet, last_marker, map);
          });

          //layers_control.addOverlay(cluster_layer, "Cluster Data");
          layers_control.addTo(map);

        });

        $("#cluster-button").click(function() {
          recalculateClusters();
        });

        var toggled = true;
        $("#toggle-button").click(function() {
           if (toggled) {
              $("input:checkbox").removeAttr('checked');
           } else {
              $("input:checkbox").prop('checked', true);
           }
           toggled = !toggled;
           $("input:checkbox").trigger('click');

        });

        // Cambridge: 42.366791, -71.106010

        /*
        L.esri.featureLayer("http://services3.arcgis.com/fVH6HoncLPR9JkHX/arcgis/rest/services/LA_Neighborhoods/FeatureServer/0", {
           style: function (feature) {
              return { 
                fillColor: "#70ca49",
                fillOpacity: 0.5
              };
            }
        }).addTo(map);
        */

    };

    return initializeMap;

});
