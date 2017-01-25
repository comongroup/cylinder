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
