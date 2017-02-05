var cl = Cylinder.init(function () {

	// add $container to cylinder
	cl.$container = cl.$('.container');

	// templates config
	cl.templates.options.parse = function (t) { Mustache.parse(t.html); };
	cl.templates.options.render = function (t, o, p) { return Mustache.render(t.html, o, p); };
	cl.templates.defaults['markdown'] = function () {
		// parse markdown with renderer above
		// ATTENTION: trim the value, otherwise the first part will turn into a code block!
		return function (val, render) {
			var content = render( cl.s.trim(val) );
			return marked(content);
		};
	};

	// attempt to import all templates from DOM
	cl.templates.importFromDOM();

	// router config
	cl.router.options.push = false; // tell it we want hash navigation
	cl.router.addHandler(); // setup the default handler

	// middleware
	cl.router.use(function (next, route) {
		cl.templates.replace('[data-route-indicator]', { route: route });
		ga('send', 'pageview', cl.router.url); // analytics
		next();
	});

	// base error path
	cl.router.add('error', '*path', function (path) {
		cl.templates.apply(cl.$container, 'error', { status: 404, path: path });
	});

	cl.initControllers(function () {
		// start the process!
		// this must be done after all the routes are set up!
		cl.router.start();
	});

});
