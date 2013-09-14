/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */

var app = angular.module('quorum', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.defaults.headers.common['X-Request-Origin'] = 'app';
    $routeProvider.when('/', {templateUrl: 'home/content', controller: 'HomeCtrl'});
    $routeProvider.when('/admin', {templateUrl: '/admin', controller: 'AdminCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);
function HomeCtrl($scope, socket) {
	$scope.test ="hi";
	$scope.activeItems = [
	                      "Newer Drink Machine!",
	                      "Doodledoo",
	                      "Testing",
	                      "Whoopie",
	                      "Testing",
	                      "Whoopie",
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      ];
	socket.get('/home/data', function (response) {
		$scope.$apply(function () {
			$scope.activeItems = response;
        });
		  
	});
	socket.on('message', function messageReceived(message) {
	      console.log('New comet message received :: ', message);
	});
}
function AdminCtrl($scope) {
	$scope.activeItems = [
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      "Testing",
	                      "Whoopie"
	                      ];
}

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