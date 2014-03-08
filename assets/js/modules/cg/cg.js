angular.module('cg', [ 'ui.router', 'ngAnimate', 'angles' ])
/**
 * Define the configuration for the commit guru application
 */
.config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
	$httpProvider.defaults.headers.common['X-Request-Origin'] = 'app';
	$stateProvider.state('home', {
		url: '/',
		templateUrl: '/',
		controller: 'HomeController'
	}).state('repos', {
		url: '/repos',
		templateUrl: '/repository'
	}).state('repo', {
		abstract: true,
		url: '/repo/:name',
		templateUrl: '/ui/repository/find.html',
		controller: 'RepoController',
		resolve: {
			repoData: function($stateParams, repoLoader) {
				return repoLoader($stateParams.name);
			}
		}
	}).state('repo.overview', {
		url: '',
		templateUrl: '/ui/repository/overview.html',
	}).state('repo.commits', {
		url: '/commits',
		templateUrl: '/ui/repository/commits.html',
		controller: 'RepoCommitsController'
	}).state('repo.options', {
		url: '/settings',
		templateUrl: '/ui/repository/options.html',
	});
	$urlRouterProvider.otherwise('/');
	$locationProvider.html5Mode(true);
});
