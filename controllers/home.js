exports.index = function(req, res) {
	var session_key = req.cookies['session-key'];

	if(session_key) {
		// console.log(GLOBAL.sessions);
		// console.log('User : ', GLOBAL.sessions[session_key])
		if(GLOBAL.sessions[session_key]) {
			
			res.redirect('/dashboard');
			return;
		}
	}
	res.render('home.index', {});
}

exports.signin = function(req, res) {

	User.find({email: req.body.email}, function(err, u) {
		// console.log(u);
		if(!err) {
			if(u[0]) {
				u[0].comparePassword(req.body.password, function(err, b) {
					if(!err && b) {
						var session_key = Date.now()
						GLOBAL.sessions[session_key] = u[0]._id;
						res.cookie('session-key', session_key);
						res.redirect('/dashboard');
					} else {
						// TODO: Tell the user email / password wrong
						// console.log('checkPassword : ', err, b);

						res.redirect('/');
					}
				});
			} else {
				// TODO: Tell the user email / password wrong
				// console.log('User does not exist : ', err, u);

				res.redirect('/');
			}
		} else {
			// TODO: Tell the user about the error
			// console.log('find error : ', err);

			res.redirect('/');
		}
	});
	
}


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



exports.dashboard = function(req, res) {
	if(beforeFilter(req, res)) {

		Project.find({'_user_id': getCurrentUserID(req, res)}, function(err, projects) {
			var template = {};
			if(!err) {
				template.projects = projects;
			}
			
			
			res.render('home.dashboard', template);	
		});	
	}
	
}











