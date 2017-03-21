'use strict';

module.exports = function (cylinder, module) {

	/**
	 * Utilities module for CylinderClass.
	 * @exports utils
	 */
	var utils = cylinder.extend({}, module);

	/**
	 * Transforms an object into a string.<br /><br />
	 * This method is based on the implementation from underscore.string.<br />
	 * <a target="_blank" href="https://github.com/epeli/underscore.string/blob/master/helper/makeString.js">https://github.com/epeli/underscore.string/blob/master/helper/makeString.js</a>
	 *
	 * @param  {Any}    obj - The object to transform.
	 * @return {String} The new string.
	 */
	utils.string = function (obj) {
		if (obj === null || obj === undefined) return '';
		return '' + obj;
	};

	/**
	 * Removes all HTML from a string.<br /><br />
	 * This method is based on the implementation from underscore.string.<br />
	 * <a target="_blank" href="https://github.com/epeli/underscore.string/blob/master/stripTags.js">https://github.com/epeli/underscore.string/blob/master/stripTags.js</a>
	 *
	 * @param  {String} str - The string to clean.
	 * @return {String} The string without HTML.
	 */
	utils.text = function (str) {
		return utils.string(str).replace(/<\/?[^>]+>/g, '');
	};

	/**
	 * Unserializes a string into an object.<br /><br />
	 * This method is based on the implementation by Bruce Kirkpatrick.<br />
	 * <a target="_blank" href="https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581">https://gist.github.com/brucekirkpatrick/7026682#gistcomment-1442581</a>
	 *
	 * @param  {String} str - The serialized object.
	 * @return {Object} The string, unserialized into an object.
	 */
	utils.unserialize = function (str) {
		var str = decodeURI(str);
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
	utils.query = function (key, serialized) {
		var query = serialized || window.location.search.substring(1);
		var vars = utils.unserialize(query);
		return key in vars ? vars[key] : null;
	};

	/**
	 * Clamps a numeric value.
	 *
	 * @param  {Number} min   - Minimum value.
	 * @param  {Number} value - Value to clamp.
	 * @param  {Number} max   - Maximum value.
	 * @return {Number} The final clamped value.
	 */
	utils.clamp = function (min, value, max) {
		return Math.max(min, Math.min(max, value));
	};

	/**
	 * Lerps between two given values.
	 *
	 * @param  {Number} start - Starting value.
	 * @param  {Number} end   - Ending value.
	 * @param  {Number} t     - Lerp progress, should be between 0 and 1.
	 * @return {Number} The final lerped value.
	 */
	utils.lerp = function (start, end, t) {
		return start + t * (end - start);
	};

	/**
	 * Lerps between the first two numeric values in an array.
	 *
	 * @param  {Number} arr - Array with numeric values.
	 * @param  {Number} t   - Lerp progress, should be between 0 and 1.
	 * @return {Number} The final lerped value.
	 */
	utils.vlerp = function (arr, t) {
		return utils.lerp(
			typeof arr[0] === 'number' ? arr[0] : 0,
			typeof arr[1] === 'number' ? arr[1] : 0,
			t
		);
	};

	return utils; // finish

};
