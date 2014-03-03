angular.module('cg').directive('repositoryListing', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			items:'=repositoryListing',
		},
		template: '<a href="/repo/{{item.name}}" class="list-group-item" ng-repeat="item in items">' +
			'<h4 class="list-group-item-heading">{{item.name}}</h4>' +
			'<p class="list-group-item-text">' +
			'	<span ng-if="item.status != \'Analyzed\'">Current Status: {{item.status}}</span><span ng-if="item.analysis_date.length > 0">Last Analyzed: {{item.analysis_date | timeFormat_fromNow}}</span>' +
			'</p>' +
		'</a>'
	};
});