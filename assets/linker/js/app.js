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
function HomeCtrl($scope) {
	$scope.test ="hi";
	$scope.activeItems = [
	                      "Newer Drink Machine",
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
}
function AdminCtrl($scope) {
	$scope.activeItems = [
	                      "Newer Drink Machine",
	                      "Doodledoo",
	                      "Testing",
	                      "Whoopie"
	                      ];
}

