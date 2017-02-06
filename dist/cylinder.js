/*
 * cylinder v0.14.1 (2017-02-06 13:35:17)
 * @author Luís Soares <luis.soares@comon.pt>
 */


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Main framework class.
 * Extends upon [Backbone.Events](http://backbonejs.org/#Events).
 *
 * @class
 */
function CylinderClass () {

	var root = window; // root object on which cylinder should work
	var instance = this; // get a reference to this instance!
	var initialized = false;

	/**
	 * Framework version.
	 * @return {String}
	 */
	this.version = '0.14.1';

	/**
	 * Checks if the framework has been initialized.
	 * @return {Boolean}
	 */
	this.initialized = function () { return initialized; };

	/**
	 * Validate if a variable or a dependency exists.
	 * The framework will check if it exists in the global scope.
	 *
	 * @param  {...(String|Object)} dependencies - The names of the dependencies to be checked.
	 * @param  {Boolean}            [loud]       - If `true`, the method will throw an exception when a specified dependency is not found.
	 * @return {Boolean} Returns true or false depending whether the dependency exists. If `loud` is `true`, it throws an exception if the dependency doesn't exist.
	 *
	 * @example
	 * // you can check if a dependency exists or not,
	 * // so you can gracefully handle missing dependencies
	 *
	 * if (Cylinder.dependency('$.fn.velocity')) {
	 *     // velocity is present
	 *     $('#element').velocity({ top: 0 });
	 * }
	 * else {
	 *     // velocity.js is not defined
	 *     // so you can use a fallback
	 *     $('#element').animate({ top: 0 });
	 * }
	 *
	 * @example
	 * // you can check for dependencies inside a variable,
	 * // and the whole family tree will be checked from top-level
	 *
	 * var everyDependency = Cylinder.dependency('$.fn.slick', 'Cylinder.router', 'Cylinder.resize');
	 *
	 * @example
	 * // you can also throw an exception if you pass `true` at the end.
	 * // you can also specify objects if you want a cleaner exception output.
	 *
	 * Cylinder.dependency(
	 *     'jQuery',
	 *     { package: '_', name: 'underscore.js' },
	 *     { package: 's', name: 'underscore.string', scope: window, optional: true },
	 *     'Backbone',
	 *     'asdf', // imagine this variable doesn't exist
	 *     true
	 * );
	 */
	this.dependency = function () {
		var args = Array.prototype.slice.call(arguments); // make a copy of all received arguments!
		var loud = false; // this will make sure it will either throw an exception or just output a boolean.
		if (args.length > 0 && typeof args[args.length - 1] === 'boolean') {
			loud = args[args.length - 1]; // the last argument IS a boolean, so store its value.
			args.pop(); // in order to not have trash in our checks, remove the last argument!
		}

		for (var i = 0; i < args.length; i++) {
			var dependency = args[i];
			var dependency_object = typeof dependency == 'object';
			var dependency_mandatory = !dependency_object || dependency.optional != true;

			var scope = dependency_object ? (dependency.scope || root) : root;
			var name = dependency_object ? dependency.name : dependency; // get the dependency name to output later
			var tree = ('' + (dependency_object ? dependency.package : dependency)).split('.'); // split by dot

			// don't forget that any argument can be recursive,
			// for example, "$.fn.velocity", so we have to drill down!
			for (var j = 0; j < tree.length; j++) { // drill
				var dependency = tree[j];
				var exists = Object.prototype.hasOwnProperty.call(scope, dependency);
				if (!exists) {
					if (loud && dependency_mandatory) throw new CylinderException('Missing dependency "' + name + '"!');
					return false; // and just return false for reasons!
				}
				scope = scope[dependency]; // the scope exists, go to next dependency
			}

			// if we reach here, the dependency exists!
			// go to the next one
		}

		return true;
	};

	// CHECK MAIN DEPENDENCIES NOW!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	this.dependency(
		'jQuery',
		{ package: '_', name: 'underscore.js' },
		{ package: 's', name: 'underscore.string' },
		'Backbone',
		true // crash the framework due to missing dependencies
	);

	var extensions = []; // initializable extensions!
	var modules = {}; // modules!

	/**
	 * The jQuery instance.
	 * @type {jQuery}
	 */
	this.$ = jQuery;

	/**
	 * The underscore.js instance.
	 * @type {Underscore}
	 */
	this._ = _;

	/**
	 * The underscore.string instance.
	 * @type {UnderscoreString}
	 */
	this.s = s;

	// We'll mix in the underscore and underscore.string modules,
	// so that we don't have to mess with external files.
	// We'll also add event handling to Cylinder.
	_.extend(this._, { str: this.s }); // add underscore.string to underscore
	_.extend(this, Backbone.Events); // add events

	/**
	 * Extends the framework's core.<br />
	 * If <code>extendOnInit</code> is true, then the framework won't be extended until properly initialized.
	 *
	 * @param  {Function|Object} func           - The extension's constructor.
	 * @param  {Boolean}         [extendOnInit] - If true, the framework will only add 'func' after 'init' is called.
	 * @return {Mixed} Returns the result of 'func' after evaluated.
	 *
	 * @example
	 * Cylinder.extend(function (cl) {
	 *     var extension = {};
	 *     extension.abc = 123;
	 *     extension.dfg = 456;
	 *     return extension;
	 * });
	 *
	 * console.log(Cylinder.abc); // 123
	 * console.log(Cylinder.dfg); // 456
	 */
	this.extend = function (func, extendOnInit) {
		if (!initialized && extendOnInit) {
			if (!_.contains(extensions, func)) extensions.push(func); // add extension to cache
			return instance; // return the framework instance!
		}

		if (typeof func == 'function') func = func(instance); // run the function first...
		if (arguments.length < 3) instance.trigger('extend', func); // trigger an event for when extended...
		_.extend(instance, func); // add it to the framework...
		return func; // and return the object itself!
	};

	/**
	 * Extends the framework with a specific named module.<br />
	 * The module won't be added until the framework is properly initialized.
	 * When, or if, <code>initialize()</code> is called, then the module will be added as well.
	 *
	 * @param  {String}   name - The module's name.
	 * @param  {Function} func - The module's constructor.
	 * @return {Mixed} Returns the result of 'func' after evaluated.
	 *
	 * @example
	 * Cylinder.module('mymodule', function (cl, module) {
	 *     module.alert = function (str) {
	 *         alert('abc');
	 *     };
	 *     return module;
	 * });
	 *
	 * Cylinder.mymodule.alert('hello!');
	 */
	this.module = function (name, ctor) {
		// check if we have a name and if it is a string!
		// if the name is blank, then forget about it and throw error!
		if (!_.isString(name) || (/^\s*$/).test(name)) throw new CylinderException('Trying to add a nameless module!');

		// check if ctor is null, cause it's probably just trying to return the module!
		// if so, check if the module exists, and return it!
		if (_.isUndefined(ctor) || _.isNull(ctor)) {
			if (initialized && _.has(modules, name)) return instance[name];
			return null;
		}

		modules[name] = ctor; // add module to cache
		if (!initialized) return instance; // return the framework instance!

		var module = { name: name }; // the module object itself, might have methods and properties.
		var result = typeof ctor == 'function' // initialize module... (check if function or object)
			? ctor(instance, module) // run constructor
			: ctor; // it's an object, so just extend it
		if (!result) result = module; // if it's falsy, then use the variable passed to the constructor

		var obj = {}; // the final object to extend with the framework.
		obj[name] = result; // apply to the instance...
		instance.extend(obj, true, false); // add it to the framework...
		instance.trigger('module', name, result); // trigger a global event for when extended...
		instance.trigger('module:' + name, result); // trigger a specific event for when extended...
		return result; // and return the module itself!
	};

	/**
	 * Returns a list of existing modules.
	 * @return {Object}
	 */
	this.modules = function () {
		return _.mapObject(modules, function (func, name) {
			return instance[name];
		});
	};

	/**
	 * Properly initializes the framework and all of the modules and extensions added to it.<br />
	 * Keep in mind that modules will be initialized before any extensions whose <code>extendOnInit</code> property is true.<br />
	 * This method is based on jQuery's <code>$(document).ready()</code> shorthand.
	 *
	 * @param  {Function} [callback] - Function to run after initialization.
	 * @return {CylinderClass} Returns the instance itself.
	 *
	 * @example
	 * // initialize the current instance
	 * // onto a new, more type-friendly, variable
	 * var cl = Cylinder.init(function () {
	 *     console.log('cylinder is initialized!');
	 *     console.log('modules present:', cl.modules());
	 * });
	 */
	this.init = function (callback) {
		if (initialized) return instance; // don't do a thing if this already ran!
		initialized = true; // tell the framework that we're set up and ready to go!

		instance.$(function () {
			// runs through each module
			// and initializes it again!
			_.each(modules, function (func, name) {
				instance.module(name, func);
			});

			// runs through each initializable extension
			// and finally initializes it!
			_.each(extensions, function (func) {
				instance.extend(func);
			});

			// call event so other parts of the app
			// can be aware the framework has been initialized.
			instance.trigger('init', instance);

			// run callback, if it's a method!
			if (_.isFunction(callback)) callback(instance);
		});

		// return the instance itself because the programmer
		// will be able to customize the short tag!
		return instance;
	};

};

module.exports = CylinderClass;

},{}],2:[function(require,module,exports){
'use strict';

/**
 * Creates a new CylinderException object.
 *
 * @class
 * @param {String} message - The message for this exception.
 * @param {Mixed}  [value] - A value for this exception.
 */
function CylinderException (message, value) {

	/**
	 * The exception's value.
	 * @type {Mixed}
	 */
	this.value = value;

	/**
	 * The exception's message.
	 * @type {String}
	 */
	this.message = message != null
		? message.toString()
		: message;

	/**
	 * Turns the exception into a string.
	 * @return {String}
	 */
	this.toString = function () {
		return this.message;
	};

};

module.exports = CylinderException;

},{}],3:[function(require,module,exports){
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
 * @param {Function} options.callback<Number,Number,CylinderResizeRule> - A callback function defining the rule given a width and height. Must return a boolean.
 *
 * @example
 * // creates a new rule
 * var rule = new CylinderResizeRule({
 *     min_width: 0,
 *     max_width: 767,
 *     callback: function (width, height, rule) {
 *         return width >= rule.min_width && width <= rule.min_height;
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

},{}],4:[function(require,module,exports){
'use strict';

/**
 * @exports CylinderControllers
 * @augments CylinderClass
 */
module.exports = function (instance) {

	var initialized = false;
	var controllers = {}; // controllers!

	/**
	 * Extends the framework with a specific named controller.<br />
	 * The controller's constructor won't be initialized until <code>initControllers()</code> is called.
	 * When, or if, <code>initControllers()</code> is called, then the module will be added as well.<br /><br />
	 * The controller itself will be added to the internal controller list
	 * (accessible through <code>controllers()</code>), but it will not be added to the global scope.
	 *
	 * @function controller
	 * @memberof module:CylinderControllers
	 * @param  {String}   name - The controller's name.
	 * @param  {Function} func - The controller's constructor.
	 * @return {Mixed} Returns the result of 'func' after evaluated.
	 *
	 * @example
	 * Cylinder.controller('myctrl', function (cl, controller) {
	 *     // you can add the controller to the global scope, if you want.
	 *     // this way, you'll be able to access it easily.
	 *     window.MyCtrl = controller;
	 *
	 *     // controller logic goes here!
	 *     controller.alert = function (str) {
	 *         alert('abc');
	 *     };
	 *
	 *     // always return the parent variable itself in the end,
	 *     // because this is what Cylinder will recognize as the controller to add.
	 *     return controller;
	 * });
	 *
	 * // you now have two ways to access controllers,
	 * // either from Cylinder's own method...
	 * Cylinder.controllers().myctrl.alert('hello!');
	 *
	 * // or through the global scope, like we added up.
	 * MyCtrl.alert('hello, world!');
	 */
	instance.controller = function (name, ctor) {
		// check if we have a name and if it is a string!
		// if the name is blank, then forget about it and throw error!
		if (!_.isString(name) || instance.s.isBlank(name)) throw new CylinderException('Trying to add a nameless controller!');

		// check if ctor is null, cause it's probably just trying to return the controller!
		// if so, check if the controller exists, and return it!
		if (_.isUndefined(ctor) || _.isNull(ctor)) {
			if (initialized && _.has(controllers, name)) return controllers[name].instance;
			return null;
		}

		controllers[name] = { constructor: ctor, instance: { name: name } }; // add controller to cache
		if (!initialized) return controllers[name].instance; // return the framework instance!

		var controller = controllers[name].instance; // pre-initialize controller...
		var result = typeof ctor == 'function' // initialize controller... (check if function or object)
			? ctor(instance, controller) // run constructor
			: ctor; // it's an object, so just extend it
		if (!result) result = controller; // if it's falsy, then use the variable passed to the constructor

		controllers[name].instance = result; // apply to the instance...
		instance.trigger('controller', name, result); // trigger a global event for when extended...
		instance.trigger('controller:' + name, result); // trigger a specific event for when extended...
		return result; // and return the controller itself!
	};

	/**
	 * Returns a list of existing controllers.
	 *
	 * @function controllers
	 * @memberof module:CylinderControllers
	 * @return {Array}
	 */
	instance.controllers = function () {
		return _.mapObject(controllers, function (ctrl, name) {
			return ctrl.instance;
		});
	};

	/**
	 * Properly initializes Cylinder's controllers.<br />
	 * This method is based on jQuery's <code>$(document).ready()</code> shorthand.
	 *
	 * @function initControllers
	 * @memberof module:CylinderControllers
	 * @param  {Function} [callback] - Function to run after initialization.
	 * @return {CylinderClass} Returns the instance itself.
	 */
	instance.initControllers = function (callback) {
		if (initialized) return instance; // don't do a thing if this already ran!
		initialized = true; // tell the framework that we're set up and ready to go!

		instance.$(function () {
			// runs through each controller
			// and initializes it!
			_.each(controllers, function (ctrl, name) {
				instance.controller(name, ctrl.constructor);
			});

			// call event so other parts of the app
			// can be aware controllers have been initialized.
			instance.trigger('initcontrollers', instance);

			// run callback, if it's a method!
			if (_.isFunction(callback)) callback(instance);
		});

		// return the instance itself because the programmer
		// will be able to customize the short tag!
		return instance;
	};

	return instance;

};

},{}],5:[function(require,module,exports){
(function (scope) {

	// include main classes
	scope.CylinderClass = require('./classes/class');
	scope.CylinderException = require('./classes/exception');
	scope.CylinderResizeRule = require('./classes/resizerule');

	// include extension/module classes
	scope.CylinderClass.ExtensionControllers = require('./extensions/controllers');
	scope.CylinderClass.ModuleUtils = require('./modules/utils');
	scope.CylinderClass.ModuleDom = require('./modules/dom');
	scope.CylinderClass.ModuleStore = require('./modules/store');
	scope.CylinderClass.ModuleAnalytics = require('./modules/analytics');
	scope.CylinderClass.ModuleTemplates = require('./modules/templates');
	scope.CylinderClass.ModuleRouter = require('./modules/router');
	scope.CylinderClass.ModuleResize = require('./modules/resize');
	scope.CylinderClass.ModuleScroll = require('./modules/scroll');

	// instantiate
	scope.Cylinder = scope.cylinder = new CylinderClass();
	scope.Cylinder.extend(scope.CylinderClass.ExtensionControllers);
	scope.Cylinder.module('utils', scope.CylinderClass.ModuleUtils);
	scope.Cylinder.module('dom', scope.CylinderClass.ModuleDom);
	scope.Cylinder.module('store', scope.CylinderClass.ModuleStore);
	scope.Cylinder.module('analytics', scope.CylinderClass.ModuleAnalytics);
	scope.Cylinder.module('templates', scope.CylinderClass.ModuleTemplates);
	scope.Cylinder.module('router', scope.CylinderClass.ModuleRouter);
	scope.Cylinder.module('resize', scope.CylinderClass.ModuleResize);
	scope.Cylinder.module('scroll', scope.CylinderClass.ModuleScroll);

})(window);

},{"./classes/class":1,"./classes/exception":2,"./classes/resizerule":3,"./extensions/controllers":4,"./modules/analytics":6,"./modules/dom":7,"./modules/resize":8,"./modules/router":9,"./modules/scroll":10,"./modules/store":11,"./modules/templates":12,"./modules/utils":13}],6:[function(require,module,exports){
'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Analytics module for CylinderClass.
	 * @exports analytics
	 */
	var module = _.extend({}, _module);

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean} debug - If true, requests won't be sent.
	 * @property {Boolean} log   - Should the module log into the console?
	 */
	module.options = {
		debug: false,
		log: false
	};

	// compiles a ga(...) function and executes it
	// this will read the method's parameters
	function call_ga (args) {
		if (typeof ga == 'undefined' || _.isNull(ga) || !_.isFunction(ga)) return null;

		var s = '\'' + args.join('\',\'') + '\'';
		return !module.options.debug // execute if debug == false
			? eval('ga(' + s + ')')
			: 'ga(' + s + ')';
	};

	// compiles a _gaq.push([...]) function and executes it
	// this will read the method's parameters
	function call_gaq (args) {
		if (typeof _gaq == 'undefined' || _.isNull(_gaq)) return null;

		var s = '\'' + args.join('\',\'') + '\'';
		return !module.options.debug // execute if debug == false
			? _gaq.push(args)
			: '_gaq.push([' + s + '])';
	};

	/**
	 * Send an Analytics pageview to both <code>ga.js</code> and <code>analytics.js</code>.
	 * @param {String} path - The path to send to analytics.
	 */
	module.pageview = function (path) {
		if (module.options.log && !_.isUndefined(console.log))
			console.log('Pageview: ' + path);

		call_ga([ 'send', 'pageview', path ]);
		call_gaq([ '_trackEvent', path ]);
	};

	/**
	 * Send an Analytics event to both <code>ga.js</code> and <code>analytics.js</code>.
	 * @param {String|Number} category - The event's category.
	 * @param {String|Number} action   - The event's action.
	 * @param {String|Number} [label]  - The event's label for that action.
	 * @param {String|Number} [value]  - The event's value for that action.
	 */
	module.event = function (category, action, label, value) {
		if (module.options.log && !_.isUndefined(console.log))
			console.log('Event: ' + category + ' ' + action + ' ' + label + ' ' + value);

		var args = _.toArray(arguments);
		call_ga( _.union([ 'send', 'event' ], args) );
		call_gaq( _.union([ '_trackEvent' ], args) );
	};

	return module; // finish

};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../classes/resizerule":3}],9:[function(require,module,exports){
'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Router module for CylinderClass.
	 * @exports router
	 */
	var module = _.extend({}, _module);

	var routes = {}; // this will contain all routes and middleware!
	var middleware = []; // this will contain all global middleware that is ALWAYS executed on route change!
	var path_domain = ''; // this will be the domain!
	var path_root = ''; // this will be the root path when navigating!
	var path_full = ''; // this will be the proper path when detecting links!
	var reload_timeout = null; // timeout instance when reloading is called!

	function getCurrentUrl () {
		// this attempts to return the current url
		// so it can be used by other methods
		return (module.options.push)
			? Backbone.history.location.pathname.replace(path_root, '')
			: Backbone.history.location.hash.replace('!', '').replace('#', '')
	};

	function asyncSeries (collection, iterator, done) {
		var queue = collection.slice(0); // copy the array

		(function next () {
			if (queue.length < 1) return done(); // if queue is empty, finish!
			var method = queue.shift(); // return item on top of queue
			iterator(method, next); // execute the iterator
		})();
	};

	function middlewareGlobal (composition, args, finish) {
		// this runs through every function in the global middleware!
		// if there's no middleware, ignore.
		if (middleware.length < 1) {
			return finish();
		}

		asyncSeries(middleware, function (method, done) {
			if (!_.isFunction(method)) done();
			else method.apply(module, [ composition.name, args, done ]);
		}, function (err) {
			return finish();
		});
	};

	function middlewareSpecific (composition, args, finish) {
		// this runs through every function in the route's specific middleware!
		// if there's no middleware, ignore.
		if (composition.middleware.length < 1) {
			return finish();
		}

		asyncSeries(composition.middleware, function (method, done) {
			if (!_.isFunction(method)) done();
			else method.apply(module, [].concat(args, done));
		}, function (err) {
			return finish();
		});
	};

	function execute (callback, args, name) {
		var composition = routes[name]; // current composed route
		var router = this; // recommended context

		// trim the argument list,
		// since it always returns a "null" element
		args = _.initial(args);

		// here we run through potential global middleware,
		// and then specific middleware, followed by the actual route callback!
		return middlewareGlobal(composition, args, function () {
			module.previous_route = module.route; // save the previous route...
			module.route = name; // set the current route...

			module.previous_args = module.args; // save the previous arguments...
			module.args = args; // set the current arguments...

			module.previous_url = module.url; // save the previous url...
			module.url = getCurrentUrl(); // set the new url...

			if (module.previous_route) {
				// events for the previous route
				if (module.previous_route !== module.route) { // only run if we're actually LEAVING the route
					cylinder.trigger('routeout:' + module.previous_route, module.previous_args); // trigger a specific event for the framework...
					cylinder.trigger('routeout', module.previous_route, module.previous_args); // trigger a global event for the framework...
				}

				// events for the route change with specific previous_route naming
				cylinder.trigger('routechange:' + module.previous_route + ':' + name, module.previous_args, args); // trigger specific event 1 for the framework...
				cylinder.trigger('routechange:' + module.previous_route, module.previous_args, name, args); // trigger specific event 2 for the framework...
			}

			// global event for the route change (even if previous_route & previous_args is null)
			cylinder.trigger('routechange', module.previous_route, module.previous_args, name, args); // trigger a global event for the framework...

			// events for the new route
			cylinder.trigger('route:' + name, args); // trigger a specific event for the framework...
			cylinder.trigger('route', name, args); // trigger a global event for the framework...

			// signal the module that a route has been triggered...
			module.done = true;

			// call the specific middleware now, and we're done!
			return middlewareSpecific(composition, args);
		});
	};

	/**
	 * The options taken by the module.
	 * @type     {Object}
	 * @property {Boolean} push     - If true, the module will attempt to use HTML5's pushState.<br />
	 *                                See <a href="http://backbonejs.org/#History" target="_blank">http://backbonejs.org/#History</a>
	 *                                for more details about how pushState works.
	 * @property {Boolean} clicks   - If false, clicking on a link covered by <code>addHandler()</code> will bypass the module's default behaviour.
	 * @property {Boolean} prefix   - Sets up a prefix for all links.
	 * @property {Boolean} selector - The default element selector for the click handler given by <code>addHandler()</code>.
	 * @property {Boolean} navigate_defaults - Allows for default properties to be passed to the module's internal Backbone.Router on <code>go()</code>.
	 */
	module.options = {
		push: false, // is pushState navigation on?
		clicks: true, // is the hyperlink event handler on?
		prefix: '', // should there be a prefix for all links?
		selector: 'a:not([data-bypass])', // this is the default element selector for the click handler

		// other options!
		navigate_defaults: {
			trigger: true
		}
	};

	/**
	 * Has the router triggered?
	 * @type {Boolean}
	 */
	module.done = false;

	/**
	 * Current router URL.
	 * @type {String}
	 */
	module.url = null;

	/**
	 * Current route name.
	 * @type {String}
	 */
	module.route = null;

	/**
	 * Current route arguments.
	 * @type {Array}
	 */
	module.args = null;

	/**
	 * Previous router URL.
	 * @type {String}
	 */
	module.previous_url = null;

	/**
	 * Previous route name.
	 * @type {String}
	 */
	module.previous_route = null;

	/**
	 * Previous route arguments.
	 * @type {Array}
	 */
	module.previous_args = null;

	/**
	 * Returns the current router's domain.
	 * @return {String}
	 */
	module.domain = function () { return path_domain; };

	/**
	 * Returns the current router's root path.
	 * @return {String}
	 */
	module.root = function () { return path_root; };

	/**
	 * Returns the current router's full path (domain + root).
	 * @return {String}
	 */
	module.path = function () { return path_full; };

	// this will be the router itself!
	// it will manage all routes and even callbacks!
	var obj = new (Backbone.Router.extend({
		// this custom method will check its name,
		// and execute any middleware before doing the final callback!
		execute: execute
	}))();

	/**
	 * Sets up the domain and root this router will operate on.
	 *
	 * @param  {String} [domain] - The base domain for this router.
	 * @param  {String} [root]   - The base path (after domain, the immutable part) for this router.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.setup = function (domain, root) {
		// reuse current variables!
		if (!_.isString(domain)) domain = path_domain;
		if (!_.isString(root)) root = path_root;

		// first step of all: checks if the domain is correct.
		// it shouldn't have more than the domain itself - that part belongs to "path_root"!
		if (!cylinder.s.isBlank(domain)) {
			var first_slash = domain.replace('//', '||').indexOf('/');
			if (first_slash < domain.length) {
				var part_to_move = domain.slice(first_slash + 1);
				domain = domain.replace(part_to_move, '');
				root = part_to_move + root;
			}
		}

		// sets up the appropriate paths.
		// this will set up the hidden vars - if they're to be reconfigured, use this method again!
		path_domain = (!cylinder.s.isBlank(domain) ? cylinder.s.trim(domain, '/') : location.protocol + "//" + location.host) + '/';
		path_root = (!cylinder.s.isBlank(root) ? '/' + cylinder.s.trim(root, '/') : '').replace(path_domain, '') + '/';
		path_full = // domain + root without unnecessary slashes
			cylinder.s.rtrim(path_domain, '/') + '/' +
			cylinder.s.ltrim(path_root, '/');

		// if the router had already been started,
		// restart it so that we don't operate on an older domain/path!
		if (Backbone.History.started) module.start(true);

		return module; // return the module itself.
	};

	/**
	 * Starts the router.
	 * It will automatically start processing URL changes.
	 *
	 * @param  {Boolean} [silent] - Determines whether the router should fire initial events or not.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.start = function (silent) {
		module.stop(); // stop the router first before doing anything else!

		Backbone.history.start({
			pushState: module.options.push,
			root: path_root,
			silent: silent || false
		});

		return module; // return the module itself.
	};

	/**
	 * Stops the router.
	 *
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.stop = function () {
		if (Backbone.History.started) {
			Backbone.history.stop();
		}

		return module; // return the module itself.
	};

	/**
	 * Adds a middleware layer to the global router.
	 * The provided callback will be executed every time the URL changes.
	 *
	 * @example
	 * // this middleware can be used to check stuff in the new path.
	 * // for example, to update something in the app everytime the route changes
	 *
	 * Cylinder.router.use(function (name, args, next) {
	 *     console.log(name); // name of the matched route, ex: "my-route"
	 *     console.log(args); // array of matched arguments, ex: ["hey", "john"]
	 *     next(); // keep the chain going.
	 * });
	 *
	 * @example
	 * // one good example of middleware is for authentication purposes,
	 * // for instance, if you probably need all of your routes protected,
	 * // so let's check if there's tokens and whatnot
	 *
	 * var userData = null; // would be an object if logged in
	 * var userToken = null; // would be a string
	 *
	 * var unprotectedRoutes = ['login', 'register']; // routes that don't need login, but shouldn't be accessed if there is login
	 * var urlToRedirectAfterLogin = null; // URL to redirect the user after login
	 *
	 * Cylinder.router.use(function (name, args, next) {
	 *     if (unprotectedRoutes.indexOf(name) > -1) {
	 *         // we entered an unprotected route that shouldn't
	 *         // be entered unless we're logged out
	 *         if (userToken !== null) {
	 *             Cylinder.router.go('home');  // login has been made, so go to next
	 *             return; // stop processing here
	 *         }
	 *     }
	 *
	 *     if (userToken === null) {
	 *         // no login, let's redirect to the login page
	 *         urlToRedirectAfterLogin = Cylinder.router.url;
	 *         Cylinder.router.go('login');
	 *         return;
	 *     }
	 *
	 *     // no issues encountered?
	 *     // then let the user through!
	 *     next();
	 * });
	 *
	 * @param  {...Function} functions - The callbacks to add.<br />
	 *                                   The methods themselves will receive the name of the route and an array of arguments, along with a
	 *                                   `next` callback at the end, in order to skip to the next function in the chain.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.use = function (functions) {
		middleware.push(functions); // push the callback to the array
		return module; // return the module itself.
	};

	/**
	 * Removes a middleware layer from the global router.
	 * You must provide the same callback you provided in <code>add()</code>, otherwise this method will do no good.
	 *
	 * @param  {...Function} functions - The callbacks to remove.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.unuse = function (functions) {
		middleware = _.without(middleware, functions); // remove the callback from the array
		return module; // return the module itself.
	};

	/**
	 * Adds a handler to the router.
	 * This handler will be triggered every time the URL matches the syntax provided.
	 *
	 * @example
	 * // route with multiple callbacks,
	 * // in order to keep stuff organized
	 *
	 * Cylinder.router.add(
	 *     'my-route',
	 *     'test/:abc/:def',
	 *     function (abc, def, next) {
	 *         // intermediate function in chain,
	 *         // this can be used to validate something
	 *         if (abc === 'hey') {
	 *             throw 'You cannot hey me!';
	 *         }
	 *         next(); // no errors? keep going
	 *     },
	 *     function (abc, def) {
	 *         // final callback in chain,
	 *         // ...
	 *     }
	 * );
	 *
	 * @param {String}      [name]    - Name of the handler for identification purposes inside added middleware.
	 *                                  This name will be slugified once added, so be careful when setting this to avoid mismatching.
	 * @param {String}      syntax    - The URL syntax that will be hash mapped to the handler.
	 *                                  See <a href="http://backbonejs.org/#Router-routes" target="_blank">http://backbonejs.org/#Router-routes</a>
	 *                                  to learn more about how this syntax can be set.
	 * @param {...Function} callbacks - Callback functions specific to this handler. They will be executed in the order they're provided.<br />
	 *                                  The methods themselves will receive all of the arguments passed into the syntax, along with a
	 *                                  `next` callback at the end, in order to skip to the next function in the callback list.
	 */
	module.add = function () {
		var args = _.flatten(arguments);

		// get the name and the syntax
		var name = cylinder._.isString(args[0]) && !cylinder.s.isBlank(args[0]) ? args[0] : false;
		var syntax = cylinder._.isString(args[1]) && !cylinder.s.isBlank(args[1]) ? args[1] : args[0];
		if (!cylinder._.isString(syntax) || cylinder.s.isBlank(syntax)) {
			throw new CylinderException('Trying to add a handler to router but no valid syntax provided.');
		}

		// convert name into a valid name
		name = cylinder.s.slugify(name);

		// calculate the prefix
		var prefix = module.options.prefix || '';
		if (
			!cylinder.s.isBlank(prefix) && cylinder.s.endsWith(prefix, '/') &&
			(cylinder.s.startsWith(syntax, '/') || cylinder.s.startsWith(syntax, '(/)'))
		) {
			prefix = prefix.slice(0, prefix.length - 1);
		}

		// add the route to our internal object
		// to check if we have middleware to run and stuff...
		routes[name] = {
			name: name,
			syntax: syntax,
			middleware: _.filter(args, _.isFunction)
		};

		// and finally, add the route
		// to the proper Backbone.Router object!
		return obj.route(prefix + syntax, name);
	};

	/**
	 * Adds an event handler that will capture all clicks on internal site links, and calls the module's <code>go()</code> method.<br />
	 * The default selector will not capture clicks on hyperlinks with the [data-bypass] attribute.
	 *
	 * @param  {String} [selector] - Override the default selector provided to jQuery, in order to target custom elements.<br />
	 *                               If empty, the method will provide the selector from <code>options.selector</code>.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.addHandler = function (selector) {
		var callback = _.last(_.flatten(arguments)); // check for the last argument
		if (!_.isFunction(callback)) callback = null; // reset to null!

		cylinder.dom.$document.on('click.clrouter', _.isString(selector) && !cylinder.s.isBlank(selector) ? selector : module.options.selector, function (e) {
			if (!module.options.clicks) return; // don't do a thing if the event isn't allowed!

			var $this = cylinder.$(this);
			var href = {
				attr: $this.attr('href'),
				prop: $this.prop('href'),
				target: $this.prop('target')
			};

			if (!(cylinder.s.isBlank(href.target) || href.target == '_self')) return; // do not route if target is different than own page or blank link
			if (href.attr == '#' && module.options.push) return e.preventDefault(); // do not route if it's a regular hash, but don't let Backbone catch this event either!

			// checks if there is a valid address in the hyperlink.
			// then, it checks whether or not the address is in the local domain!
			if (
				href.prop &&
				href.prop.slice(0, path_full.length) === path_full &&
				href.prop.indexOf(module.options.prefix) !== -1
			) {
				e.preventDefault();
				module.go(href.prop.replace(path_full, ''));
				if (_.isFunction(callback)) callback($this, href);
			}
		});

		return module; // return the module itself.
	};

	/**
	 * Removes the event handler added by <code>addHandler()</code>.
	 *
	 * @param  {String} [selector] - Previously provided selector to override the default one provided to jQuery, in order to target custom elements.<br />
	 *                               If empty, the method will provide the selector from <code>options.selector</code>.
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.removeHandler = function (selector) {
		cylinder.dom.$document.off('click.clrouter', _.isString(selector) && !cylinder.s.isBlank(selector) ? selector : module.options.selector);
		return module; // return the module itself.
	};

	/**
	 * Changes the current URL to the one specified.<br />
	 * If <code>start()</code> wasn't called, then it will change URL location natively instead of going through the router's methods.
	 *
	 * @param  {String}  [url]     - The URL to navigate to. If null, it will navigate to the same page by forcing options.trigger to `true`.
	 * @param  {Boolean} [options] - Options to pass to Backbone.Router's method.
	 * @param  {Boolean} [prefix]  - Should the method include the prefix set in the module's <code>options.prefix</code>?
	 * @return {router} Returns the module itself, to ease chaining.
	 */
	module.go = function (url, options, prefix) {
		options = options || {}; // turn into a valid object

		if (!_.isString(url)) {
			var args = module.args.concat([ null ]);
			var composition = routes[module.route];
			if (composition !== null) execute.apply(obj, [ composition.callback, args, module.route ]);
			return module;
		}

		if (!Backbone.History.started) {
			if (module.options.push) window.location = path_full + url; // change full location!
			else window.location.hash = '#' + url; // only do it if using hash-navigation!
			return module; // return the module itself.
		}

		obj.navigate(
			(prefix !== false ? module.options.prefix : '') + url,
			_.extend({}, module.options.navigate_defaults, options)
		);

		return module; // return the module itself.
	};

	/**
	 * Reloads the page instantaneously, unless a delay is set.
	 *
	 * @param {Number|Boolean} [delay] - The delay of the reload, in seconds.
	 *                                   If "false" is passed, the timeout will be cancelled and the page won't be reloaded.
	 */
	module.reload = function (delay) {
		reload_timeout = clearTimeout(reload_timeout);

		// if a delay is defined,
		// do a timeout and return it.
		if (_.isNumber(delay) && delay > 0) {
			reload_timeout = setTimeout(function () { module.reload(); }, delay);
			return reload_timeout;
		}
		else if (delay === false) {
			if (reload_timeout) {
				clearTimeout(reload_timeout);
				reload_timeout = null;
			}
			return null;
		}

		return window.location.reload();
	};

	// run the setup at least once
	// so we can have some proper values at start
	module.setup('', cylinder.$(location).attr('pathname'));

	return module; // finish

};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (cylinder, _module) {

	// ALL DEPENDENCIES FIRST!
	// If we don't do this, the framework will just
	// die in the water. We don't want to die like that.
	cylinder.dependency('Cylinder.dom', true);

	// BASIC CONSTRUCTOR!
	// This will build an object based on an element.
	// It will add handlers and stuff automagically.
	var initialize = function ($element, n) {
		/**
		 * Scroll module for CylinderClass.<br />
		 * This module extends on <a target="_blank" href="http://backbonejs.org/#Events">Backbone.Events</a>.
		 * @exports scroll
		 */
		var obj = _.extend({}, Backbone.Events);

		/**
		 * The main element being targeted.
		 * @type {jQueryObject}
		 */
		obj.$el = $element instanceof cylinder.$ && $element.length > 0
			? $element
			: cylinder.dom.$window;

		// construction stuff
		var name = !cylinder.s.isBlank(n) ? n : cylinder.s.slugify(obj.$el.attr('class') || obj.$el.prop('nodeName') || 'window');
		var isWindow = cylinder.$.isWindow(obj.$el[0]);
		var isHtml = obj.$el.is(cylinder.dom.$html);
		var isBody = obj.$el.is(cylinder.dom.$body);

		/**
		 * Has the element been scrolled?
		 * @type {Boolean}
		 */
		obj.done = false;

		/**
		 * Current element's scrollLeft.
		 * @type {Number}
		 */
		obj.left = 0;

		/**
		 * Current element's scrollTop.
		 * @type {Number}
		 */
		obj.top = 0;

		/**
		 * Current element's width + scrollLeft.
		 * @type {Number}
		 */
		obj.right = 0;

		/**
		 * Current element's height + scrollTop.
		 * @type {Number}
		 */
		obj.bottom = 0;

		/**
		 * Previous element's scrollLeft.
		 * @type {Number}
		 */
		obj.previous_left = 0;

		/**
		 * Previous element's scrollTop.
		 * @type {Number}
		 */
		obj.previous_top = 0;

		/**
		 * Previous element's width + scrollLeft.
		 * @type {Number}
		 */
		obj.previous_right = 0;

		/**
		 * Previous element's height + scrollTop.
		 * @type {Number}
		 */
		obj.previous_bottom = 0;

		// get the current element's width
		function getElementWidth ($el) {
			return isWindow && cylinder.resize != null
				? cylinder.resize.width
				: $el.prop('clientWidth') || 0;
		};

		// get the current element's height
		function getElementHeight ($el) {
			return isWindow && cylinder.resize != null
				? cylinder.resize.height
				: $el.prop('clientHeight') || 0;
		};

		// this is the method that will handle scrolling!
		// will calc values and call events for components
		function handler (trigger, e) {
			// save previous values!
			obj.previous_left = obj.left;
			obj.previous_top = obj.top;
			obj.previous_right = obj.right;
			obj.previous_bottom = obj.bottom;

			// get current values!
			// attempt to get the object's width and height!
			obj.left = obj.$el.scrollLeft();
			obj.top = obj.$el.scrollTop();
			obj.right = obj.left + getElementWidth(obj.$el);
			obj.bottom = obj.top + getElementHeight(obj.$el);

			// call the events!
			if (trigger) callEvents(e);
		};

		// controller scroll,
		// this will just call an event!
		function callEvents (e) {
			obj.trigger('scroll', obj.$el, obj.left, obj.top, e); // trigger global cylinder event
			cylinder.trigger('scroll:' + name, obj.$el, obj.left, obj.top, e); // trigger specific cylinder event
			cylinder.trigger('scroll', obj.$el, obj.left, obj.top, e); // trigger global cylinder event
			obj.done = true; // set "done" to true after the first events fire
		};

		/**
		 * Scrolls the current element to given coordinates.<br />
		 * A jQuery object can also be given instead of <code>left</code> and <code>top</code>,
		 * and the module will make the element's contents scroll into that object's left and top.
		 *
		 * @param  {Number} left       - The horizontal coordinate to scroll to.
		 * @param  {Number} top        - The vertical coordinate to scroll to.
		 * @param  {Number} [duration] - Time it takes for scrolling to finish.
		 */
		obj.go = function (left, top, duration) {
			if (left instanceof jQuery) {
				// the first argument is an object!
				// so we'll switch all of this up!
				var $object = left;
				if ($object.length == 0 || !cylinder.$.contains((isWindow || isHtml ? cylinder.dom.$body : obj.$el)[0], $object[0])) return;

				// the object has an offset,
				// and is inside our element!
				duration = top; // switch arguments
				var object_offset = $object.offset() || { left: 0, top: 0 };
				var $el_scroller = isWindow ? cylinder.dom.$html : obj.$el; // the jquery element for cache
				var el_scroller = $el_scroller[0]; // the raw element because we need the first raw DOM element
				left = Math.min(el_scroller.scrollWidth - $el_scroller.prop('clientWidth'), object_offset.left);
				top = Math.min(el_scroller.scrollHeight - $el_scroller.prop('clientHeight'), object_offset.top);
			}

			// check if we should scroll first!
			var scroll_left = left >= 0;
			var scroll_top = top >= 0;
			if (!scroll_left && !scroll_top) return; // do not even scroll! it's just a troll!

			// scrolls the page
			// uses native function if no duration
			if (cylinder.s.isBlank(duration) || !_.isNumber(duration) || duration < 1) {
				if (scroll_left) obj.$el.scrollLeft(left);
				if (scroll_top) obj.$el.scrollTop(top);
				return;
			}

			if ($.velocity) {
				// scroll the page with the VELOCITY plugin!
				if (scroll_left && left != obj.left) obj.$el.velocity('scroll', { duration: duration, offset: left, mobileHA: false, axis: 'x', queue: false }); // horizontal
				if (scroll_top && top != obj.top) obj.$el.velocity('scroll', { duration: duration, offset: top, mobileHA: false, axis: 'y', queue: false }); // vertical
			}
			else {
				// scroll the page with native JQUERY!
				// we'll have to hack it a bit if we're the window element!
				var options = {};
				if (scroll_left) options.scrollLeft = left;
				if (scroll_top) options.scrollTop = top;
				if (isWindow || isHtml || isBody) {
					cylinder.dom.$html.animate(options, duration);
					cylinder.dom.$body.animate(options, duration);
				}
				else {
					obj.$el.animate(options, duration);
				}
			}
		};

		// final setup.
		// this will bind the handler to the event!
		obj.$el
			.off('scroll.cylinder')
			.on('scroll.cylinder', function (e) {
				handler(true, e);
			});

		// and call the event once,
		// just so we have proper values!
		handler(false, null);

		// return the scroll instance
		return obj;
	};

	// and because we want to maintain consistency,
	// we'll return this module as a "window" instance
	return _.extend(initialize(cylinder.dom.$window), { initialize: initialize });

};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Store module for CylinderClass.
	 * @exports store
	 */
	var module = _.extend({}, _module);

	// registered models list
	// and current store context
	var models = {};
	var context = null;
	var contextname = null;

	/**
	 * Default model that can and should be used to create new data models.<br />
	 * The model is based on the standard <a href="http://backbonejs.org/#Model" target="_blank">Backbone.Model</a>, and uses the same methods.
	 * You are free to override what this module considers as the main data model methods: <code>fetch()</code>, <code>save()</code>, and <code>destroy()</code>.
	 *
	 * @type     {Model}
	 * @property {Function} Model.fetch   - Loads properties onto the model. The module does not call this method automatically.
	 * @property {Function} Model.save    - Saves properties from the model using your method of choice.
	 * @property {Function} Model.destroy - Should be used to completely destroy a model. Use at your discretion.
	 *
	 * @example
	 * // the following example creates a new model that will
	 * // take advantage of the browser's local storage.
	 * // Notice: Cylinder.store comes with a localstorage model by default!
	 * var LocalStorageModel = Cylinder.store.Model.extend({
	 *     namespace: 'abc',
	 *     fetch: function () {
	 *         // load the object in localStorage to the model
	 *         this.set(window.localStorage[this.namespace]);
	 *     },
	 *     save: function () {
	 *         // save the model as a plain object to localStorage
	 *         window.localStorage[this.namespace] = this.toJSON();
	 *     }
	 * });
	 *
	 * // we now add the model to the module
	 * Cylinder.store.use('localstorage', new LocalStorageModel);
	 *
	 * // we switch the store's context to always use it
	 * // and use the get/set/unset/clear methods
	 * Cylinder.store.switch('localstorage');
	 * Cylinder.store.set('abc', 123);
	 *
	 * // we can also fetch the model directly and chain operations without switching contexts.
	 * // just be wary that some operations may not return the model itself, like .get() or .toJSON().
	 * Cylinder.with('localstorage').set('def', 456).unset('abc').toJSON();
	 *
	 * @example
	 * // the following doesn't take advantage of the Model,
	 * // but is an example of how to simply register a new data model
	 * // without having to extend the default model, since .use() will
	 * // automatically detect the type of object and convert it.
	 * Cylinder.store.use('localstorage', {
	 *     namespace: 'abc',
	 *     fetch: function () {
	 *         // load the object in localStorage to the model
	 *         this.set(window.localStorage[this.namespace]);
	 *     },
	 *     save: function () {
	 *         // save the model as a plain object to localStorage
	 *         window.localStorage[this.namespace] = this.toJSON();
	 *     }
	 * });
	 *
	 * Cylinder.store.switch('localstorage');
	 * Cylinder.store.set('abc', 123);
	 */
	module.Model = Backbone.Model.extend({
		initialize: function () {
			// on this barebones initialize method,
			// we'll make the model save itself when something changes
			this.on('change', function () {
				return this.save();
			}, this);
		},

		sync: function () {},
		fetch: function () {},
		save: function () {},
		destroy: function () {}
	});

	/**
	 * Adds a model to the data store.<br />
	 * The object provided can be either an already initialized instance of a data model,
	 * an uninstanced data model, or a plain object that will be converted to a new data model.
	 *
	 * @param  {String}       name - The name of the model to add.
	 * @param  {Model|Object} obj  - The model to add.
	 * @return {Model} Returns the model itself after being added and initialized.
	 */
	module.use = function (name, obj) {
		var model = null;

		if (obj instanceof Backbone.Model) {
			// we have a backbone model, instanced
			// so we'll just add and return
			model = obj;
		}
		else if (obj.constructor === Backbone.Model.constructor) {
			// we have a backbone model, uninstanced
			// so we'll start a new instance and add it!
			model = new obj;
		}
		else if (!_.isEmpty(obj)) {
			// we have a plain old object
			// so we create a new model with its properties
			var objmodel = module.Model.extend(obj);
			model = new objmodel;
		}

		models[name] = model;
		return model;
	};

	/**
	 * Removes a model from the data store.
	 * @param  {String} name - The name of the data model to remove.
	 * @return {Model} Returns the model itself after being removed.
	 */
	module.unuse = function (name) {
		// we're gonna have to check
		// if the model exists or not
		if (!_.has(models, name)) {
			if (exception !== false) throw new CylinderException('Trying to remove a non-existing or invalid model from store.');
			return null;
		}

		// we cannot let the user unset a model
		// if the model is the one currently being used
		if (name === contextname) {
			if (exception !== false) throw new CylinderException('Trying to remove the currently used data model from store. Switch to another model first.');
			return null;
		}

		// everything is alright,
		// remove the model from the collection.
		var model = models[name];
		delete models[name];
		return model;
	};

	/**
	 * Returns a list of existing models.
	 * @return {Array}
	 */
	module.models = function () {
		return _.mapObject(models, function (model, name) {
			return model;
		});
	};

	/**
	 * Returns a previously registered data model.
	 *
	 * @param  {String}  name      - The name of the model.
	 * @param  {Boolean} exception - If false, the method won't throw an exception if the model is not found.
	 * @return {Model} Returns the model itself, or null if it's not found and <code>exception</code> is <code>false</code>.
	 */
	module.with = function (name, exception) {
		// we're gonna have to check
		// if the model exists or not
		if (!_.has(models, name)) {
			if (exception !== false) throw new CylinderException('Trying to get non-existing or invalid model from store.');
			return null;
		}

		return models[name];
	};

	/**
	 * Switches store contexts to a previously registered data model.<br /><br />
	 * After switching, the following methods are available on the module:<br />
	 * <ul>
	 * <li><a href="http://backbonejs.org/#Model-fetch" target="_blank">fetch()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-save" target="_blank">save()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-destroy" target="_blank">destroy()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-get" target="_blank">get()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-escape" target="_blank">escape()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-set" target="_blank">set()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-has" target="_blank">has()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-unset" target="_blank">unset()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-clear" target="_blank">clear()</a></li>
	 * <li><a href="http://backbonejs.org/#Model-toJSON" target="_blank">toJSON()</a></li>
	 * </ul>
	 *
	 * @param  {String} name - The name of the model.
	 * @return {Model} Returns the model itself after switching.
	 *
	 * @example
	 * Cylinder.store.switch('localstorage'); // switches the "Cylinder.store" context
	 * Cylinder.store.set('abc', 123); // sets 'abc' on localStorage
	 * Cylinder.store.get('abc'); // => 123
	 */
	module.switch = function (name) {
		var model = module.with(name, false);

		// we're gonna have to check
		// if the model exists or not
		if (!model) {
			throw new CylinderException('Trying to switch store context to non-existing or invalid model.');
		}

		// override module main methods
		module.fetch = _.bind(model.fetch, model);
		module.save = _.bind(model.save, model);
		module.destroy = _.bind(model.destroy, model);

		// overwrite module operation methods
		module.get = _.bind(model.get, model);
		module.escape = _.bind(model.escape, model);
		module.set = _.bind(model.set, model);
		module.has = _.bind(model.has, model);
		module.unset = _.bind(model.unset, model);
		module.clear = _.bind(model.clear, model);
		module.toJSON = _.bind(model.toJSON, model);

		// override module event methods
		module.on = _.bind(model.on, model);
		module.off = _.bind(model.off, model);
		module.trigger = _.bind(model.trigger, model);
		module.once = _.bind(model.once, model);
		module.listenTo = _.bind(model.listenTo, model);
		module.stopListening = _.bind(model.stopListening, model);
		module.listenToOnce = _.bind(model.listenToOnce, model);

		// apply the new context
		context = model;
		contextname = name;
		return model;
	};

	// based on the Model interface above,
	// we'll create a new one for localstorage
	module.use('localstorage', {

		namespace: 'cylinder_data', // namespace to which we'll save all data

		fetch: function () {
			var model = this;
			var deferred = cylinder.$.Deferred();
			if (cylinder.dependency('localStorage')) {
				// only get values from localstorage
				// if we have localstorage enabled.
				var collection = JSON.parse(localStorage.getItem(model.namespace));
				model.set(collection);
				deferred.resolve(collection);
			}
			else {
				// no localstorage?
				// no fun!
				deferred.reject();
			}
			return deferred;
		},

		save: function () {
			var model = this;
			var deferred = cylinder.$.Deferred();
			if (cylinder.dependency('localStorage')) {
				// only save values to localstorage
				// if we have localstorage enabled.
				var collection = model.toJSON();
				localStorage.removeItem(model.namespace);
				localStorage.setItem(model.namespace, JSON.stringify(collection));
				deferred.resolve(collection);
			}
			else {
				// no localstorage?
				// no fun!
				deferred.reject();
			}
			return deferred;
		}

	});

	// now switch context to localstorage
	module.switch('localstorage');

	return module; // finish

};

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function (cylinder, _module) {

	/**
	 * Utilities module for CylinderClass.
	 * @exports utils
	 */
	var module = _.extend({}, _module);

	/**
	 * Removes all HTML from a string.
	 *
	 * @param  {String} str - The string to clean.
	 * @return {String} The string without HTML.
	 */
	module.text = function (str) {
		return cylinder.$('<div>').html(str).text();
	};

	/**
	 * Unserializes a string into an object.<br /><br />
	 * This method is based on the implementation by Bruce Kirkpatrick.<br />
	 * <a target="_blank" href="https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581">https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581</a>
	 *
	 * @param  {String} string - The serialized object.
	 * @return {Object} - The string, unserialized into an object.
	 */
	module.unserialize = function (string) {
		var str = decodeURI(string);
		var pairs = str.split('&');
		var regex = /\+/g;
		var obj = {}, p, idx;
		for (var i = 0, n = pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];
			if (idx.length > 0) {
				if (obj[idx] === undefined) {
					obj[idx] = decodeURIComponent(p[1]).replace(regex, ' ');
				}
				else {
					if (typeof obj[idx] == "string") obj[idx] = [obj[idx]];
					obj[idx].push(decodeURIComponent(p[1]).replace(regex, ' '));
				}
			}
		}
		return obj;
	};

	/**
	 * Extracts a named variable from a string.
	 *
	 * @param  {String}      key          - The variable to extract.
	 * @param  {String}      [serialized] - The string to extract from. If null, the method will use the browser's query string.
	 * @return {String|Null} The value in form of a string, or <code>null</code> if it doesn't exist.
	 */
	module.query = function (key, serialized) {
		var query = serialized || window.location.search.substring(1);
		var vars = module.unserialize(query);
		return key in vars ? vars[key] : null;
	};

	return module; // finish

};

},{}]},{},[5]);
