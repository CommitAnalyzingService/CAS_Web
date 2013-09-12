/**
 * New node file
 */
var HomeController = {
    index: function(req, res) {
    	res.view('home/index', {total:4, layout: null});
    	console.log('here:',req.isAjax());
    },
}

module.exports = HomeController;