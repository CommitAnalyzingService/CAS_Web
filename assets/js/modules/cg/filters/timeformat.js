angular.module('cg')

/**
 * Show how long ago something happend
 */
.filter('timeFormat_fromNow', function(moment) {
	return function(input) {
		return moment(input).fromNow();
	};
})

/**
 * Format a calendar date
 */
.filter('timeFormat_calendar', function(moment) {
	return function(input) {
		return moment(input).calendar();
	};
}).filter('timeFormat_calendar', function(moment) {
	return function(input) {
		return moment(input).format("MMMM Do YYYY, h:mm a");
	};
});