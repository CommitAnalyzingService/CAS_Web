angular.module('cg', [ 'ngRoute', 'ngAnimate', 'angles' ]).config(
	[ '$routeProvider', '$locationProvider', '$httpProvider',
		function($routeProvider, $locationProvider, $httpProvider) {
			$httpProvider.defaults.headers.common['X-Request-Origin'] = 'app';
			$routeProvider.when('/', {
				templateUrl: '/',
				controller: 'HomeController'
			});
			$routeProvider.when('/repos', {
				templateUrl: '/repository'
			});
			$routeProvider.when('/repo/:name', {
				templateUrl: '/ui/repository/find.html',
				controller: 'RepoController'
			});
			$routeProvider.otherwise({
				redirectTo: '/'
			});
			$locationProvider.html5Mode(true);
		} ]);
