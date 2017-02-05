module.exports = {

	vendor: {
		files: [

			// copy async
			{
				expand: true,
				cwd: '<%= project.bower %>/async/dist/',
				src: [ 'async.min.js', 'async.min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy underscore (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/underscore/',
				src: [ 'underscore-min.js', 'underscore-min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy underscore.string
			{
				expand: true,
				cwd: '<%= project.bower %>/underscore.string/dist/',
				src: [ 'underscore.string.min.js' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy jquery (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/jquery/dist/',
				src: [ 'jquery.min.js', 'jquery.min.map' ],
				dest: '<%= project.dist_vendor %>'
			},

			// copy backbone (and map)
			{
				expand: true,
				cwd: '<%= project.bower %>/backbone/',
				src: [ 'backbone-min.js', 'backbone-min.map' ],
				dest: '<%= project.dist_vendor %>'
			}

		]
	},

	docs_vendor: {
		files: [
			{
				expand: true,
				cwd: '<%= project.dist %>',
				src: [ 'vendor/*', 'cylinder.min.js', 'cylinder.min.js.map' ],
				dest: '<%= project.docs_vendor %>'
			}
		]
	}

};
