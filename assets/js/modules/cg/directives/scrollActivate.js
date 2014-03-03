angular.module('cg').directive("scrollActivate", function ($window, $timeout) {
	var elements = [];
	var win = angular.element($window);
	var checkElm = function(elm, i) {
		if (elm.triggered == false && elm.element.offset().top <= win.scrollTop() + win.height()) {
			elm.triggered = true;
			setTimeout(function() {
				elm.scope.$eval(elm.expression);
				elm.scope.$apply();
				if(i !== false) {
					elements.splice(elements.indexOf(elm), 1);
				}
			}, 200);
			return true;
		} else {
			return false;
		}
	};
	var addElm = function(elm) {
		setTimeout(function() {
			if(!checkElm(elm, false)) {
		    	elements.push(elm);
			}
		}, 300);
	};
	win.bind("scroll", function() {
		elements.forEach(checkElm);
	});
    return function(scope, element, attrs) {
    	addElm({
    		scope: scope,
    		element: angular.element(element),
    		expression: attrs.scrollActivate,
    		triggered: false
    	});
    };
});