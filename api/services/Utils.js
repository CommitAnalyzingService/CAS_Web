/**
 * Utils.js
 * 
 * @author Ben Grawi <bjg1568@rit.edu>
 * @date November 2014
 * @desc The container for all of the utilities used around the site
 */
var node_uuid = require('node-uuid');
var moment = require('moment');

var Utils = {
	
	/**
	 * Creates a new UUID based on node_uuid version 4;
	 * @returns
	 */
	genUUID: function() {
		return node_uuid.v4();
	},
	
	/**
	 *  Collection of date-related utilities
	 */
	date: {
		
		/**
		 * The raw moment object
		 */
		moment: moment,
		
		/**
		 * A formated moment of the present
		 */
		now: function() {
			return moment().format('YYYY-MM-DD HH:mm:ss');
		}
	},
	
	/**
	 * A shortcut to return top-level utils
	 */
	get: function(name) {
		
		// Return false if the util does not exist
		if(name in Utils) {
			return Utils[name];
		} else {
			return false;
		}
	}
	
};

// Export the utils object
module.exports = Utils;