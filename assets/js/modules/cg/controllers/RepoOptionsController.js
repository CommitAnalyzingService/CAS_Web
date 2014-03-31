angular.module('cg').controller('RepoOptionsController', function($scope) {
	
	$scope.downloadDump = function() {
		$scope.globalMessages.push({
			type:'warning',
			content: 'Not implimented yet...'
		});
	};
	$scope.setPredictionModel = function() {
		$scope.globalMessages.push({
			type:'warning',
			content: 'Also not implimented yet...'
		});
	};
});