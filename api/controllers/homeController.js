/**
 * New node file
 */
var HomeController = {
    index: function(req, res) {
    	if(req['headers']['x-request-origin'] == 'app') {
    		res.view(null, {layout: null});
    		console.log('Serving with no layout');
    	} else {
    		res.view({total:4});
    		console.log('Serving with layout');
    	}
    },
    data: function(req, res) {
    	Repository.find().done(function(err, result) {
    		/*if(!err) {
    			console.log(err);
    		}*/
    		//var response = [];
    		/*result.forEach(function(item) {
    			response.push(item.name)
    		});*/
        	res.json(result);
    	});
    	
    	//console.log('here2:',req.isAjax);
    	//console.log('Home/Data Requested');
    },
}

module.exports = HomeController;