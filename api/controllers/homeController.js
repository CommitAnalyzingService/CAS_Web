/**
 * New node file
 */
var test = 0;
var HomeController = {
    index: function(req, res) {
    	res.view('home/index', {total:4, layout: null});
    	console.log('here:',req.isAjax());
    },
    data: function(req, res) {
    		var response = ["hello","from","sockets",test];
    		test++;
    	res.json(response);
    	console.log('Home/Data Requested');
    },
}

module.exports = HomeController;