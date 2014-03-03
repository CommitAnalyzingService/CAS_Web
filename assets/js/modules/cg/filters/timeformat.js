angular.module('cg')

/**
 * Show how long ago something happend
 */
.filter('timeFormat_fromNow', function(moment) {
	return function(input) {
		return moment(input).fromNow();
	};
});