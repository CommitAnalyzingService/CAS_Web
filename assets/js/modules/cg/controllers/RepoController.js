angular.module('cg').controller('RepoController', function($scope, $routeParams, socket, $filter, $location, $route, messageHandler) {
	$scope.repo = {
		name: $routeParams.name + "..."	
	};
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
	$scope.search = {fulltext:'', merge: false};
	$scope.loaded = false;
	$scope.repoStatus = '';
	$scope.repo = {};
	$scope.commits = [];
	socket.get('/repository/' + $routeParams.name, function(response) {
	
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
									$route.reload();
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
	});
	
	var filterFilter = $filter('filter');
	
	var handleCommitSearch = function(search) {
		$scope.currentPage = 0;
		var commits = filterFilter($scope.repo.commits, $scope.search.fulltext);
		if(!$scope.search.merge) {
			commits = filterFilter(commits, "!merge");
		}
		$scope.commits = commits;
	};
	
	$scope.$watchCollection('search', handleCommitSearch);
	
	/*$scope.updateEmail = function() {
		if($scope.repo.email != null && $scope.repo.email.length > 0) {
			socket.put('/repository/' + $routeParams.name, {email:$scope.repo.email}, function(response) {
				$scope.$apply(function() {
					if(response.success) {
						$scope.globalMessages.push({
							type:'success',
							content:'Saved! You will now receive an email when your repository gets analyzed.'
						});
					} else {
						$scope.globalMessages.push({
							type:'danger',
							content:'There was an error in updating your email.'
						});
					}
				});
			});
		} else {
			$scope.globalMessages.push({
				type:'danger',
				content:'Please enter a valid email.'
			});
		}
	};*/
	
	$scope.submitFeedback = function(commit) {
		if(commit.feedback.$valid) {
			socket.post('/feedback/submit/' + commit.commit_hash, {
				score: commit.feedback.score,
				comment: commit.feedback.comment
			}, function(response) {
				$scope.$apply(function() {
					if(response.success) {
						$scope.globalMessages.push({
							type: 'success',
							content: 'Thanks for your feedback!'
						});
					} else {
						$scope.globalMessages.push({
							type:'danger',
							content:'There was an error in submiting your feedback'
						});
					}
				});
			});
		} else {
			$scope.globalMessages.push({
				type: 'danger',
				content: 'Please at least submit either a thumbs up or thumbs down'
			});
		}
	};
	
	$scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.commits.length/$scope.pageSize);                
    }
});