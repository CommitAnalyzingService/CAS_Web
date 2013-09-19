/**
 * New node file
 */
var test = 0;
var HomeController = {
    index: function(req, res) {
    	console.log('here:',req);
    	if(req['headers']['x-request-origin'] == 'app') {
    		res.view(null, {layout: null});
    		console.log('Serving with no layout');
    	} else {
    		res.view('admin/index', {total:4});
    		console.log('Serving with layout');
    	}
    },
}

module.exports = HomeController;