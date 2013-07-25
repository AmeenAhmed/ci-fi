module.exports = {
	'GET /': 'home.index',
	'POST /signin': 'home.signin',
	'GET /dashboard': 'home.dashboard',
	'GET /projects/new': 'projects.new',
	'POST /projects': 'projects.create',
	'POST /projects/:id': 'projects.update',
	'GET /build/:id': 'projects.build',
	'GET /edit/:id': 'projects.edit',
	'POST /run': 'projects.run',
	'GET /output/:id': 'projects.output',
	'GET /builds': 'builds.index'
}