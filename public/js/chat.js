
var socket = io();

socket.on('connect', function(){
		socket.emit('adduser', $('#user').data('username'));
	});

socket.on('updateChat', function(username, msg){
		$('#messageBox').append('<b>' + username + ': </b>' + msg + '<br>');
	});

socket.on('userAlert', function(msg){
	$('#messageBox').append('<b>' + msg + '</b><br>');
});

$(function () {
	
	$('form').submit(function(){
		socket.emit('sendMessage', $('#message').val());
		$('#messageBox').append('<b>You: </b>' + $('#message').val() + '<br>');
		$('#message').val('');
		return false;
	});
});