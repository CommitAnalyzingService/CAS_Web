angular.module('cg').directive('commitPagination', function() {
	return {
		restrict: 'A',
		template: '<div class="form-group">' +
			'<button class="btn btn-default" ng-disabled="currentPage == 0" ng-click="currentPage=currentPage-1">Previous</button>' +
			' Page {{currentPage+1}} ' +
			'<button class="btn btn-default" ' + 'ng-disabled="commits.length < pageSize" ' + ' ng-click="currentPage=currentPage+1">Next</button>' +
			'</div>'
	};
});