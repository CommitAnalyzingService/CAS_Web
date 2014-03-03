angular.module('cg').controller('NavbarController', function($scope, $location) {
	$scope.currentPage = function(uri) {
		var path = $location.path().split('/');
		return path[1] == uri.substr(1);
	};
	$scope.collapse = 0;
});