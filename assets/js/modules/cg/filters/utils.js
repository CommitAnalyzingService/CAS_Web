angular.module('cg')

/**
 * Calculates the percent of a total
 */
.filter('percentof', function() {
	return function(input, total) {
		return Math.round((+input) / (+total) * 100);
	};
})

/**
 * Rounds to the correct number of places
 */
.filter('round', function() {
	return function(input, places) {
		if(typeof places == 'undefined')
			places = 100;
		else
			places = Math.pow(10, places);
		return Math.round(input * places) / places;
	};
})

/**
 * Starts an array from a certain index
 */
.filter('startFrom', function() {
	return function(input, start) {
		start = +start; // parse to int
		return input.slice(start);
	};
})

/**
 * Capitializes the first letter of a string
 */
.filter('capitalizeFirst', function() {
	return function(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	};
})

/**
 * Converts a decimal to a percent and rounds it to the nearest whole number
 */
.filter('decimalToPercent', function($filter) {
	
	var roundFn = $filter('round');
	
	return function(input) {
		return roundFn(input * 100, 0) + '%';
	};
})

/**
 * Sorts metrics by their significance
 */
.filter('sortBySignificance', function($filter) {
	
	var orderByFilter = $filter('orderBy');
	
	return function(input, lookup) {
		return orderByFilter(input, function(key) {
			return -lookup[key + '_sig'];
		});
	};
});