angular.module('minChart', []);
angular.module('minChart').directive('mcBarRangeChart', function() {
	
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			data:'=mcBarRangeChart',
		},
		templateUrl: '/ui/minChart/mcBarRangeChart.html',
		link: {
			pre: function(scope, elm, attrs) {
				if(scope.data) {
					console.log(scope.data);
					var scale = scope.data.scale;
					
						function getPercent(value) {
							return Math.round((value / scale ) * 100) + '%';
						}
					
					scope.ranges = [];
					
					for(var i = 0; i < scope.data.ranges.length; i++) {
						var range = scope.data.ranges[i];
						scope.ranges[i] = {
							label: /*range.label + ': '*/ + range.value,
							style: {
								top: getPercent(range.value),
								color: range.color
							}
						};
					}
					
					scope.barStyle = {
						height: getPercent(scope.data.data.value),
						'background-color': scope.data.data.color 
					};
					console.log(scope.barStyle, scope.ranges);
				} else {
					console.log(scope.$parent.metricKey);
				}
			}, 
		}
	};
});