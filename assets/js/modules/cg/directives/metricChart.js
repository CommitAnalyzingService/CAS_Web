angular.module('cg').directive('metricChart', function() {
	
	var colors = {
		below: '#468847',
		between: '#C09853',
		above: '#B94A48',
	};
	
	return {
		restrict: 'A',
		link: {
			pre: function(scope, elm, attrs) {
				var metricKey = scope.metricKey;
				if(metricKey) {
					if(scope.display.type == 'historical') {
						
						var data = scope.commit[metricKey];
						var above = scope.repo.metrics.individual[metricKey + 'buggy'];
						var below = scope.repo.metrics.individual[metricKey + 'nonbuggy'];
						var max = scope.repo.metrics.maximums[metricKey];
						
						var dataColor = (data.threshold == 0)? colors.between:((data.threshold == 1)? colors.above: colors.below);
						
						scope.metricChartData = {
							data: {
								value: Math.round(data.value * 100) / 100,
								color: dataColor,
								label: scope.metricValues[metricKey]
							},
							ranges: [{
								value: Math.round(above * 100) / 100,
								color: colors.above,
							}, {
								value: Math.round(below * 100) / 100,
								color: colors.below,
							}],
							scale: max
						};
					}
				}
			}
		}
	};
});