/**
 * New node file
 */
var HomeController = {
    index: function(req, res) {
    	// No-op
    },
    data: function(req, res) {
    	Repository.find().where({listed: true}).sort('analysis_date DESC').done(function(err, repos) {
    		if(err) return res.json({success: false, error: err});
    		
    		
    		CommitCounts.getAll(function(repoCommitCounts) {                         
    			
    			// Add the commitcoutns to each repo
    			for(var i = 0, l = repos.length; i < l; i++) {
    				repos[i].commitCounts = repoCommitCounts[repos[i].id];
    			}
                
                // Check if the user is in the session
	    		if(req.session.user) {
	    			User.findOne(req.session.user).done(function(err, user) {
	    				if(err) return res.json({success: false, error: err});
	    				if(user) {
	    					res.json({repositories: repos, user: user});
	    				} else {
	    					res.json({repositories: repos, user: false});
	    				}
	    			});
	    		} else {
	    			res.json({repositories: repos, user: false});
	    		}
    		});
    	});
    },
}

module.exports = HomeController;