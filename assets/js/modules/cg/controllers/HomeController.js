angular.module('cg').controller(
	'HomeController',
	function($scope, socket, $location, responseHandler) {
		$scope.quickActions = {
			repo_url: '',
			repo_email: '',
			listed: true,
			quickAddRepo: function() {
				if($scope.quickAddForm.$valid) {
					socket.post('/repository/create', {
						url: this.repo_url,
						email: this.repo_email,
						listed: this.listed
					}, function(response) {

						$scope.globalUtils.responseHandler(response, function(
							response) {

							// Repo created successfully, redirect to the repo
							$location.path('/repo/' + response.repo.name);

						}, "Could not create repo");
					});
				}
			},
		};
		
		$scope.createUserFields = {
			email: '',
			password: '',
			submit: function() {
				if($scope.createUser.$valid) {
					socket.post('/user/create', {
						email: this.email,
						password: this.password
					}, function(response) {

						$scope.globalUtils.responseHandler(response, function(
							response) {
							
							$scope.globalMessages.push({
								type: 'success',
								content: 'Account created!'
							});
							
							$scope.user.setUser(response.user);
							$scope.createUserFields.email = '';
							$scope.createUserFields.password = '';
							// Repo created successfully, redirect to the repo
							//$location.path('/repo/' + response.repo.name);

						}, "Could not create account");
					});
				}
			},
		};

		var now = new Date(Date.now());
		now = now.getHours();
		if(now == 0) {
			$scope.now = "12am";
		} else if(now < 12) {
			$scope.now = now + "am";
		} else if(now == 12) {
			$scope.now = "12pm";
		} else {
			$scope.now = (now - 12) + "pm";
		}

	});