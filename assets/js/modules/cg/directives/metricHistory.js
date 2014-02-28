angular.module('cg').directive('metricHistory', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			metricHistory:'=',
			size: '@'
		},
		template: '<canvas linechart data="data" options="options" height="height" width="width"></canvas>',
		link: {
			pre: function(scope, elm, attrs) {
				//scope.data = {}
				scope.data = {
					labels: scope.metricHistory.ids,
					datasets: [
					{
						data: scope.metricHistory.values.quality,
						fillColor: 'rgba(223, 240, 216, .5)',
						strokeColor: 'rgba(223, 240, 216, 1)',
						pointColor: 'rgba(223, 240, 216, 1)',
						pointStrokeColor: '#fff'
					}]
				};
				if(!scope.size) {
					scope.height = 160;
					scope.width = 200;
				} else {
					scope.height = + scope.size / 1.25;
					scope.width = + scope.size;
				}
				scope.options = {};
			}, post: function(scope) {
				scope.$broadcast('startDraw');
			}
			
		}
	};
});