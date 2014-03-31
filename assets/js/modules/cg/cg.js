angular.module('cg', [ 'ui.router', 'ngAnimate', 'angles' ])
/**
 * Define the configuration for the commit guru application
 */
.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
		url: '/',
		templateUrl: '/ui/home/index.html',
		controller: 'HomeController',
		resolve: {
			status: function() {
				return {statusCode: 200};
			}
		}
	}).state('home.404', {
		url: '404',
		templateUrl: '/ui/home/index.html',
		controller: 'HomeController',
		onEnter: function(status) {
			status.statusCode = 404;
		}	
	}).state('about', {
		url: '/about',
		templateUrl: '/ui/home/about.html',
		controller: function() {},
	}).state('repos', {
		url: '/repos',
		templateUrl: '/ui/repository/index.html'
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
		url: '/options',
		templateUrl: '/ui/repository/options.html',
		controller: 'RepoOptionsController'
	});
	$urlRouterProvider.otherwise('/404');
	$locationProvider.html5Mode(true);
});
