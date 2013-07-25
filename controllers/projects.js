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

exports.edit = function(req, res) {
	if(beforeFilter(req, res)) {
		var id = req.params.id;
		Project.findById(id, function(err, project) {
			if(!err) {

				var template = {
					project: project
				};

				res.render('projects.edit', template);
			} else {
				res.send('../public/500.html');
			}
		});
	}
}

exports.update = function(req, res) {
	if(beforeFilter(req, res)) {
		Project.findById(req.params.id, function(err, project) {
			if(!err && project) {
				console.log(project);
				project.create(req.body);
				
				project.save(function(err) {
					if(!err) {
						res.redirect('/dashboard');
					} else {
						res.send('../public/500.html');
					}
				});
			} else {
				res.send('../public/500.html');
			}
		});
	}
}

exports.build = function(req, res) {
	if(beforeFilter(req, res)) {
		
		Project.findById(req.params.id, function(err, project) {
			if(!err && project) {
				console.log(project);
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

		var project_id = req.body.id;

		var build = new Build();

		build.create({
			project_id: project_id,
			status: 'running',
			startTime: new Date(),
			output: ''
		});

		build.save(function(err, id) {
			require('../messenger').send('run', {
				build_id: id,
				project_id: project_id
			});

			res.json({
				'ok': true,
				build_id: id
			});
		})
			
	}
}

exports.output = function(req, res) {
	if(beforeFilter(req, res)) {
		Build.findById(req.params.id, function(err, build) {
			if(!err && build) {
				console.log(build);
				res.json({
					id: build._id,
					output: build.output,
					status: build.status,
					build_status: build.build_status
				});
			} else {
				res.send(500);
			}
		});
		
	}	
}



