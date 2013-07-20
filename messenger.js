var messenger = require('messenger');

var client = messenger.createSpeaker(8000);


exports.send = function(msg, obj) {
	client.send(msg, obj);
}