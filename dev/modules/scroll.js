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
