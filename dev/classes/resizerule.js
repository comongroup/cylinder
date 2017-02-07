'use strict';

/**
 * Creates a new rule to be used with the Cylinder/Resize module.
 *
 * @class
 * @param {Object}   options            - The options for this rule.
 * @param {Number}   options.width_min  - The mininum width.
 * @param {Number}   options.width_max  - The maximum width.
 * @param {Number}   options.height_min - The mininum height.
 * @param {Number}   options.height_max - The maximum height.
 * @param {Function} [options.callback<Number,Number,CylinderResizeRule>] - A callback function defining the rule given a width and height. Must return a boolean.
 *                                                                          If not defined, the default callback (evaluating width only) is used.
 *
 * @example
 * // creates a new rule
 * var rule = new CylinderResizeRule({
 *     width_min: 0,
 *     width_max: 767,
 *     callback: function (width, height, rule) {
 *         return width >= rule.width_min && width <= rule.width_max;
 *     }
 * });
 *
 * // adds the rule into the module
 * Cylinder.resize.addRule('layout-xs', rule);
 *
 * // on a resize, if the callback returns true,
 * // the name of the rule will be added as a class to the <body> element
 * // example: <body class="layout-xs">
 */
function CylinderResizeRule (options) {
	_.extend(this, {
		width_min: null,
		width_max: null,
		height_min: null,
		height_max: null,
		callback: null
	}, options);

	/**
	 * Turns the rule into a string.
	 * @return {String}
	 */
	this.toString = function () {
		return JSON.stringify(this);
	}

	return this;
};

module.exports = CylinderResizeRule;
