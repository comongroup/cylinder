'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * DOM management module for CylinderClass.
	 * @exports dom
	 */
	var module = _.extend({}, _module);

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Cylinder.utils', true);

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {String} title - The app's default title.
	 */
	module.options = {
		title: 'Cylinder'
	};

	/**
	 * The cached jQuery element for the <code>window</code> DOM object.
	 * @type {jQueryObject}
	 */
	module.$window = cylinder.$(window);

	/**
	 * The cached jQuery element for the <code>document</code> DOM object.
	 * @type {jQueryObject}
	 */
	module.$document = cylinder.$(document);

	/**
	 * The cached jQuery element for <code>&lt;html&gt;</code>.
	 * @type {jQueryObject}
	 */
	module.$html = module.$document.find('html');

	/**
	 * The cached jQuery element for <code>&lt;head&gt;</code>.
	 * @type {jQueryObject}
	 */
	module.$head = module.$document.find('head');

	/**
	 * The cached jQuery element for <code>&lt;body&gt;</code>.
	 * @type {jQueryObject}
	 */
	module.$body = module.$document.find('body');

	/**
	 * Changes the tab's title and unescapes characters as needed.
	 * @param {String} value     - The title to apply.
	 * @param {Boolean} override - If true, the app's default title won't be suffixed.
	 */
	module.title = function (value, override) {
		var value_exists = !cylinder.s.isBlank(value);
		var value_suffix = (value_exists ? ' - ' : '') + module.options.title;
		if (override && value_exists) value_suffix = ''; // remove suffix if overriden
		if (!value_exists) value = ''; // so it doesn't show up as "undefinedWebsite"...
		document.title = cylinder.s.unescapeHTML(value + value_suffix); // change the title!
	};

	/**
	 * Changes meta tags.
	 * @param {Object} obj - A collection of meta-tag names and values.
	 */
	module.meta = function (obj) {
		if (!_.isObject(obj)) {
			if (arguments.length < 2) return;
			else {
				obj = {}; // set it as object so we can set arguments manually
				obj[arguments[0]] = arguments[1]; // { first_arg: second_arg }
			}
		}

		_.each(obj, function (v, k) {
			var $el = module.$head.find('meta[name="' + k + '"], meta[property="' + k + '"]');
			if ($el.length < 1) {
				console.warn('CYLINDER.DOM: tried to change meta "' + k + '" but it doesn\'t exist');
				return;
			}
			$el.attr('content', v);
		});
	};

	return module; // finish

};
