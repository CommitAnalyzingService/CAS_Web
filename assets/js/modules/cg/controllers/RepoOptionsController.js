angular.module('cg').controller('RepoOptionsController', function($scope, $window) {
	
	$scope.downloadDump = function() {
		$window.location = "http://data.commit.guru/dumps/" + $scope.repo.id + ".csv";
	};
});