angular.module('cg').directive('metric', function() {
	return {
		restrict: 'A',
		transclude:true,
		template: '<div class="alert" ng-class="metricClass" ng-bind="value | round"></div><div ng-transclude></div>',
		link: {
				pre: function(scope, elm, attrs) {
					scope.$watch('display.type', function(newVal) {
						scope.value =  scope.commit[scope.key];
						if(newVal !='predictive') {
							if(scope.value >= scope.repo.metrics.median[scope.key + 'buggy'] ) scope.metricClass="alert-danger";
							else if(scope.value >= scope.repo.metrics.median[scope.key + 'nonbuggy'] ) scope.metricClass="alert-warning";
							else scope.metricClass="alert-success";
						} else {
							if(scope.repo.metrics[scope.display.metricKey][scope.key + '_sig']) {
								if(scope.commit.glm_probability > .5) scope.metricClass="alert-danger";
								else if(scope.commit.glm_probability > .25 ) scope.metricClass="alert-warning";
								else scope.metricClass="alert-success";
							} else {
								scope.metricClass = "alert-default";
							}
						}
					});
				}
		}
	};
});