angular.module('cg').directive('containsBug', function() {
	return {
		restrict: 'A',
		transclude:true,
		template: '<canvas scroll-activate="data = staged_data" doughnutchart data="data" options="options" height="height" width="width"></canvas>',
		link: {
			pre: function(scope, elm, attrs) {
				scope.staged_data = [{
					value: scope.repo.metrics.history.totals.contains_bug,
					color: 'rgb(242, 222, 222)'
				},
				{
					value: scope.repo.metrics.history.totals.count - scope.repo.metrics.history.totals.contains_bug,
					color: 'rgb(223, 240, 216)'
				}];
				if(!scope.size) {
					scope.height = 160;
					scope.width = 200;
				} else {
					scope.height = + scope.size / 1.25;
					scope.width = + scope.size;
				}
				scope.data = [];
				scope.options = {};
			}
		}
	};
});