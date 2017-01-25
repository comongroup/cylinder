module.exports = {

	options: {
		sourceMap: true,
		banner:
			'/*\n' +
			' * <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %>)\n' +
			' * @author <%= pkg.author %>\n' +
			' */\n'
	},

	dist: {
		files: {
			'<%= project.dist %>/cylinder.min.js': [
				'<%= project.dist %>/cylinder.js'
			]
		}
	}

};