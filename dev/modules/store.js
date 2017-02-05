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
