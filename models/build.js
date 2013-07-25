var _ = require('underscore');

function build() {

}

var SuperModel = require('../supermodel');

var $super = _.clone(SuperModel.instanceMethods)
build.prototype = $super;

build.prototype.__modelname = 'Build';

build.prototype.__tablename = 'builds';

for(var item in SuperModel.classMethods) {
	build[item] = SuperModel.classMethods[item];
}

module.exports = build;