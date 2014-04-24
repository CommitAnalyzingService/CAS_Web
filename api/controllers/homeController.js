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
    		
    		
    		var continueData = function(commitCounts) {
    			var repoCommitCounts = {};
    			for(var i = 0, l = commitCounts.length; i < l; i++) {
    				repoCommitCounts[commitCounts[i].repository_id] = +commitCounts[i].commitcount;
    			}
    			
    			for(var i = 0, l = repos.length; i < l; i++) {
    				repos[i].commitCount = repoCommitCounts[repos[i].id];
    			}
 
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
    		};
    		
    		var refreshCounts = function(cb) {
    			Commit.query('SELECT repository_id, COUNT(*) as commitCount FROM commits GROUP BY repository_id',{}, function(err, result) {
    				SimpleCache.put(cacheKey, result.rows);
    				cb(result.rows);
    			});
    		};
    		var now = new Date();
    		var cacheKey = 'commitCounts_' + now.getMonth() + now.getDay() + repos.length;
    		var commitCounts = [];
    		if((commitCounts = SimpleCache.get(cacheKey)) == null) {
    			refreshCounts(continueData);
    		} else {
    			continueData(commitCounts);
    		}
    	});
    },
}

module.exports = HomeController;