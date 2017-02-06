module.exports = {

	docs: {
		files: [
			{ src: '<%= project.dev_classes %>/class.js', dest: '<%= project.docs_generated %>/classes.class.md' },
			{ src: '<%= project.dev_classes %>/exception.js', dest: '<%= project.docs_generated %>/classes.exception.md' },
			{ src: '<%= project.dev_classes %>/resizerule.js', dest: '<%= project.docs_generated %>/classes.resizerule.md' },
			{ src: '<%= project.dev_extensions %>/controllers.js', dest: '<%= project.docs_generated %>/extension.controllers.md' },
			{ src: '<%= project.dev_modules %>/dom.js', dest: '<%= project.docs_generated %>/module.dom.md' },
			{ src: '<%= project.dev_modules %>/resize.js', dest: '<%= project.docs_generated %>/module.resize.md' },
			{ src: '<%= project.dev_modules %>/router.js', dest: '<%= project.docs_generated %>/module.router.md' },
			{ src: '<%= project.dev_modules %>/scroll.js', dest: '<%= project.docs_generated %>/module.scroll.md' },
			{ src: '<%= project.dev_modules %>/store.js', dest: '<%= project.docs_generated %>/module.store.md' },
			{ src: '<%= project.dev_modules %>/templates.js', dest: '<%= project.docs_generated %>/module.templates.md' },
			{ src: '<%= project.dev_modules %>/utils.js', dest: '<%= project.docs_generated %>/module.utils.md' }
		],
		options: {
			'no-gfm': true,
			'separators': true
		}
	}

};
