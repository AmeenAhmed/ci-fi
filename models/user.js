var bcrypt = require('bcrypt');
var _ = require('underscore');


function user() {

	this.$beforeInsert = function(cb) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(this.password, salt);
		// console.log('Before hash ' + this.password);

		this.password = hash;
		// console.log('After hash ' + this.password);

		user.find({'email': this.email}, function(err, objs) {
			// console.log(err, objs);
			if(!err && !objs.length) {
				cb(true);
			} else {
				cb(false);
			}
		});
	}


	this.comparePassword = function(password, cb) {
		bcrypt.compare(password, this.password, function(err, match) {
			if(!err) {
				cb(null, match);
			} else {
				cb(err);
			}
		});
	}
}



var SuperModel = require('../supermodel');

var $super = _.clone(SuperModel.instanceMethods)
user.prototype = $super;

user.prototype.__modelname = 'User';

user.prototype.__tablename = 'users';

for(var item in SuperModel.classMethods) {
	user[item] = SuperModel.classMethods[item];
}

module.exports = user;