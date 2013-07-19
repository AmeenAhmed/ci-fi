exports.index = function(req, res) {
	res.render('home.index', {});
}

exports.signin = function(req, res) {

	User.find({email: req.body.email}, function(err, u) {
		console.log(u);
		if(!err) {
			if(u[0]) {
				u[0].comparePassword(req.body.password, function(err, b) {
					if(!err && b) {
						var session_key = Date.now()
						sessions[req.email] = session_key;
						res.cookie('session-key', session_key);
						res.redirect('/dashboard');
					} else {
						// TODO: Tell the user email / password wrong
						console.log('checkPassword : ', err, b);

						res.redirect('/');
					}
				});
			} else {
				// TODO: Tell the user email / password wrong
				console.log('User does not exist : ', err, u);

				res.redirect('/');
			}
		} else {
			// TODO: Tell the user about the error
			console.log('find error : ', err);

			res.redirect('/');
		}
	});
	
}