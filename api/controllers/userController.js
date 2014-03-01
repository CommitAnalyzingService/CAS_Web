/**
 * UserController - Holds all user-related actions
 */
var UserController = {

    create: function(req, res) {
    	
    	// Create the new user
    	User.create({
    		email: req.body.email,
    		password: req.body.password
    	}).done(function(err, newUser) {
    		
    		// Check for an error
    		if(err) {
    			res.json({success: false, error: err});
    		} else {
    			sails.log.info("User <" + req.body.email + "> created.");
        		
        		//Log user in
        		req.session.user = newUser.id;
        		
    		    res.json({success:true});
    		}
    	});
    },
    login: function(req, res) {
    	
    	// Create the new user
    	User.findByEmail(req.body.email).done(function(err, foundUser) {
    		// Check for an error
    		if(err) res.json({success: false, error: err});
    		
    		// Check if the password is correct
    		if(foundUser.isCorrectPassword(req.body.password)) {
    			
    			// Log them in
    			req.session.user = foundUser.id;
    			
    			res.json({success: true});
    		} else {
    			
    			// If the user is set in the session, null it.
    	    	if(req.session.user) {
    	    		req.session.user = null;
    	    	}
    			
    			res.json({success: false, error: err});
    		}
    		
    	});
    },
    logout: function(req, res) {
    	
    	// If the user is set in the session, null it.
    	if(req.session.user) {
    		req.session.user = null;
    	}
    	
    	// Always return true
    	res.json({success: true});
    },
};

module.exports = UserController;