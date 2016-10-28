module.exports = {
    main: {
        options: {
            archive: 'cylinder-<%= pkg.version %>.zip'
        },
        files: [
            {expand: true, cwd: '<%= project.dist %>', src: ['**/*.*'], dest: '<%= project.root %>'}
        ]
    }
};
