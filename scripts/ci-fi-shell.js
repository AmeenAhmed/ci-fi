var messenger = require('messenger');

var shell = require('shelljs');

var cluster = require('cluster');

var numCPUs = require('os').cpus().length;

var mongo = require('mongoskin');

var db = mongo.db('localhost:27017/ci-fi?auto_reconnect', {safe: true});

var queue = [];

if(cluster.isMaster) {

	for(var i=0; i<numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});

	// var server = messenger.createListener(8000);

	// server.on('run', function(obj) {
	// 	console.log('Got a message to run ', obj);
	// });

	// setInterval(function() {
	// 	queue.push(100);
	// }, 3000);
	var workers = [];
	var currentWorker = 0;

	for(var id in cluster.workers) {
		workers.push(id);
	}

	var server = messenger.createListener(8000);

	server.on('run', function(m, obj) {
		console.log('Got a message to run ', obj, ' in server');
		var worker = workers[currentWorker];

		cluster.workers[worker].send('run ' + obj.build_id);

		currentWorker ++;

		if(currentWorker === workers.length) {
			currentWorker = 0;
		}
	});

	server.on('create', function(m, obj) {
		console.log('Got a message to create ', obj, ' in server');
		var worker = workers[currentWorker];

		cluster.workers[worker].send('create ' + obj.id);

		currentWorker ++;

		if(currentWorker === workers.length) {
			currentWorker = 0;
		}
	});
	

} else if(cluster.isWorker) {
	console.log('Worker started with pid ' + cluster.worker.process.pid);

	
	var pid = cluster.worker.process.pid;

	process.on('message', function(msg) {
		console.log('Receieved msg ', msg, ' in process ' + pid);
		if(msg.match(/create [a-z0-9]+/g)) {
			console.log('creating');
			var id = db.ObjectID.createFromHexString(msg.replace(/create /g, ''));

			db.collection('projects').findById(id, function(err, project) {
				var repo = project.repo;
				var name = project.name;
				var clone = shell.exec('git clone ' + repo + ' repos/' + name, {async: true});
				clone.stdout.on('data', function(data) {
					console.log('stdout: ' + data);
				});
				clone.stderr.on('data', function(data) {
					console.log('stderr: ' + data);
				});
			});
		} else if(msg.match(/run [a-z0-9]+/g)) {
			console.log('build');
			var id = db.ObjectID.createFromHexString(msg.replace(/run /g, ''));
			db.collection('builds').findById(id, function(err, build) {
				console.log(build);
				var project_id = build.project_id;
				db.collection('projects').findById(project_id, function(err, project) {
					console.log(project);
					shell.cd('repos/' + project.name);
					var commands = project.scripts.split('\r\n');
					var statusCode = 0;
					var l = commands.length;
					var cs = [];
					for(var i=0; i<commands.length; i++) {
						cs[i] = shell.exec(commands[i]);
						var output = cs[i].output.toString('ascii');
						build.output += '<br/>' + output.replace(/\n/g, '<br/>');
						db.collection('builds').save(build, function(err) {
							if(err) {
								console.log('Status save error');	
							}
						});
						console.log(output);

						if(cs[i].code !== 0) {
							statusCode = cs[i].code; 
						}
					}
					build.status = 'complete';
					build.endTime = new Date();
					if(statusCode === 0) {
						build.build_status = 'passing';
					} else {
						build.build_status = 'failed';
					}

					project.status = build.build_status;

					db.collection('projects').save(project, function(err) {
						if(err) {
							console.log('Project save error');
						}
					});

					db.collection('builds').save(build, function(err) {
						if(err) {
							console.log('Build Save error');
						}
					});
				});
			});
		}
	});

}