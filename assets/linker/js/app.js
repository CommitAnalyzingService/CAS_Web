/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */

var app = angular.module('casweb', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.defaults.headers.common['X-Request-Origin'] = 'app';
    $routeProvider.when('/', {templateUrl: '/', controller: 'HomeCtrl'});
    $routeProvider.when('/repos', {templateUrl: '/repository'});
    $routeProvider.when('/repo/:name', {templateUrl: '/ui/repository/find.html', controller: 'RepoCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);


app.controller('AppCtrl', function ($scope, $location, $timeout, socket) {
	$scope.globalMessages = {
			_messages: [],
			push: function(elm) {
				$scope.globalMessages._messages.push(elm);
				$timeout(function() {
					$scope.globalMessages.shift();
				},3000);
			},
			shift: function() {
				$scope.globalMessages._messages.shift();
			},
			remove: function(index) {
				$scope.globalMessages._messages.splice(index, 1);
			},
			count: function() {
				return $scope.globalMessages._messages.length;
			},
			get: function() {
				return $scope.globalMessages._messages;
			}
	};
	socket.on('message', function messageReceived(message) {
	      console.log('New comet message received :: ', message);
	});
	
	socket.get('/home/data', function (response) {
		$scope.$apply(function () {
			$scope.items = response;
		});  
	});
});

app.controller('NavbarCtrl', function ($scope, $location) {
	$scope.currentPage = function (uri) { 
        var path = $location.path().split('/');
        return path[1] == uri.substr(1);
    };
    $scope.collapse = 0;
});

app.controller('RepoCtrl', function($scope, $routeParams, socket, $filter, $location) {
	$scope.repo = {
		name: $routeParams.name + "..."	
	};
	$scope.search = {fulltext:''};
	$scope.loaded = false;
	$scope.repoStatus = '';
	$scope.repo = {};
	$scope.commits = [];
	socket.get('/repository/' + $routeParams.name, function(response) {
		//console.log(response);
		if(response.success) {
			$scope.$apply(function() {
				$scope.repo = response.repo;
				$scope.loaded = true;
				$scope.commits = $scope.repo.commits;
				$scope.showRepo = ($scope.commits.length > 0 && $scope.repo.analysis_date != '');
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
	$scope.$watchCollection('search', function(search) {
		$scope.currentPage = 0;
		$scope.commits = $filter('filter')($scope.repo.commits, search.fulltext);
	});
	
	$scope.updateEmail = function() {
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
	};
	
	$scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.commits.length/$scope.pageSize);                
    }
});


function HomeCtrl($scope, socket, $location) {
	$scope.quickActions = {
			repo_url:'',
			repo_email: '',
			quickAddRepo: function() {
				if($scope.quickAddForm.$valid) {
					socket.post('/repository/create',{url: this.repo_url, email: this.repo_email}, function (response) {
						console.log(response);
						if(response.success) {
							$scope.$apply(function() {
								$location.path('/repo/'+response.repo.name);
							});
						} else {
							$scope.globalMessages.push({
								type: 'danger',
								content: 'Cannot create repository: ' + response.error
							});
						}
					});
				}
			},
			repo_url: ''
	};
}
app.directive('metric', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			metric:'='
		},
		template: '<div class="alert" ng-class="threshold" ng-bind="metric.value | round"></div><div ng-transclude></div>',
		link: {
				pre: function(scope, elm, attrs) {
					if(scope.metric.threshold > 0 ) scope.threshold="alert-danger";
					else if(scope.metric.threshold < 0 ) scope.threshold="alert-success";
					else scope.threshold="alert-warning";
				}
		}
	};
});
app.factory('socket', function ($rootScope) {
	  var socket = io.connect();
	  return socket;
	  /*
	  return {
	    on: function (eventName, callback) {
	      socket.on(eventName, function () {  
	        var args = arguments;
	        $rootScope.$apply(function () {
	          callback.apply(socket, args);
	        });
	      });
	    },
	    emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
	  };*/
	});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
app.filter('round', function() {
    return function(input,places) {
    	if(typeof places == 'undefined') places = 100;
    	else places = Math.pow(10, places);
        return Math.round(input*places)/places;
    }
});