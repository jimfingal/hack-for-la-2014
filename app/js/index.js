
var sockethelper = require('./sockethelper');
var initializeMap = require('./map');
var $ = require('jquery');

var twidgets = require('./widgets');


var socket = sockethelper.getSocket();
initializeMap(socket);

$('.expand').click(function() {
  if ($("#about").hasClass('hide')) {
    $("#about").removeClass('hide');
  } else {
    $("#about").addClass('hide');
  }
});
