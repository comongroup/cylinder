'use strict';

module.exports = function (cylinder, module) {

	/**
	 * DOM management module for CylinderClass.
	 * @exports dom
	 */
	var dom = cylinder.extend({}, module);

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {String} title - The app's default title.
	 */
	dom.options = {
		title: 'Cylinder'
	};

	/**
	 * The cached element for the <code>window</code> DOM object.
	 * @type {jQueryObject}
	 */
	dom.$window = cylinder.$(window);

	/**
	 * The cached element for the <code>document</code> DOM object.
	 * @type {jQueryObject}
	 */
	dom.$document = cylinder.$(document);

	/**
	 * The cached element for <code>&lt;html&gt;</code>.
	 * @type {jQueryObject}
	 */
	dom.$html = dom.$document.find('html');

	/**
	 * The cached element for <code>&lt;head&gt;</code>.
	 * @type {jQueryObject}
	 */
	dom.$head = dom.$document.find('head');

	/**
	 * The cached element for <code>&lt;body&gt;</code>.
	 * @type {jQueryObject}
	 */
	dom.$body = dom.$document.find('body');

	/**
	 * Changes the tab's title and unescapes characters as needed.
	 * @param {String} value     - The title to apply.
	 * @param {Boolean} override - If true, the app's default title won't be suffixed.
	 */
	dom.title = function (value, override) {
		var value_exists = !cylinder.s.isBlank(value);
		var value_suffix = (value_exists ? ' - ' : '') + dom.options.title;
		if (override && value_exists) value_suffix = ''; // remove suffix if overriden
		if (!value_exists) value = ''; // so it doesn't show up as "undefinedWebsite"...
		document.title = cylinder.s.unescapeHTML(value + value_suffix); // change the title!
	};

	/**
	 * Changes meta tags.
	 * @param {Object} obj - A collection of meta-tag names and values.
	 */
	dom.meta = function (obj) {
		if (typeof obj !== 'object') {
			if (arguments.length < 2) return;
			else {
				obj = {}; // set it as object so we can set arguments manually
				obj[arguments[0]] = arguments[1]; // { first_arg: second_arg }
			}
		}

		_.each(obj, function (v, k) {
			dom.$head
				.find('meta[name="' + k + '"], meta[property="' + k + '"]')
				.attr('content', v);
		});
	};

	return dom; // finish

};
