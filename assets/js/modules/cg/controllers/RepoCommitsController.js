angular.module('cg').controller('RepoCommitsController', function($scope, socket, commitData, $stateParams, $location) {
    
    $scope.commits = commitData;
	
    $scope.display = {
    	type: $stateParams.type || 'historical',
    	metricKey: 'median',
        sort: $stateParams.sort || '-time'
    };
	
	var handleCommitSearch = function(newValue, oldValue) {
        
        if(newValue === oldValue) {
            return;
        }
        
		var criteria = angular.extend({}, $scope.search);
        
        criteria.page = ($scope.currentPage == 0)? null : $scope.currentPage + 1;
        criteria.limit = ($scope.pageSize == 20)? null : $scope.pageSize;
        criteria.type = ($scope.display.type == "historical")? null : $scope.display.type;
        criteria.sort = ($scope.display.sort == "-time")? null : $scope.display.sort;
        var criteraCount = 0;
        for(var key in criteria) {
            if(criteria[key] === null || criteria[key] === "") {
                delete criteria[key];
            } else if(key != 'page' && key != 'limit') {
                criteraCount++;
                criteria[key] = criteria[key];
            }
        }
        
        if(criteria.page != null && criteraCount > 0 && newValue[1] == oldValue[1]) {
            delete criteria.page;
        }
        
        $location.search(criteria);
	};
    
    // Remove any commits older than three months if in predictive mode
    $scope.$watch('display.type', function(newVal, oldVal) {
    	if(newVal === 'predictive') {
    		$scope.display.metricKey = "glmc";
    		$scope.show_commit_body = false;
    	} else if($scope.displayAfterTimestamp != 0) {
    		$scope.display.metricKey = "median";
    		$scope.show_commit_body = false;
    	}
    });

    $scope.search = angular.extend({}, $stateParams);
    delete $scope.search.name;
    delete $scope.search.limit;
    delete $scope.search.page;
    delete $scope.search.sort;
    delete $scope.search.type;

    var criteriaCount = 0;
    for(var key in $scope.search) {
        if($scope.search[key] === null) {
            $scope.search[key] = "";
        } else {
            criteriaCount++;
        }
    }

    if(criteriaCount > 0) {
        $scope.showFilterCommits = true;
    }
	//handleCommitSearch();
	
    $scope.currentPage = $stateParams.page - 1 || 0;
    $scope.pageSize = $stateParams.limit || 20;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.repo.commitCounts.total/ $scope.pageSize);                
    };
    
	$scope.$watch('[display, currentPage, pageSize]', handleCommitSearch, true);
    
    $scope.handleCommitSearch = handleCommitSearch.bind(null, 0, 1);
	
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
    if($scope.repo.metrics.glmc == null || !$scope.repo.metrics.glmc.hasOwnProperty("repo")) {
    	$scope.display_type_options = $scope.display_type_options.splice(0, 1);
    }
    
    $scope.ms_filter = '';
});
