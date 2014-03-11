angular.module('cg').controller('RepoCommitsController', function($scope, socket, $filter) {
	
	var filterFilter = $filter('filter');
	
	var handleCommitSearch = function(search) {
		$scope.currentPage = 0;
		var criteria = {};
		if(!!$scope.search.commit_message) {
			criteria.commit_message = $scope.search.commit_message;
		}
		if(!!$scope.search.classification) {
			criteria.classification = $scope.search.classification;
		}
		if(!!$scope.search.author_email) {
			criteria.author_email = $scope.search.author_email;
		}
		$scope.commits = 
			filterFilter($scope.repo.commits, criteria);
	};

	$scope.search = {message:'', classification: '', author: ''};
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
    $scope.pageSize = 20;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.commits.length/$scope.pageSize);                
    };
    
    $scope.show_commit_body = false;
    $scope.show_commit_body_options = [{
    	value: false, 
    	label: "Headings Only"
    },{
    	value: true, 
    	label: "Full Details"
    }];
    $scope.ms_filter = '';
});