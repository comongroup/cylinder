'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Templates module for CylinderClass.
	 * @exports templates
	 */
	var module = _.extend({}, _module);

	var add_counter = 0; // counts how many templates have been added
	var replace_counter = 0; // counts how many templates have been replaced by using replace()
	var cache_templates = {}; // cache for templates!
	var cache_partials = {}; // cache for partials!
	var cache_replaced = {}; // cache for replaced html from replace()!

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean}        fire_events  - Fires all events when rendering or doing other things.
	 * @property {Boolean}        detach       - If true, the <code>apply</code> and <code>replace</code> methods attempt to remove all children first.
	 *                                           Be wary that this might provoke memory leaks by not unbinding any data or events from the children.
	 * @property {String}         dom_prefix   - Selector prefix for DOM element IDs when importing templates from DOM.
	 * @property {String}         dom_selector - Default selector for DOM elements when importing templates from DOM.
	 * @property {Function}       parse        - Callback for parsing templates. Receives a template object, which always has an `html` string parameter.
	 *                                           This method is called right before an added template is rendered, and is meant for applying optimizations.
	 * @property {Function}       render       - Callback for rendering a template. Receives a template object, which always has an `html` string parameter.
	 */
	module.options = {
		fire_events: true,
		detach: false,
		dom_prefix: '#template_',
		dom_selector: 'script[type="text/template"]',
		parse: function (t) {},
		render: function (t) { return (t || { html: '' }).html; }
	};

	/**
	 * Default properties for templates.
	 *
	 * @type {Object}
	 */
	module.defaults = {};

	/**
	 * Adds a template to the local cache.
	 *
	 * @param  {String} id         - The template's unique identifier.
	 * @param  {String} template   - The template's HTML structure.
	 * @param  {Object} [defaults] - Default values for this template.
	 * @param  {Object} [partials] - Included partial templates.
	 * @return {Object} Returns the generated internal template module's object.
	 */
	module.add = function (id, template, defaults, partials) {
		var o = {
			id: id || 'temp' + add_counter,
			defaults: _.isObject(defaults) ? defaults : {},
			partials: _.isObject(partials) ? partials : {},
			parsed: false,
			html: (_.isString(template) ? template : '')
				.replace(/<javascript/gi, '<script type="text/javascript"')
				.replace(/<\/javascript>/gi, '</script>')
		};

		cache_templates[id] = o; // add to collection
		cache_partials = _.object(_.keys(cache_templates), _.pluck(cache_templates, 'html')); // generate partial templates
		add_counter++; // add counter

		return o;
	};

	/**
	 * Attempts to import templates from a parent variable.
	 *
	 * @param  {Object}   parent      - The object to fetch the templates from.
	 * @param  {Function} [iterator] - If a function is passed, the method will use it to iterate the object.
	 * @return {Object} Returns the object with the same keys but with each value replaced by the actual template object added into the module.
	 */
	module.importFromObject = function (parent, iterator) {
		if (typeof iterator !== 'function') {
			iterator = function (template, index) {
				var result = typeof template === 'function' ? template() : template;
				return module.add(index, template); // add the template
			};
		}

		return _.map(parent || {}, iterator);
	};

	/**
	 * Attempts to import templates from `<script type="text/template">` objects.
	 *
	 * By default, every slash will be converted with an underscore when looking for a specific template by ID.
	 * If no ID is provided, the module will attempt to look through every element that matches the selector in options.dom_selector,
	 * and attempts to fetch a template ID and default options through `data-id` and `data-defaults` attributes respectively.
	 *
	 * @param  {String}   [id] - The ID of the template you wish to fetch from the DOM.
	 * @return {Object[]} Returns an array of generated template objects.
	 */
	module.importFromDOM = function (id) {
		var selector = typeof id === 'string' && id.length > 0
			? module.options.dom_prefix + id.replace(/[\/\\]/g, '_') // replaces all slashes
			: '';

		return cylinder.$(module.options.dom_selector + selector).map(function () {
			// try to get default values.
			// if fail, it will return an empty object.
			var $el = cylinder.$(this);
			var name = $el.prop('id').replace(module.options.dom_prefix.replace(/[#.]/g, ''), '');
			var html = cylinder.s.trim($el.html());
			var defaults = {};

			try {
				// why eval? because template defaults might have functions,
				// and JSON.parse wouldn't pass those to the object!
				defaults = eval('(' + $el.attr('data-defaults') + ')');
			}
			catch (e) {}

			$el.remove(); // remove from DOM to reduce memory footprint...
			if (selector && name.length === 0) name = id; // if no name, then use the ID...
			return module.add(name, html, defaults); // and return the template!
		});
	};

	/**
	 * Checks if a template is in the local cache.
	 *
	 * @param  {String}  id - The template's unique identifier.
	 * @return {Boolean}
	 */
	module.has = function (id) {
		return cache_templates[id] != null;
	};

	/**
	 * Returns a template if it exists, otherwise it'll return `null`.
	 *
	 * @param  {String}      id - The template's unique identifier.
	 * @return {Object|Null} Returns the template object, or null if not found.
	 */
	module.get = function (id) {
		return cache_templates[id] || null;
	};

	// helper function to simply return a jQuery object
	function getElementFromVariable ($el) {
		if ($el instanceof cylinder.$) {
			return $el;
		}

		// it's not a jQuery object
		// so attempt to convert it to one
		return (_.isString($el) && !cylinder.s.isBlank($el)) || ($el != null && ($el.tagName || $el.nodeName))
			? cylinder.$($el)
			: null;
	}

	// helper function to detach elements from an element
	function detachAllChildrenFromElement ($el) {
		if (module.options.detach) {
			// attempt to detach all children,
			// so that events are not lost
			$el.children().detach();
		}
		else {
			// just empty the object
			$el.empty();
		}
	}

	/**
	 * Renders a template with the given ID.
	 *
	 * @param  {String}      id         - The unique identifier of the template to render.
	 * @param  {Object}      [options]  - The object of options for the template to use.
	 * @param  {Object}      [partials] - The object of partials the template can use.
	 * @param  {Boolean}     [trigger]  - If false, the method won't fire any events.
	 * @return {String|Null} Returns the rendered template.
	 */
	module.render = function (id, options, partials, trigger) {
		var result = null;
		var template = module.get(id) || {
			error: true,
			parsed: true,
			html: '!! Template "' + id + '" not found !!'
		};

		// before actually rendering the result,
		// we'll attempt to run a parse process on the template
		if (!template.parsed && typeof module.options.parse === 'function') {
			module.options.parse(template);
			template.parsed = true;
		}

		// and now we'll actually attempt to render the template,
		// using the specified options and partials, along with defaults
		if (!template.error && typeof module.options.render === 'function') {
			result = module.options.render(
				template,
				_.extend({}, module.defaults, template.defaults, options),
				_.extend({}, cache_partials, template.partials, partials)
			);
		}

		// and in the end, fire events if trigger !== false
		// and the global option is enabled and no error occurred
		if (module.options.fire_events && trigger !== false && result !== null) {
			var parts = id.split('/');
			_.reduce(parts, function (memo, part) {
				// trigger specific events...
				// we'll do this based on namespace, for ease of programming!
				memo = cylinder.s.trim(memo + '/' + part, '/');
				cylinder.trigger('render:' + memo, options, partials);
				return memo;
			}, '');
			cylinder.trigger('render', id, options, partials); // and then trigger the generic event!
		}

		return result;
	};

	/**
	 * Renders a template and applies it to a jQuery element.<br /><br />
	 * If the element is not a jQuery element, it will throw an exception.
	 *
	 * @param  {jQueryObject} $el        - The element to which the template should be rendered and applied to.
	 * @param  {String}       id         - The unique identifier of the template to render.
	 * @param  {Object}       [options]  - The object of options for the template to use.
	 * @param  {Object}       [partials] - The object of partials the template can use.
	 * @return {jQueryObject} Returns the provided jQuery object.
	 */
	module.apply = function ($el, id, options, partials) {
		// many times we'd apply stuff to an element that would not yet exist.
		// this time, we'll warn the developer that such element should not be null!
		$el = getElementFromVariable($el);
		if ($el === null || $el.length == 0) {
			throw new CylinderException('Trying to apply a template to an empty or unknown element.');
		}

		var ev = function (name) {
			var str = cylinder.s.trim(id, '/');
			var parts = str.split('/');
			_.reduceRight(parts, function (memo, part) {
				// trigger specific events...
				// we'll do this based on namespace, for ease of programming!
				cylinder.trigger(name + ':' + memo, $el, id, options, partials);
				memo = cylinder.s(memo).replace(part, '').trim('/').value();
				return memo;
			}, str);
			cylinder.trigger(name, $el, id, options, partials); // and then trigger the generic event!
		};

		if (module.options.fire_events) ev('beforeapply'); // before applying, call "beforeapply" events...
		detachAllChildrenFromElement($el); // detach every children first so they don't lose any data or events...
		$el.html(module.render(id, options, partials, false)); // render the template...
		if (module.options.fire_events) ev('apply'); // and call "apply" events, just to finish!

		return $el;
	};

	/**
	 * Replaces the entire HTML of an element with a rendered version of it.<br /><br />
	 * This method will store the original HTML of the selected element in cache.
	 * If replace is called again on the same element, it will reuse that HTML instead of rendering on top of that rendered result.<br />
	 * If the element is not a jQuery element, it will throw an exception.
	 *
	 * @param  {jQueryObject} $el        - The element to replace the HTML on.
	 * @param  {Object}       [options]  - The object of options for the template to use.
	 * @param  {Object}       [partials] - The object of partials the template can use.
	 * @return {jQueryObject} Returns the provided jQuery object.
	 */
	module.replace = function ($el, options, partials) {
		// many times we'd apply stuff to an element that would not yet exist.
		// this time, we'll warn the developer that such element should not be null!
		$el = getElementFromVariable($el);
		if ($el === null || $el.length == 0) {
			throw new CylinderException('Trying to replace contents of an empty or unknown jQuery element.');
		}

		var ev = function (name) {
			// this will trigger events
			// so the developer can do interesting stuff!
			cylinder.trigger(name, $el, options, partials);
		};

		// call "beforereplace" events before replacing...
		if (module.options.fire_events) ev('beforereplace');

		// these will hold the final html to apply and the ID
		var template = '';
		var result = null;
		var id = $el.data('template-id');

		// check against cache
		if (!cl.s.isBlank(id) && _.has(cache_replaced, id)) {
			template = cache_replaced[id]; // get the HTML from cache
		}
		else {
			id = '' + (new Date()).getTime() + replace_counter; // generate new ID
			$el.data('template-id', id); // associate the new ID to the element in question
			template = cylinder.s.unescapeHTML( $el.html() ); // get the full HTML from the element
			cache_replaced[id] = template; // store template in cache
			replace_counter++; // up the counter by 1
		}

		// detach every children first so we don't lose any events...
		detachAllChildrenFromElement($el);

		// render the HTML
		if (typeof module.options.render === 'function') {
			result = module.options.render(
				{ id: id, parsed: true, html: template },
				_.extend({}, module.defaults, options),
				_.extend({}, cache_partials, partials)
			);
		}

		$el.html(result); // apply template...
		if (module.options.fire_events) ev('replace'); // and call "replace" events, just to finish!

		return $el;
	};

	return module; // finish

};
