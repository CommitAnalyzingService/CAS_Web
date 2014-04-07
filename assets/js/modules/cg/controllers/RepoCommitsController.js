angular.module('cg').controller('RepoCommitsController', function($scope, socket, $filter, moment) {
	
	var filterFilter = $filter('filter');
	var orderByFilter = $filter('orderBy');
	
    $scope.display= {
    	type: 'historical',
    	metricKey: 'individual',
    	sortBy: 'time'
    };
    
    // Display filtering
    $scope.displayAfterTimestamp = 0;
    
    var displayAfterTimestampActive = +moment.utc()
    	.subtract('months', 3).format('X');
    
	var filterAfterTimestampFn = function(input) {
		return input['author_date_unix_timestamp'] > 
			$scope.displayAfterTimestamp;
	};
	
	var handleCommitSearch = function(search) {
		$scope.currentPage = 0;
		var criteria = {};
		
		// Check each search value and add it to the criteria if neccessary
		if(!!$scope.search.commit_message) {
			criteria.commit_message = $scope.search.commit_message;
		}
		if(!!$scope.search.commit_hash) {
			criteria.commit_hash = $scope.search.commit_hash;
		}
		if(!!$scope.search.classification) {
			criteria.classification = $scope.search.classification;
		}
		if(!!$scope.search.author_email) {
			criteria.author_email = $scope.search.author_email;
		}
		
		// Grab the raw commits
		var filterCommits = $scope.repo.commits;
		
		// Remove any older commits if in prediction mode
		if($scope.displayAfterTimestamp > 0) {
			filterCommits = filterFilter(filterCommits, filterAfterTimestampFn);
		}
		
		// Filter by the critera
		filterCommits = filterFilter(filterCommits, criteria);
		
		// If sorting by risk?
		if($scope.display.sortBy.substring(1) == "risk") {
			
			//Desending Sort?
			var modifier;
			if($scope.display.sortBy[0] == '-') {
				modifier = '-';
			} else {
				modifier = '';
			}
			
			var field;
			if($scope.display.type == 'predictive') {
				field = 'glm_probability';
			} else {
				field = 'metric_summary.above';
			}
			
			filterCommits = orderByFilter(filterCommits, modifier.field);
		}
		
		$scope.commits = filterCommits;
	};
    
    // Remove any commits older than three months if in predictive mode
    $scope.$watch('display.type', function(newVal, oldVal) {
    	if(oldVal !== newVal && newVal === 'predictive') {
    		$scope.displayAfterTimestamp = displayAfterTimestampActive;
    		$scope.display.metricKey = "glmc";
    		$scope.show_commit_body = false;
    	} else if($scope.displayAfterTimestamp != 0) {
    		$scope.displayAfterTimestamp = 0;
    		$scope.display.metricKey = "individual";
    		$scope.show_commit_body = false;
    	}
    });

	$scope.search = {message:'', classification: '', author: '', 
		commit_hash: ''};
	$scope.commits = [];
	handleCommitSearch();
	
	$scope.$watch('[search, display]', handleCommitSearch, true);
	
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
    
    $scope.display_type_options = [{
    	value: 'historical',
    	label: 'Historical Data'
    }, {
    	value: 'predictive',
    	label: 'Predictive Data'
    }];
    
    // Check if glmc has been calculated
    if($scope.repo.metrics.glmc == null) {
    	$scope.display_type_options = $scope.display_type_options.splice(0, 1);
    }
    
    $scope.ms_filter = '';
});