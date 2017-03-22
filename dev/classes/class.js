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
	 * Performs a shallow copy of all properties in the **source** objects over to the **destination** object.
	 * Any nested objects or arrays will not be duplicated.
	 * The method respects the order of the given objects, so the last object's properties will always prevail over previous source objects.
	 *
	 * @param  {Object}    destination - Object to be extended.
	 * @param  {...Object} sources     - Objects to extend the destination object with.
	 * @return {Object} The same object passed in destination, but with properties from sources.
	 */
	this.extend = function () {
		var destination = arguments[0] || {};
		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					destination[key] = arguments[i][key];
				}
			}
		}
		return destination;
	};

	/**
	 * Attempts to resolve a given path inside a parent object and returns its corresponding value.
	 *
	 * @example
	 * // searching inside nested objects for a given property
	 * // only having a path and not worrying about errors
	 *
	 * var famousPeople = {
	 *     'e64d88': {
	 *         name: 'Beyoncé',
	 *         gender: 'female',
	 *         dob: '1981/09/04',
	 *         active: true,
	 *         children: [
	 *             {
	 *                 name: 'Blue Ivy Carter',
	 *                 gender: 'female',
	 *                 dob: '2012/01/07'
	 *             }
	 *         ]
	 *     },
	 *     '13d46f': {
	 *         name: 'John Mayer',
	 *         gender: 'male',
	 *         dob: '1977/10/16',
	 *         active: true,
	 *         children: []
	 *     }
	 * };
	 *
	 * // search for the given paths
	 * // and attempt to find results
	 *
	 * Cylinder.resolve(famousPeople, '13d46f.dob'); // '1977/10/16'
	 * Cylinder.resolve(famousPeople, 'e64d88.children.length'); // 1              (works with standard properties of other types)
	 * Cylinder.resolve(famousPeople, 'e64d88.children.0.gender'); // 'female'     (dot notation works)
	 * Cylinder.resolve(famousPeople, 'e64d88.children[0].gender'); // 'female'    (array notation also works)
	 * Cylinder.resolve(famousPeople, 'f33581.children[2].name'); // undefined     (path wasn't found and default value not set)
	 * Cylinder.resolve(famousPeople, 'f33581.children[2].name', false); // false  (path wasn't found but `returns` was set)
	 *
	 * @param  {Any}           parent              - The parent object where we should search.
	 * @param  {String}        path                - The string symbolizing the path to the desired property.
	 * @param  {Any}           [returns=undefined] - If given, the method will return this variable by default.
	 * @return {Any|Undefined} Returns the value of the given path, or the value of `returns` if path is not found.
	 */
	this.resolve = function (parent, path, returns) {
		// solver function, based on code from
		// http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
		if (!parent) return returns; // return straight away if parent is falsy
		if (!path || typeof path !== 'string') return returns; // return straight away if path doesn't exist

		path = s.trim(path.replace(/\[(\w+)\]/g, '.$1'), '.'); // convert indexes to properties, and strip dots on each end
		var arr = path.split('.'); // separate to start solving vars
		var result = parent; // solving result

		for (var i = 0, total = arr.length; i < total; i++) {
			var key = arr[i];
			if (!(key in result)) return returns; // return undefined if not found
			result = result[key]; // but if we have stuff, keep going
		}

		return result; // return the result
	};

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

			var name = dependency_object ? dependency.name : dependency; // get the dependency name to output later
			var scope = dependency_object && dependency.scope ? dependency.scope : root; // get the scope

			if (!this.resolve(scope, '' + (dependency_object ? dependency.package : dependency))) {
				// `resolve` couldn't find the key deep enough,
				// so we'll either return false straight away or throw an exception!
				if (loud && dependency_mandatory) throw new CylinderException('Missing dependency "' + name + '"!');
				return false;
			}

			// if we reach this point, the dependency exists!
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
	this.extend(this, Backbone.Events); // add events

	/**
	 * Extends the framework's core with an object or the result of a callback.<br />
	 * If <code>mixOnInit</code> is true, then the framework won't be mixed until properly initialized.
	 *
	 * @param  {Function|Object} func        - The extension's constructor.
	 * @param  {Boolean}         [mixOnInit] - If true, the framework will only add 'func' after 'init' is called.
	 * @return {Mixed} Returns the result of 'func' after evaluated.
	 *
	 * @example
	 * Cylinder.mix(function (cl) {
	 *     var extension = {};
	 *     extension.abc = 123;
	 *     extension.dfg = 456;
	 *     return extension;
	 * });
	 *
	 * console.log(Cylinder.abc); // 123
	 * console.log(Cylinder.dfg); // 456
	 */
	this.mix = function (func, mixOnInit) {
		if (!initialized && mixOnInit) {
			if (!_.contains(extensions, func)) extensions.push(func); // add extension to cache
			return instance; // return the framework instance!
		}

		if (typeof func == 'function') func = func(instance); // run the function first...
		if (arguments.length < 3 || arguments[2] === true) instance.trigger('mix', func); // trigger an event for when mixed...
		instance.extend(instance, func); // add it to the framework...
		return func; // and return the object itself!
	};

	/**
	 * Extends the framework with a specific named module.<br />
	 * The module won't be added until the framework is properly initialized.
	 * When, or if, <code>initialize()</code> is called, then the module will be added as well.
	 *
	 * @param  {String}   name - The module's name.
	 * @param  {Function} func - The module's constructor.
	 * @return {Any} Returns the result of 'func' after evaluated.
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
		instance.mix(obj, true, false); // add it to the framework...
		instance.trigger('module', name, result); // trigger a global event for when mixed...
		instance.trigger('module:' + name, result); // trigger a specific event for when mixed...
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
	 * Keep in mind that modules will be initialized before any extensions whose <code>mixOnInit</code> property is true.<br />
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
				instance.mix(func);
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
