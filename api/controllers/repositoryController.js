var RepositoryController = {
    index: function(req, res) {
    	//No-op
    },
    create: function(req, res) {

    	// Set up variables
    	var url = req.body.url.replace(/"|'|\\/g, '').replace("\\","\\\\"),
    	email = req.body.email,
    	listed = req.body.listed? true: false,
    	name = url.split('/').reverse()[0].split('.')[0];
    	
    	// Create the new repository
    	Repository.create({
    		name: name,
    		url: url,
    		email: email,
    		listed: listed
    	}).done(function(err, repo) {
    		
    		// If no db error, return the repo
    		if(!err) {
    			res.json({repo: repo, success: true});
    		} else {
    			sails.log.error(err);
    			res.json({error: err, success: false});
    		}
    	});
    },
    find: function(req, res) {
    	
    	// Get the name from the URL
    	var repo_name = req.params.name;
    	
    	// Get the repository
    	Repository.findOne({name:repo_name}).done(function(err, repo) {
    		
    		// ERROR CHECKING FOR REPO
    		if(err) {
    			sails.log.error(err);
    			return res.json({success: false, error: err});
    		} else if(typeof repo === "undefined") {
    			
    			// Repository does not exist
    			return res.json({success:false, 
    				error:'404: Repository not found'});
    		}
    		
    		// REPO VALID
    		
			// Init non-standard repo fields
			repo.commits = [];
			repo.metrics = {};
			
			// Repository found, get the metrics
			Metric.findOne({repo:repo.id}).done(function(err, metrics){
				
	    		// ERROR CHECKING FOR METRICS
	    		if(err) {
	    			sails.log.error(err);
	    			return res.json({success: false, error: err});
	    		} else if(typeof metrics === "undefined") {
	    			
					// Repo has (most likely) not been analyzed ever
					
        			if(repo.status != 'Analyzed') {
        				
        				// Start the polling to send updates
        				
        				RepoPubPoll(req, repo);
        			}
        			
					return res.json({success: true, repo: repo});					
	    		}
	    		
	    		// METRICS VALID
	    		
	    		// Metrics found, get the Glm fields
				Glmcoefficients.findOne({repo:repo.id}).done(function(err, glmc){
					
		    		// ERROR CHECKING FOR GLMC
		    		if(err) {
		    			sails.log.error(err);
		    			return res.json({success: false, error: err});
		    		} else if(typeof glmc === "undefined") {
						
		    			// GLMs not ready yet
		    			return res.json({success: true, repo: repo});
		    			
		    		}
		    		
		    		// GLMC's valid
		    		
					// Get the commits for the repo
					Commit.find({repository_id:repo.id})
					.sort('author_date_unix_timestamp DESC')
					.done(function(err, commits){
						
						// ERROR CHECKING FOR COMMITS
						if(err) {
			    			sails.log.error(err);
			    			return res.json({success: false, error: err});
			    		} else if(commits.length == 0) {
			    			
			    			// No commits in the repo
							
							return res.json({success: true, repo: repo});			
			    		}
						
						// COMMITS VALID
		
						// Start the repo metric analyzer
						var repoMetrics = 
							new RepositoryMetrics(metrics, glmc, commits.length);
		    			
		    			// Loop through each commit
		    			for(var i in commits) {
		    				
		    				// Parse each commit and update thresholds
		    				repoMetrics.parseCommit(commits[i]);
		    				
		    				// Now normalize the fileschanged
		    				commits[i].fileschanged = commits[i].fileschanged
		    				.split(",CAS_DELIMITER").map(function(file) {
		    					return file.replace(/(^,)|(,$)/, '');
		    				});
		    			}
		    			
		    			// Update repo with the new information
		    			repo.commits = commits;
		    			repo.metrics = repoMetrics.metrics;
		    			
		    			// Return the repo
		    			return res.json({success: true, repo: repo});
	    			});
				});
			});
    	});
    }
};

module.exports = RepositoryController;
