module.exports = {
	'GET /': 'home.index',
	'POST /signin': 'home.signin',
	'GET /dashboard': 'home.dashboard',
	'GET /projects/new': 'projects.new',
	'POST /projects': 'projects.create',
	'GET /build/:id': 'projects.build',
	'POST /run': 'projects.run',
	'GET /output/:id': 'projects.output'
}