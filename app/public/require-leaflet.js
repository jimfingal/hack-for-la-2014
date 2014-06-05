require.config({
    'baseUrl': '.',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'socket.io' : 'bower_components/socket.io-client/socket.io',
      'twidgets' : 'lib/widgets',
      'leaflet': "http://cdn.leafletjs.com/leaflet-0.7.3/leaflet",
      'esri-leaflet': "lib/esri-leaflet",
      'clusterfck': "lib/clusterfck",
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
        'clusterfck': {
            exports: 'clusterfck'
        },
        'esri-leaflet': {
          deps: ['leaflet']
        }
    },
    'waitSeconds' : 0
});


require(['lib/sockethelper', 'lib/map', 'jquery'],
  function(sockethelper, initializeMap, $) {

    var socket = sockethelper.getSocket();
    initializeMap(socket);

    $('.expand').click(function() {
      if ($("#about").hasClass('hide')) {
        $("#about").removeClass('hide');
      } else {
        $("#about").addClass('hide');
      }
    });

});

