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
    	Repository.find().where({listed: true}).sort('analysis_date DESC').done(function(err, result) {
    		if(!err) {
    			res.json(result);
    		} else {
    			console.log(err);
    		}
    	});
    	
    	//console.log('here2:',req.isAjax);
    	//console.log('Home/Data Requested');
    },
}

module.exports = HomeController;