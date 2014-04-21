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
				
				var reload = function() {
					if(scope.data) {
						var scale = Math.round(scope.data.scale * 100) / 100;
						
						function getPercent(value) {
							return Math.round((value / scale ) * 100);
						}
						
						scope.ranges = [];
						
						for(var i = 0; i < scope.data.ranges.length; i++) {
							var range = scope.data.ranges[i];
							scope.ranges[i] = {
								label: /*range.label + ': '*/ + range.value,
								style: {
									top: 100- getPercent(range.value) + '%',
									color: range.color,
									'border-top-color': range.color
								}
							};
						}
						
						scope.ranges[i++] = {
							style: {
								bottom: getPercent(scope.data.data.value) + '%',
								left: '100%',
								width: '160%',
								'border-top': 'none',
								'text-align': 'center',
								color: scope.data.data.color
							},
							label: scope.data.data.value
						};
						
						scope.ranges[i++] = {
							style: {
								top: '0'	
							},
							label: scale
						};
						
						scope.barStyle = {
							'transform': 'scaleY(' + (getPercent(scope.data.data.value) / 100) + ')',
							'background-color': scope.data.data.color 
						};
					}
				};
				scope.$watch('data', reload);
			}, 
		}
	};
});