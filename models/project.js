var _ = require('underscore');

var SuperModel = require('../supermodel');


function project() {
	this.setUser = function(uid) {
		var uid = SuperModel.classMethods.toObjectID(uid);
		this._user_id = uid;
	}
}





var $super = _.clone(SuperModel.instanceMethods)

project.prototype = $super;

project.prototype.__modelname = 'Project';
 
project.prototype.__tablename = 'projects';

for(var item in SuperModel.classMethods) {
	project[item] = SuperModel.classMethods[item];
}

module.exports = project;