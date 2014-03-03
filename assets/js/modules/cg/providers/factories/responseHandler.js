
/**
 * Handles responses and their errors
 */
angular.module('cg')
		.factory(
			'responseHandler',
			function($filter) {

				/*
				 * Wrap the response Handler in a scope
				 */
				return function($scope) {
					/**
					 * Handle an error
					 * @param action String the action that was performed
					 * @param details
					 * @returns
					 */
					var handleError = function(action, details) {
						if(typeof details == 'object') {
							details = (details.message || details.content || details.error);
						}
						$scope.globalMessages.push({
							type: 'danger',
							content: action + ': ' + details
						});
					};

					/**
					 * Returns a request handeler
					 * 
					 * @param response Object The response object
					 * @param {function} successFn The function to call upon success
					 * @param {?(function | boolean | string)} errorFn   
					 */
					return function(response, successFn, errorFn) {

						// Wrap in an apply block
						$scope
								.$apply(function() {

									// If successful, call the success callback
									if(response.success) {
										successFn(response);
									} else {

										// Check if there is a callback function, then call it
										if(typeof errorFn == "function") {
											errorFn(response.error);
										} else if(typeof errorFn == "string") {
											handleError(errorFn, response.error);
										} else if((typeof errorFn == "boolean" && errorFn !== false)
											|| typeof errorFn == "undefined") {
											handleError('Error', response.error);
										}

										// If the errorFn is set to false, fail silently
									}
								});
					};
				};
			});
