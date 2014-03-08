angular.module('cg').controller('RepoCommitsController', function($scope, socket, $filter) {
	
	var filterFilter = $filter('filter');
	
	var handleCommitSearch = function(search) {
		$scope.currentPage = 0;
		var commits = filterFilter($scope.repo.commits, $scope.search.fulltext);
		if(!$scope.search.merge) {
			commits = filterFilter(commits, {classification: "!merge"});
		}
		$scope.commits = commits;
	};

	$scope.search = {fulltext:'', merge: false};
	$scope.commits = [];
	handleCommitSearch();
	
	$scope.$watchCollection('search', handleCommitSearch);
	
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
    };
});