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
				$scope.items = response.repositories;
				if(response.user) {
					$scope.user.setUser(response.user);
				}
			});
		});
		
		$scope.user = {
			status: {
				authenticated: false
			},
			object: {},
			setUser: function(user) {
				$scope.user.object = user;
				$scope.user.status.authenticated = true;
			},
			clearUser: function() {
				$scope.user.object = {};
				$scope.user.status.authenticated = false;
			},
			signIn: function() {
				socket.post('/user/login', {
					email: $scope.user.signInFields.email,
					password: $scope.user.signInFields.password
				}, function(response) {

					$scope.globalUtils.responseHandler(response, function(
						response) {
						
						$scope.globalMessages.push({
							type: 'success',
							content: 'Signed in'
						});
						
						$scope.user.setUser(response.user);
						$scope.user.signInFields.password = '';
					}, "Cannot sign in");
				});
			},
			signOut: function() {
				socket.get('/user/logout', function(response) {

					$scope.globalUtils.responseHandler(response, function(
						response) {
						
						$scope.globalMessages.push({
							type: 'success',
							content: 'Signed out'
						});
						
						$scope.user.clearUser();
						$scope.user.signInFields.password = '';
					}, "Cannot sign out");
				});
			},
			signInFields: {
				email: '',
				password: ''
			}
		};
	});