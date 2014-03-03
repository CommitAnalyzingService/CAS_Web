/**
 * New node file
 */
var HomeController = {
    index: function(req, res) {
    	if(req['headers']['x-request-origin'] == 'app') {
    		res.view(null, {layout: null});
    	} else {
    		res.view();
    	}
    },
    data: function(req, res) {
    	Repository.find().where({listed: true}).sort('analysis_date DESC').done(function(err, repos) {
    		if(err) return res.json(err);
    		
    		if(req.session.user) {
    			User.findOne(req.session.user).done(function(err, user) {
    				if(err) return res.json(err);
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
    	
    	//console.log('here2:',req.isAjax);
    	//console.log('Home/Data Requested');
    },
}

module.exports = HomeController;