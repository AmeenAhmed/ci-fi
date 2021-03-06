var mongo = require('mongoskin');
var inflection = require('inflection');
var fs = require('fs');

var db = mongo.db('localhost:27017/ci-fi?auto_reconnect', {safe: true});

exports.boot = function() {
	var modelPath = __dirname + '/models';
	var list = fs.readdirSync(modelPath);

	var models = [];

	for(var i=0; i<list.length; i++) {
		var filename = list[i];
		if(filename.indexOf('.js') === -1) {
			continue;
		}
		var modelname = filename.replace('.js', '');
		models[i] = require(modelPath + '/' + filename);
		
		models[i].__tablename = inflection.pluralize(modelname);

		var model = models[i];
		global[inflection.camelize(modelname)] = model;

		// console.log(global[inflection.camelize(modelname)])
		// var m = new model();
		// m.create({
		// 	'email': 'admin@default.com',
		// 	'password': 'test123'
		// });
		// // console.log(m);
		// m.save(function(err) {
		// 	// console.log(err);
		// });

		// model.find(function(err, objs) {
		// 	console.log(err);
		// 	console.log(objs);

		// 	objs[0].check();
		// });
	}
}
