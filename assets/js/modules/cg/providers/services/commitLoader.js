angular.module('cg')

/*
 * Load a repo over a socket connection
 */
.factory('commitLoader', function($q, socket) {

    return function(params) {
        var defer = $q.defer();
        socket.get('/repo/' + params.name + '/commits', 
            params?params:{},
            function(response) {
                if(response.success) {
                    defer.resolve(response.commits);
                } else {
                    defer.reject(response.error);
                }
            }
        );		
        return defer.promise;
    };
});