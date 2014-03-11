angular.module('cg')

/*
 * Angularize moment-js.
 */
.factory('moment', function($window) {
	// TODO: This needs to be a *little* better
	return $window.moment;
});