angular.module('cg').controller('RepoController', function($scope, $state, $stateParams, socket, messageHandler, repoData) {
	$scope.metricValues = {
			ns: "# of modified subsystems",
			nd: "# of modified directories",
			nf: "# of modified files",
			entrophy: "Entrophy (distribution)",
			la: "Lines added",
			ld: "Lines deleted",
			lt: "Total lines",
			ndev: "# of devs contributing",
			age: "Age from last change",
			nuc: "# of unique changes",
			exp: "Dev experience",
			rexp: "Recent dev experience",
			sexp: "Subsystem dev experience",	
	};
	var registerMH = messageHandler.controllerRegister($scope);
	
	$scope.repo = repoData;
	$scope.showRepo = ($scope.repo.commits.length > 0 && $scope.repo.analysis_date != '');
	if(!$scope.showRepo) {
		registerMH({
			model: 'repository',
			verb: 'update',
			id: $scope.repo.id,
			callback: function(data) {
				if(data.hasOwnProperty('status')) {
					if($scope.repo.status != 'Analyzed' && data.status == 'Analyzed') {
						var current = $state.current;
			            var params = angular.copy($stateParams);
			            $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
					}
				}
				$scope.repo = angular.extend($scope.repo, data);
			}
		});
	}
	/*
	socket.get('/repository/' + $stateParams.name, function(response) {
	
		if(response.success) {
			$scope.$apply(function() {
				$scope.repo = response.repo;
				$scope.loaded = true;
				handleCommitSearch();
				$scope.showRepo = ($scope.commits.length > 0 && $scope.repo.analysis_date != '');
				//if(!$scope.showRepo) {					
					registerMH({
						model: 'repository',
						verb: 'update',
						id: $scope.repo.id,
						callback: function(data) {
							if(data.hasOwnProperty('status')) {
								if($scope.repo.status != 'Analyzed' && data.status == 'Analyzed') {
									$state.reload();
								}
							}
							$scope.repo = angular.extend($scope.repo, data);
						}
					});
				//}
			});
		} else {
			$scope.$apply(function() {
				$scope.error = true;
				$scope.globalMessages.push({
					type:"danger",
					content:'Repository does not exist.'
				});
				$location.path('/repos');
			});
		}
	});*/
});