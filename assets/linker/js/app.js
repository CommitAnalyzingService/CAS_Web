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
	
	socket.get('/home/data', function (response) {
		$scope.$apply(function () {
			$scope.items = response;
		});  
	});
});

app.service('messageHandler', function(socket) {

	// A simple array remove tool preparing to be scoped when a handler is register 
	var unregister = function(callback_ptr) {
		this.splice(this.indexOf(callback_ptr), 1);
	},
	
	// Init the mH, short for messageHandler because it is used so much
	mH = {
		_handlers: {}
	};
	
	/**
	 * Register a message handler
	 * @param options Object{model, id, verb} The conditions to listen for
	 * @param callback() Function What to execute when the conditions are met from a message
	 */
	mH.register = function(options, callback) {
		
		// Traverse the model -> id -> verb tree
		// and create any node that hasn't already been created.
		if(mH._handlers.hasOwnProperty(options.model)) {
			if(mH._handlers[options.model].hasOwnProperty(options.id)) {
				if(mH._handlers[options.model][options.id].hasOwnProperty(options.verb)) {
					mH._handlers[options.model][options.id][options.verb].push(callback);
				} else {
					mH._handlers[options.model][options.id][options.verb] = [callback];
				}
			} else {
				mH._handlers[options.model][options.id] = {};
				mH._handlers[options.model][options.id][options.verb] = [callback];
			}
		} else {
			mH._handlers[options.model] = {};
			mH._handlers[options.model][options.id] = {};
			mH._handlers[options.model][options.id][options.verb] = [callback];
		}
		
		// Use the power of Function.bind to scope the unregister function in 
		// the callback queue for that verb
		callback.unregister = unregister.bind(mH._handlers[options.model][options.id][options.verb], callback);
		return callback.unregister;
	},
	
	/**
	 * Handle an incoming message from the websocket
	 * @param message Object The incoming message
	 */
	mH.handle = function(message) {
		
		// Traverse the model -> id -> verb tree and look for any handlers
		if(mH._handlers.hasOwnProperty(message.model)) {
			if(mH._handlers[message.model].hasOwnProperty(message.id)) {
				if(mH._handlers[message.model][message.id].hasOwnProperty(message.verb)) {
					var callbacks = mH._handlers[message.model][message.id][message.verb];
					// Loop through the found callbacks and execute them
					for(var i = 0, l = callbacks.length; i < l; i ++) {
						
						// If a callback returns false, stop executing the
						// other callbacks as a safety (much like events)
						if(!callbacks[i](message.data)) {
							break;
						}
					}
				}
			}
		}
		
		// Silently ignore any messages without handlers for now.
	};
	
	// Here is where we actually listen to the socket
	socket.on('message', mH.handle);
	
	// Return a simple abstraction for registering, and provide an easy way to
	// keep registration in the lifetime of a controller.
	return {
		register: mH.register,
		controllerRegister: function(scope) {
			// Keep track of the callbacks assigned
			var handler_callbacks = [];
			
			// If controller is deleted, unregister each of the callbacks
			scope.$on("$destroy", function(){
				for(var i = 0; i < handler_callbacks.length; i++) {
					handler_callbacks[i].unregister();
				}
		    });
			
			// Return a re-usable function
			return function(handler) {
				
				// Prepare the callback to be run inside a digest loop
				var handler_callback = function(data) {
					scope.$apply(function() {
						handler['callback'](data);
					});
				};
				
				// Remember the callback so it can be unregistered later
				handler_callbacks.push(handler_callback);
				
				// Register the handler and it's callback, return the
				// unregister method of the callback
				return mH.register(handler, handler_callback);
			};
		}
	};
});

app.controller('NavbarCtrl', function ($scope, $location) {
	$scope.currentPage = function (uri) { 
        var path = $location.path().split('/');
        return path[1] == uri.substr(1);
    };
    $scope.collapse = 0;
});

app.controller('RepoCtrl', function($scope, $routeParams, socket, $filter, $location, $route, messageHandler) {
	$scope.repo = {
		name: $routeParams.name + "..."	
	};
	var registerMH = messageHandler.controllerRegister($scope);
	$scope.search = {fulltext:''};
	$scope.loaded = false;
	$scope.repoStatus = '';
	$scope.repo = {};
	$scope.commits = [];
	socket.get('/repository/' + $routeParams.name, function(response) {
	
		if(response.success) {
			$scope.$apply(function() {
				$scope.repo = response.repo;
				$scope.loaded = true;
				$scope.commits = $scope.repo.commits;
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