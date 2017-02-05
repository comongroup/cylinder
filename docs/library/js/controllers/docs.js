Cylinder.controller('docs', function (cl, controller) {

	window.Docs = controller;

	cl.$container.on('click', '.markdown-body a', function (e) {
		var $this = cl.$(this);
		var href = {
			attr: $this.attr('href'),
			prop: $this.prop('href'),
			target: $this.prop('target')
		};
		if (cl.s.startsWith(href.attr, '#')) {
			e.preventDefault();
			e.stopPropagation();
			var name = href.attr.replace('#', '');
			var $target = cl.$container.find('[name="' + name + '"]');
			cl.scroll.go($target);
		}
	});

	controller.load = function (prefix, path) {
		$.ajax({
			url: prefix + '/' + path + '.md',
			method: 'get',
			dataType: 'html',
			success: function (result) {
				var options = { content: result };
				options['is_' + path.replace('.', '_')] = true;
				cl.templates.apply(cl.$container, 'docs', options);
			}
		});
	};

	cl.router.add('generated-files', 'ref(/*path)', function (path) {
		var prefix = 'generated';
		var file = cylinder.s(path).trim('/').replaceAll('/', '.').value();

		if (cl.s.isBlank(file)) {
			prefix = 'handmade';
			file = 'home';
		}

		controller.load(prefix, file);
	});

	cl.router.add('handmade-files', '(/*path)', function (path) {
		var prefix = 'handmade';
		var file = cylinder.s(path).trim('/').replaceAll('/', '.').value();

		if (cl.s.isBlank(file)) {
			file = 'home';
		}

		controller.load(prefix, file);
	});

});
