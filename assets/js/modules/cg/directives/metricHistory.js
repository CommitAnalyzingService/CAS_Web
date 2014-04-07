angular.module('cg').directive('metricHistory', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			metricHistory:'=',
			type: '='
		},
		template: '<canvas linechart data="data" options="options" height="height" width="width"></canvas>',
		link: {
			pre: function(scope, elm, attrs) {
				//scope.data = {}
				
				scope.$watch('type', function(type) {
					scope.data = {
						labels: scope.metricHistory.ids,
						datasets: [
						{
							data: scope.metricHistory.values[scope.type],
							fillColor: 'rgba(223, 240, 216, .5)',
							strokeColor: 'rgba(223, 240, 216, 1)',
							pointColor: 'rgba(223, 240, 216, 1)',
							pointStrokeColor: '#fff'
						}]
					};
				});
				scope.height = 300;
				scope.width = null;
				scope.options = {
					scaleOverride: true,
					scaleSteps: 10,
					scaleStepWidth: .1,
					scaleStartValue: 0,
					scaleLabel : "<%=value * 100%>%"
				};
			}, post: function(scope) {
				scope.$broadcast('startDraw');
			}
			
		}
	};
});