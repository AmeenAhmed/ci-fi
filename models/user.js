function user() {

}


var SuperModel = require('../supermodel');

user.prototype = new SuperModel();

for(var item in SuperModel) {
	user[item] = SuperModel[item];
}

module.exports = user;