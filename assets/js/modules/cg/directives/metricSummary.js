angular.module('cg').directive('metricSummary', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			metricSummary:'=',
			size: '@'
		},
		template: '<canvas scroll-activate="data = staged_data" doughnutchart data="data" options="options" height="height" width="width"></canvas>',
		link: {
			pre: function(scope, elm, attrs) {
				scope.staged_data = [{
					value: scope.metricSummary.below,
					color: 'rgb(223, 240, 216)'
				},
				{
					value: scope.metricSummary.between,
					color: 'rgb(252, 248, 227)'
				},
				{
					value: scope.metricSummary.above,
					color: 'rgb(242, 222, 222)'
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