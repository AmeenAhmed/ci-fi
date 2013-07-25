function prettifyDate(str) {
	var d = (new Date(str)).getTime() / 1000;
	var today = Date.now() / 1000;
	
	var dateDiff = Math.round(today - d);

	var mins = Math.floor(dateDiff / 60);

	var hours = Math.floor(mins / 60);

	var days = Math.floor(hours / 24);

	var months = Math.floor(days / 30);

	var years = Math.floor(months / 12);

	if(years) {
		return years + ' years ago';
	} else if(months) {
		return months + ' months ago';
	} else if(days) {
		return days + ' days ago';
	} else if(hours) {
		return hours + ' hours ago';
	} else if(mins) {
		return mins + ' mins ago';
	} else {
		return dateDiff + ' secs ago';
	}
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

exports.index = function(req, res) {
	if(beforeFilter(req, res)) {
		var template = {};
		Build.find(function(err, _builds) {
			if(!err) {

				if(!_builds.length) {
					template.builds = [];
					res.render('builds.index', template);
				}
				var builds = [];
				// console.log(_builds);
				var j = 0;

				function send() {
					template.builds = builds.reverse();
					console.log(builds);
					res.render('builds.index', template);
				}
				for(var i=0; i<_builds.length; i++) {
					
					(function(i, _build) {
						// console.log(_build);
						Project.findById(_build.project_id, function(err, project) {
							var build = {};
							build.project = project.name;
							build.buildTime = prettifyDate(new Date(_build.endTime));
							build.status = _builds[i].build_status;
							builds.push(build);
							console.log(i);
							if(i === _builds.length - 1) {
								send();
							}
						});
					})(i, _builds[i]);
						
				}
				
			} else {
				res.send('../public/500.html');
			}
			
		});
	}
		
	
}