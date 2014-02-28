angular.module('cg').directive('debug', function() {
	return {
		restrict: 'E',
		scope: {
			val: '='
		},
		template: '<pre>{{val | json}}</pre>'
	};
});