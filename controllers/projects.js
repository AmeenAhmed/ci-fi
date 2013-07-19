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
		
		project.save(function(err) {
			console.log('Callback called!');
			if(err) {
				console.log(err);
			} else {
				res.redirect('/dashboard');
			}
		});
	}
}