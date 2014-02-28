angular.module('cg').directive('pinned', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attrs) {
			$(elm).affix({
				offset: {
					top: 50,
					bottom: 0
				}
			}).on('affixed.bs.affix', function() {
				console.log('AFFIXXED!');
				elm.addClass('show-site-title');
			}).on('affixed-top.bs.affix', function() {
				console.log('TOP-AFFIXXED!');
				elm.removeClass('show-site-title');
			});
		}
	};
});