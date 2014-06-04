
var sockethelper = require('./sockethelper');
var initializeMap = require('./map');
var $ = require('jquery');

console.log($);

var socket = sockethelper.getSocket();
initializeMap(socket);

$('.expand').click(function() {
  console.log('clicked');
  if ($("#about").hasClass('hide')) {
    $("#about").removeClass('hide');
  } else {
    $("#about").addClass('hide');
  }
});
