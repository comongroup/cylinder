/**
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
		// if so, check if the module exists, and return it!
		if (_.isUndefined(ctor) || _.isNull(ctor)) {
			if (initialized && _.has(controllers, name)) return controllers[name].instance;
			return null;
		}

		controllers[name] = { constructor: ctor, instance: {} }; // add module to cache
		if (!initialized) return controllers[name].instance; // return the framework instance!

		controllers[name].instance = typeof ctor == 'function' // initialize controller...
			? ctor(instance, controllers[name].instance) // run constructor
			: _.extend(controllers[name].instance, ctor); // it's an object, so just extend it
		instance.trigger('controller', name, controllers[name].instance); // trigger an event for when extended...
		return controllers[name].instance; // and return the module itself!
	};

	/**
	 * Returns a list of existing controllers.
	 * @return {Array}
	 */
	instance.controllers = function () {
		var result = {};
		_.each(controllers, function (ctrl, name) {
			result[name] = ctrl.instance;
		});
		return result;
	};

	/**
	 * Properly initializes Cylinder's controllers.<br />
	 * This method is based on jQuery's <code>$(document).ready()</code> shorthand.
	 *
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

			// run callback, if it's a method!
			if (_.isFunction(callback)) callback(instance);

			// call event so that the app can finish stuff!
			// this will be assyncronous!
			instance.trigger('initcontrollers', instance);
		});

		// return the instance itself because the programmer
		// will be able to customize the short tag!
		return instance;
	};

	return instance;

};
