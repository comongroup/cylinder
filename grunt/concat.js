module.exports = {

	options: {
		nonull: true,
		sourceMap: true,
		separator: ';'
	},

	pkgd: {
		files: {
			'<%= project.dist %>/cylinder.pkgd.js': [
				'<%= project.bower %>/jquery/dist/jquery.min.js',
				'<%= project.bower %>/underscore/underscore-min.js',
				'<%= project.bower %>/underscore.string/dist/underscore.string.min.js',
				'<%= project.bower %>/backbone/backbone-min.js',
				'<%= project.dist %>/cylinder.min.js'
			]
		}
	}

};
