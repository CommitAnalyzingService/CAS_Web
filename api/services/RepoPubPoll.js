/**
 * RepoPubPoll
 * 
 * @author Ben Grawi <bjg1568@rit.edu>
 * @date March 2014
 * @desc Hold the information for updating a socket with new status info
 */
/**
 * Provide a way to send updates to the client
 */
module.exports = function(req, repo) {
	
	// Subscribe socket to the repo's id
	Repository.subscribe(req.socket, [{id: repo.id}]);
	
	var prevStatus = repo.status,
	checkStatus = function() {
		
		// Check the repo
		Repository.findOne(repo.id).done(function(err, newRepo) {
			if(!err) {
				if(typeof newRepo !== "undefined") {
					
					// No error and repo exists
					
					if(prevStatus != newRepo.status) {

						prevStatus = newRepo.status;
						
						// New status, push it.
						Repository.publishUpdate(repo.id, {
							status: newRepo.status
						});
					}
					
					// If it's analyzed, remove the poll
					if(newRepo.status == 'Analyzed') {
						removeCheckStatus();
					}
				} else {
					// Repo does not exist, must have been deleted? Remove poll
					removeCheckStatus();
				}
			} else {
				
				// Db error
				sails.log.error(error);
				removeCheckStatus();
			}
		});
	}, removeCheckStatus = function() {
		
		// Stop polling and unsubscribe
		clearInterval(checkStatusInterval);
		Repository.unsubscribe(req.socket, [ repo.id ]);
	};
	

	
	// On disconnect, remove checkStatus
	req.socket.on('disconnect', removeCheckStatus);
	
	// Check the status every 5 seconds
	var checkStatusInterval = setInterval(checkStatus, 5000);
};
