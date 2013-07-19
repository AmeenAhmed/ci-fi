var express = require('express');
var jade = require('jade');
var fs = require('fs');
var _ = require('underscore');


var app = new express();

app.use(express.cookieParser()); 
app.use(express.session({cookie: { path: '/', httpOnly: true}, secret:'eeuqram'}));
app.use(express.bodyParser());

app.use(function(req, res, next) {
	res.render = function(str, obj) {
		var controller = str.split('.')[0];
		var action = str.split('.')[1];
		var filename = './views/' + controller + '/' + action + '.jade';
		var file = fs.readFileSync(filename);
		var fn = jade.compile(file, {
			filename: filename
		});
		// var h = new helpers(req, res);
		// obj = _.extend(h, obj);
		// obj = {};
		res.end(fn(obj));
	}
	next();
});



app.use(express.static(__dirname + '/public'));

app.use(app.router);

var routes = require('./config/routes.js');

var models = require('./models');

models.boot();

for(var key in routes) {
	var method = ((key.match('GET ') ||  key.match('POST ') ||
					key.match('PUT ') ||  key.match('DELETE ')) || ['all'] )[0];
	var uri;
	// console.log(method);
	
	uri = key.replace(method, '');
	// console.log(uri);

	var dest = routes[key].split('.');
	var controller = require('./controllers/' + dest[0] + '.js');

	var action = controller[dest[1]];

	app[method.trim().toLowerCase()](uri, action);
}

GLOBAL.sessions = {};

app.listen(3000);