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
	this.version = '{{v}}';

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
	 *     'async',
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
		'async',
		'jQuery',
		{ package: '_', name: 'underscore.js' },
		{ package: 's', name: 'underscore.string' },
		'Backbone',
		true
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
