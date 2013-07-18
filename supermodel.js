var mongo = require('mongoskin');

var db = mongo.db('localhost:27017/ci-fi?auto_reconnect', {safe: true});

function SuperModel() {

	
	this.collection = function() {
		return db.collection(this.__tablename());
	}

	/**
	 * Creates the instance of the model given the params
	 */
	this.create = function(obj) {
		for(var item in obj) {
			this[item] = obj[item];
		}
	}

	this.save = function(cb) {
		console.log(this.__tablename());
		if(typeof this._id !== undefined) {
			this.collection().insert(this, function(err) {
				cb(err);
			});
		} else {
			this.collection().save(this, function(err) {
				cb(err);
			})
		}
	}
}

SuperModel.toObjectID = function(oid) {
	return (typeof oid === 'string') ? db.ObjectID.createFromHexString(oid) : oid;
}

SuperModel.toObjects = function(obj) {
	
	if(Object.prototype.toString.call(obj) === '[object Array]' ) {
			
		var tempArray = [];
	    for(var i=0; i<obj.length; i++) {
	    	var o = new this();
	    	o.create(obj[i]);
	    	tempArray.push(o);
	    }
	    return tempArray;
	} else {
		return new this(obj);
	}
}

SuperModel.find = function(obj, cb) {
	if(typeof obj === 'function') {
		cb = obj;
		obj = undefined;
	}

	var self = this;

	db.collection(this.__tablename()).find(obj).toArray(function(err, objs) {
		var _objs = self.toObjects(objs);
		cb(err, _objs);
	});
}

SuperModel.findById = function(id, cb) {
	var self = this;

	var _id = this.toObjectID(id);

	db.collection(this.__tablename()).findById(_id, function(err, obj) {
		_obj = this.toObjects(_obj);

		cb(err, _obj);
	});

}

module.exports = SuperModel;