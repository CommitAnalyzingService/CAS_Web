/**
 * SimpleCache
 * 
 * @author Ben Grawi <bjg1568@rit.edu>
 * @date April 2014
 * @desc Simply hold values in memory
 */

/**
 * Holds values in memory by key
 * @constructor
 */
function SimpleCache() {
	this.cache = {};
};

/**
 * Puts an item in the cache and will overwrite if neccessary
 * @param key {string} - the key
 * @param value {any} - the value
 */
function put(key, value) {
	this.cache[key] = value;
}

/**
 * Gets an item from the cache. If it does not exist then will return null
 * @param key {string} - the key
 * @returns {any|null} - the result
 */
function get(key, value) {
	if(this.cache.hasOwnProperty(key)) {
		return this.cache[key];
	} else {
		return null;
	}
}

SimpleCache.prototype.put = put;
SimpleCache.prototype.get = get;
module.exports = new SimpleCache();
