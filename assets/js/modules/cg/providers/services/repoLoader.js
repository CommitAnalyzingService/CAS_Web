angular.module('cg')

/*
 * Load a repo over a socket connection
 */
.factory('repoLoader', function($q, socket) {
	
	return function(name) {
		var defer = $q.defer();
		socket.get('/repo/' + name, 
			function(response) {
				if(response.success) {
					defer.resolve(response.repo);
				} else {
					defer.reject(response.error);
				}
			}
		);		
		return defer.promise;
	};
});