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


require(['lib/sockethelper', 'lib/map'],
  function(sockethelper, initializeMap) {

    var socket = sockethelper.getSocket();
    initializeMap(socket);
          
});

