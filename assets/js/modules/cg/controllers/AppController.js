angular.module('cg').controller('AppController',
	function($scope, $location, $timeout, socket, responseHandler) {
		$scope.globalMessages = {
			_messages: [],
			push: function(elm) {
				$scope.globalMessages._messages.push(elm);
				$timeout(function() {
					$scope.globalMessages.shift();
				}, 3000);
			},
			shift: function() {
				if(!$scope.globalMessages._messages[0].hold) {
					$scope.globalMessages._messages.shift();
				}
			},
			remove: function(index) {
				$scope.globalMessages._messages.splice(index, 1);
			},
			count: function() {
				return $scope.globalMessages._messages.length;
			},
			get: function() {
				return $scope.globalMessages._messages;
			}
		};

		$scope.globalUtils = {
			responseHandler: responseHandler($scope)
		};

		socket.get('/home/data', function(response) {
			$scope.$apply(function() {
				$scope.items = response;
			});
		});
	});