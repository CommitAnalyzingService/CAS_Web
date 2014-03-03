angular.module('cg').filter('percentof', function() {
	return function(input, total) {
		return Math.round((+input) / (+total) * 100);
	};
}).filter('round', function() {
	return function(input, places) {
		if(typeof places == 'undefined')
			places = 100;
		else
			places = Math.pow(10, places);
		return Math.round(input * places) / places;
	};
}).filter('startFrom', function() {
	return function(input, start) {
		start = +start; // parse to int
		return input.slice(start);
	};
});