'use strict';

/*! viewportSize | Author: Tyson Matanich, 2013 | License: MIT */
(function(n){n.viewportSize={},n.viewportSize.getHeight=function(){return t("Height")},n.viewportSize.getWidth=function(){return t("Width")};var t=function(t){var f,o=t.toLowerCase(),e=n.document,i=e.documentElement,r,u;return n["inner"+t]===undefined?f=i["client"+t]:n["inner"+t]!=i["client"+t]?(r=e.createElement("body"),r.id="vpw-test-b",r.style.cssText="overflow:scroll",u=e.createElement("div"),u.id="vpw-test-d",u.style.cssText="position:absolute;top:-1000px",u.innerHTML="<style>@media("+o+":"+i["client"+t]+"px){body#vpw-test-b div#vpw-test-d{"+o+":7px!important}}<\/style>",r.appendChild(u),i.insertBefore(r,e.head),f=u["offset"+t]==7?i["client"+t]:n["inner"+t],i.removeChild(r)):f=n["inner"+t],f}})(window);

var CylinderResizeRule = require('../classes/resizerule');

module.exports = function (cylinder, _module) {

	/**
	 * Resize module for CylinderClass.
	 * @exports resize
	 */
	var module = _.extend({}, _module);

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Cylinder.dom', true);

	/**
	 * Has the window been resized?
	 * @type {Boolean}
	 */
	module.done = false;

	/**
	 * Current window width.
	 * @type {Number}
	 */
	module.width = null;

	/**
	 * Current window height.
	 * @type {Number}
	 */
	module.height = null;

	/**
	 * Previous window width.
	 * @type {Number}
	 */
	module.previous_width = null;

	/**
	 * Previous window height.
	 * @type {Number}
	 */
	module.previous_height = null;

	// just a default rule callback
	// for the rules we define below.
	function defaultRuleCallback (width, height, rule) {
		return width >= rule.width_min && (_.isNumber(rule.width_max) ? width <= rule.width_max : true);
	}

	// just a function that serves as a shortcut to execute a rule
	// and, at the same time, apply classes to body or whatever other stuff that's needed
	function evaluateRule (width, height, rule, name) {
		var position = currentRules.indexOf(name);
		var predicate = (_.isFunction(rule.callback) ? rule.callback : defaultRuleCallback)(width, height, rule);

		// add or remove to current rules array
		if (predicate && position === -1) currentRules.push(name);
		else if (!predicate && position !== -1) currentRules.splice(position, 1);

		// Add or remove class to/from the body element.
		cylinder.dom.$body.toggleClass(name, predicate);
		return predicate;
	}

	var currentRules = [];
	var rules = {
		// THIS WILL HOLD THE DEFAULT RULES!
		// These rules are based on sizes from Bootstrap v4.0.0-alpha.2
		'bs4-xs': new CylinderResizeRule({ width_min: 0, width_max: 543 }),
		'bs4-sm': new CylinderResizeRule({ width_min: 544, width_max: 767 }),
		'bs4-md': new CylinderResizeRule({ width_min: 768, width_max: 991 }),
		'bs4-lg': new CylinderResizeRule({ width_min: 992, width_max: 1199 }),
		'bs4-xl': new CylinderResizeRule({ width_min: 1200 })
	};

	/**
	 * Returns a collection of names and their CylinderResizeRules.
	 * @return {Array.<CylinderResizeRule>} The collection of rules.
	 */
	module.rules = function () {
		return rules;
	};

	/**
	 * Adds a rule to the module.
	 *
	 * @param {String}             name - The name of the rule to add.
	 * @param {CylinderResizeRule} rule - The rule object to add.
	 */
	module.addRule = function (name, rule) {
		// if the passed rule is not an instance of CylinderResizeRule,
		// then we'll just throw an exception.
		if (!(rule instanceof CylinderResizeRule)) {
			throw new CylinderException('Trying to add something that is not a CylinderResizeRule to the resize module!');
		}

		// add the rule
		rules[name] = rule;

		if (module.width !== null && module.height !== null) {
			// if the module already triggered a resize event,
			// then, from now on, we'll always evaluate new rules as soon as they're added.
			evaluateRule(module.width, module.height, rule, name);
		}
	};

	/**
	 * Returns a specific CylinderResizeRules instance from the module.
	 *
	 * @param   {String} name - The name of the rule to return.
	 * @returns {CylinderResizeRule} Rule instance.
	 */
	module.getRule = function (name) {
		return rules[name] || null;
	};

	/**
	 * Returns a list of currently applied rules.
	 * If `true` is passed to the method, it will return an object
	 * matching the names against the rules' instances themselves.
	 *
	 * @param   {Boolean} objects - If true, the method will return the rules themselves.
	 * @returns {Array|Object} List (or dictionary) of currently applied rules.
	 */
	module.getCurrentRules = function (objects) {
		if (objects !== true) {
			return currentRules;
		}

		var ruleInstances = _.map(currentRules, function (name) { return rules[name]; });
		return _.object(currentRules, ruleInstances);
	};

	/**
	 * Removes a rule from the module.
	 *
	 * @param {String} name - The name of the rule to remove.
	 */
	module.removeRule = function (name) {
		delete rules[name];
	};

	// this is the method that will handle resizing!
	// will calc values, call styles according to rules,
	// and call events for components
	function handler (trigger) {
		module.previous_width = module.width;
		module.previous_height = module.height;

		// calc current values!
		module.width = viewportSize.getWidth();
		module.height = viewportSize.getHeight();

		// check every rule to see if we should add classes to the body.
		// we'll use the 'callback' property to evaluate that.
		_.each(rules, function (rule, name) {
			if (!(rule instanceof CylinderResizeRule)) return;
			evaluateRule(module.width, module.height, rule, name);
		});

		// call the event!
		if (trigger) module.trigger();
	};

	/**
	 * Triggers a <code>resize</code> event on the instance this module is running on,
	 * providing it the current width and height of the window.
	 *
	 * @param {Boolean} [triggerWindowResize] - If true, and if a "window" var exists, the method will trigger an event on the window instead.
	 */
	module.trigger = function (triggerWindowResize) {
		if (triggerWindowResize) {
			cylinder.dom.$window.trigger('resize');
			return;
		}

		cylinder.trigger('resize', module.width, module.height);
		module.done = true;
	};

	// final setup.
	// this will bind the handler to the event!
	cylinder.dom.$window.on('resize', function (e) { handler(true); });

	// and call the event once, without triggering the event,
	// just so we have proper values!
	handler(false);

	return module; // finish

};
