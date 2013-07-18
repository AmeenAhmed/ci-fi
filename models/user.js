var bcrypt = require('bcrypt');


function user() {

	this.$beforeInsert = function() {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(this.password, salt);
		console.log('Before hash ' + this.password);

		this.password = hash;
		console.log('After hash ' + this.password);
	}
}


var SuperModel = require('../supermodel');

user.prototype = new SuperModel();

for(var item in SuperModel) {
	user[item] = SuperModel[item];
}

module.exports = user;