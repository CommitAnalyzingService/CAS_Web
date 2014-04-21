angular.module('cg').directive('metricChart', function() {
	
	var Hcolors = {
		below: '#468847',
		between: '#C09853',
		above: '#B94A48',
	};
	
	return {
		restrict: 'A',
		link: {
			pre: function(scope, elm, attrs) {
				scope.$watch('display.type', function() {
					
					var metricKey = scope.metricKey;
					if(metricKey) {
						if(scope.display.type == 'historical') {
							
							var data = scope.commit[metricKey];
							var above = scope.repo.metrics.individual[metricKey + 'buggy'];
							var below = scope.repo.metrics.individual[metricKey + 'nonbuggy'];
							var sig = scope.repo.metrics.individual[metricKey + '_sig'];
							var max = scope.repo.metrics.maximums[metricKey];
							
							var dataColor = (data.threshold == 0)? Hcolors.between:((data.threshold == 1)? Hcolors.above: Hcolors.below);
							
							scope.metricChartData = {
								data: {
									value: Math.round(data.value * 100) / 100,
									color: dataColor,
									label: scope.metricValues[metricKey] + (sig?'*':'')
								},
								ranges: [{
									value: Math.round(above * 100) / 100,
									color: Hcolors.above,
								}, {
									value: Math.round(below * 100) / 100,
									color: Hcolors.below,
								}],
								scale: max
							};
						} else if (scope.display.type == 'predictive') {
							
							var data = scope.commit[metricKey];
							var max = scope.repo.metrics.maximums[metricKey];
							var sig = scope.repo.metrics.glmc[metricKey + '_sig'];
							var dataColor = sig? 'blue':'lightblue';
							
							scope.metricChartData = {
								data: {
									value: Math.round(data.value * 100) / 100,
									color: dataColor,
									label: scope.metricValues[metricKey] + (sig?'*':'')
								},
								ranges: [],
								scale: max
							};
						}
					}
				});
			}
		}
	};
});