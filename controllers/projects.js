function beforeFilter(req, res) {
	var session_key = req.cookies['session-key'];
	if(session_key) {
		if(!GLOBAL.sessions[session_key]) {
			res.redirect('/');
			return false;
		}
	} else {
		res.redirect('/');
		return false;
	}
	return true;
}

function getCurrentUserID(req, res) {
	var session_key = req.cookies['session-key'];
	// console.log(sessions);
	return GLOBAL.sessions[session_key];	
}

exports.new = function(req, res) {
	if(beforeFilter(req, res)) {
		res.render('projects.new');	
	}
}

exports.create = function(req, res) {
	if(beforeFilter(req, res)) {
		

		var project = new Project();

		project.create(req.body);
		project.setUser(getCurrentUserID(req, res));
		
		project.save(function(err, _id) {
			if(err) {
				console.log(err);
			} else {
				console.log(_id);
				require('../messenger').send('create', {id: _id});
				res.redirect('/dashboard');
			}
		});
	}
}

exports.build = function(req, res) {
	if(beforeFilter(req, res)) {
		
		Project.findById(req.params.id, function(err, project) {
			if(!err && project) {
				var template = {project: project};
				res.render('projects.build', template);	
			} else {
				res.send('../public/500.html');
			}
		});
	}	
}

exports.run = function(req, res) {
	if(beforeFilter(req, res)) {
		console.log('body ', req.body)
		require('../messenger').send('run', {id: req.body.id});
		res.json({
			'ok': true
		});
	}
}

exports.output = function(req, res) {
	if(beforeFilter(req, res)) {
		Project.findById(req.params.id, function(err, project) {
			if(!err && project) {
				res.json({
					output: project.output
				});
			} else {
				res.send(500);
			}
		});
		
	}	
}



