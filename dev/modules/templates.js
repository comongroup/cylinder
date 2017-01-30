'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Templates module for CylinderClass.
	 * @exports templates
	 */
	var module = _.extend({}, _module);

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Mustache');

	var add_counter = 0; // counts how many templates have been added
	var replace_counter = 0; // counts how many templates have been replaced by using replace()
	var cache_templates = {}; // cache for templates!
	var cache_partials = {}; // cache for partials!
	var cache_replaced = {}; // cache for replaced html from replace()!

	var load_jobs = {}; // object that will contain templates in loading!
	var load_errored = {}; // object that will contain templates that couldn't be loaded!

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean}        fire_events - Fires all events when rendering or doing other things.
	 * @property {Boolean}        detach      - If true, the <code>apply</code> and <code>replace</code> methods attempt to remove all children first.
	 *                                          Be wary that this might provoke memory leaks by not unbinding any data or events from the children.
	 * @property {String|Boolean} premades    - If not false, the module will look for a specific object variable for templates (default: JST).
	 */
	module.options = {
		fire_events: true,
		detach: false,
		premades: 'JST'
	};

	/**
	 * Default options for templates.
	 *
	 * @type {Object}
	 */
	module.defaults = {};

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
			'id': id || 'temp' + add_counter,
			'defaults': _.isObject(defaults) ? defaults : {},
			'partials': _.isObject(partials) ? partials : {},
			'html': (_.isString(template) ? template : '')
				.replace(/<javascript/gi, '<script type="text/javascript"')
				.replace(/<\/javascript>/gi, '</script>')
		};

		//TODO: add parsing before adding the template object, for example: this.parse(o);
		cache_templates[id] = o; // add to collection
		add_counter++; // add counter

		// generates partial templates
		cache_partials = _.object(_.keys(cache_templates), _.pluck(cache_templates, 'html'));

		return o;
	};

	/**
	 * Returns a template if it exists, and attempts to fetch from the local DOM if it doesn't.
	 *
	 * @param  {String} id - The template's unique identifier.
	 * @return {Object} Returns the generated internal template module's object, or an empty object if not found.
	 */
	module.get = function (id) {
		if (module.has(id)) return cache_templates[id];

		var template_name = cylinder.s.replaceAll(id, '/', '_');
		var $template = cylinder.$('#template_' + template_name);
		if ($template.length > 0) {
			// try to get default values.
			// if fail, it will return an empty object.
			var d = {};
			try {
				// why eval? because template defaults might have functions,
				// and JSON.parse wouldn't pass those to the object!
				d = eval('(' + $template.attr('data-defaults') + ')');
			}
			catch (e) {}

			var template = module.add(id, cylinder.s.trim($template.html()), d); // add it to the cache...
			$template.remove(); // remove from DOM to reduce memory footprint...
			return template; // and return the template!
		}

		return null; // template wasn't found!
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
	 * @param  {String}  id         - The unique identifier of the template to render.
	 * @param  {Object}  [options]  - The object of options for the template to use.
	 * @param  {Object}  [partials] - The object of partials the template can use.
	 * @return {String} Returns the rendered template.
	 */
	module.render = function (id, options, partials) {
		var template = module.get(id) || { error: true, html: '!! Template "' + id + '" not found !!' };
		var result = Mustache.render( //TODO: switch to generic callback method
			template.html,
			_.extend({}, module.defaults, template.defaults, options),
			_.extend({}, cache_partials, template.partials, partials)
		);

		if (module.options.fire_events && !template.error) {
			var parts = id.split('/');
			cylinder.trigger('render', id, options, partials); // trigger the generic event...
			_.reduce(parts, function (memo, part) {
				// and then trigger specific events...
				// we'll do this based on namespace, for ease of programming!
				memo = cylinder.s.trim(memo + '/' + part, '/');
				cylinder.trigger('render:' + memo, options, partials);
				return memo;
			}, '');
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
			// this will trigger events
			// so the developer can do interesting stuff!
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
		$el.html(module.render(id, options, partials)); // render the template... TODO: switch to generic callback method
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
			throw new CylinderException('Trying to replace contents on an empty or unknown jQuery element.');
		}

		var ev = function (name) {
			// this will trigger events
			// so the developer can do interesting stuff!
			cylinder.trigger(name, $el, options, partials);
		};

		// call "beforereplace" events before replacing...
		if (module.options.fire_events) ev('beforereplace');

		// this will be the HTML to render
		var template = '';

		// get the id and check against cache
		var id = $el.data('template-id');
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
		var result = Mustache.render( //TODO: switch to generic callback method
			template,
			_.extend({}, module.defaults, options),
			_.extend({}, cache_partials, partials)
		);

		$el.html(result); // apply template...
		if (module.options.fire_events) ev('replace'); // and call "replace" events, just to finish!

		return $el;
	};

	if (module.options.premades !== false) {
		// PRE-INITIALIZATION!
		// if there is a "premades" object, then do it!
		var variable = _.isString(module.options.premades) ? module.options.premades : 'JST';
		_.each(_.isObject(window[variable]) ? window[variable] : {}, function (tpl, name) {
			module.add(name, _.isFunction(tpl) ? tpl() : tpl); // add the template
		});
	}

	return module; // finish

};
