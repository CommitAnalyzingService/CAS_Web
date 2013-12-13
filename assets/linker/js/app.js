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
    $routeProvider.when('/repo/:name', {templateUrl: 'repository.html', controller: 'RepoCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);


app.controller('AppCtrl', function ($scope, $location, socket) {
	$scope.globalMessages = [];
	$scope.quickActions = {
			quickAddRepo: function() {
				if(this.repo_url) {
					socket.post('/repository/create',{url: this.repo_url}, function (response) {
						console.log(response);
						if(response.success) {
							$scope.$apply(function() {
								$location.path('/repo/'+response.repo.name);
							});
						} else {
							alert('Repo does not exist');
						}
					});
				}
			},
			repo_url: ''
	};
	socket.get('/home/data', function (response) {
		$scope.$apply(function () {
			$scope.items = response;
		});  
	});
	socket.on('message', function messageReceived(message) {
	      console.log('New comet message received :: ', message);
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
		$scope.$apply(function() {
			if(typeof response.repoStatus != 'undefined') {
				if(response.repoStatus=='notfound') {
					$scope.error = true;
					$scope.globalMessages.push({
						type:"danger",
						content:'Repository does not exist.'
					});
					$location.path('/repos');
				} else {
					$scope.repo = response.repo;
					$scope.repoStatus = response.repoStatus;
					$scope.loaded = true;
					$scope.commits = $scope.repo.commits;
				}
			} else {
				$scope.globalMessages.push({
					type:"danger",
					content:'Something went wrong when trying to load the repository.'
				});
				$location.path('/repos');
			}
		});
	});
	$scope.$watchCollection('search', function(search) {
		$scope.currentPage = 0;
		$scope.commits = $filter('filter')($scope.repo.commits, search.fulltext);
	});
	$scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.commits.length/$scope.pageSize);                
    }
});


function HomeCtrl($scope, socket) {
	$scope.test ="hi";
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