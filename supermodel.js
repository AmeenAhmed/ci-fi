var mongo = require('mongoskin');

var db = mongo.db('localhost:27017/ci-fi?auto_reconnect', {safe: true});

var SuperModel = {
	instanceMethods: {},
	classMethods: {}
}

var onlyProps = function(obj) {
	var props = JSON.parse(JSON.stringify(obj));
	for(var item in props) {
		if(item.indexOf('_') === 0) {
			props[item] = SuperModel.classMethods.toObjectID(props[item]);
		}
	}
	return props;
}

SuperModel.instanceMethods.collection = function() {
	return db.collection(this.__tablename);
}

/**
 * Creates the instance of the model given the params
 */
SuperModel.instanceMethods.create = function(obj) {
	for(var item in obj) {
		this[item] = obj[item];
	}
}

SuperModel.instanceMethods.errors = [];



SuperModel.instanceMethods.save = function(cb) {
	// console.log(this.__tablename());
	if(typeof this._id !== undefined) {
		var self = this;

		var exec = function() {
			self.collection().insert(onlyProps(self), function(err) {
				cb(err);
			});
		}
		if(this.$beforeInsert) {
			this.$beforeInsert(function(b) {
				if(b) {
					exec();
				}
			});
		} else {
			exec();
		}
	} else {
		this.collection().save(onlyProps(this), function(err) {
			cb(err);
		})
	}
}




SuperModel.classMethods.validations = {
	'unique?': function(attr, obj, cb) {
		var o = {};
		o[attr] = obj[attr];
		this.find(o, function(err, objs) {
			if(!err && !objs) {
				cb(true);
			} else {
				cb(false);
			}
		});
	}
}

SuperModel.classMethods.toObjectID = function(oid) {
	return (typeof oid === 'string') ? db.ObjectID.createFromHexString(oid) : oid;
}

SuperModel.classMethods.toObjects = function(obj) {
	
	if(Object.prototype.toString.call(obj) === '[object Array]' ) {
			
		var tempArray = [];
	    for(var i=0; i<obj.length; i++) {
	    	var o = new this();
	    	// console.log(o);
	    	o.create(obj[i]);
	    	tempArray.push(o);
	    }
	    return tempArray;
	} else {
		return new this(obj);
	}
}

SuperModel.classMethods.find = function(obj, cb) {
	if(typeof obj === 'function') {
		cb = obj;
		obj = undefined;
	}

	var self = this;

	db.collection(this.__tablename).find(obj).toArray(function(err, objs) {
		var _objs = self.toObjects(objs);
		cb(err, _objs);
	});
}

SuperModel.classMethods.findById = function(id, cb) {
	var self = this;

	var _id = this.toObjectID(id);

	db.collection(this.__tablename).findById(_id, function(err, obj) {
		_obj = this.toObjects(_obj);

		cb(err, _obj);
	});

}

module.exports = SuperModel;