angular.module('cg').controller('AppController',
	function($scope, $location, $timeout, socket, responseHandler, $state) {
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

		socket.get('/data', function(response) {
			$scope.$apply(function() {
				$scope.repositories = response.repositories;
				if(response.user) {
					$scope.user.setUser(response.user);
				}
			});
		});
		$scope.loading = false;
		$scope.$on("$stateChangeStart", function() {
			$scope.loading = true;
		});
		$scope.$on("$stateChangeSuccess", function() {
			$scope.loading = false;
		});
		$scope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			$scope.globalMessages.push({
				type: 'danger',
				content: error
			});
			$scope.loading = false;
			$state.go('home');
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
				socket.post('/login', {
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
				socket.get('/logout', function(response) {

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