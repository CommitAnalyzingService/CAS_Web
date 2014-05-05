angular.module('cg').directive('commitPagination', function() {
	return {
		restrict: 'A',
		template: '<div class="form-group">' +
			'<button class="btn btn-default" ng-disabled="currentPage == 0" ng-click="currentPage=currentPage-1">Previous</button>' +
			' {{currentPage+1}}/{{numberOfPages()}} ' +
			'<button class="btn btn-default" ' + /*ng-disabled="currentPage >= commits.length/pageSize - 1"*/ ' ng-click="currentPage=currentPage+1">Next</button>' +
			'</div>'
	};
});