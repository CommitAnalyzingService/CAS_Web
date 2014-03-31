angular.module('cg').directive('metric', function() {
	return {
		restrict: 'A',
		transclude:true,
		scope: {
			metric:'=',
			display:'='
		},
		template: '<div class="alert" ng-class="threshold" ng-bind="metric.value | round"></div><div ng-transclude></div>',
		link: {
				pre: function(scope, elm, attrs) {
					scope.$watch('display.type', function(newVal) {
						if(newVal !='predictive') {
							if(scope.metric.threshold > 0 ) scope.threshold="alert-danger";
							else if(scope.metric.threshold < 0 ) scope.threshold="alert-success";
							else scope.threshold="alert-warning";
						} else {
							scope.threshold="alert-default";
						}
					});
				}
		}
	};
});