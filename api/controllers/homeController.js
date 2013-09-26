/**
 * New node file
 */
var test = 0;
var HomeController = {
    index: function(req, res) {
    	if(req['headers']['x-request-origin'] == 'app') {
    		res.view(null, {layout: null});
    		console.log('Serving with no layout');
    	} else {
    		res.view('home/index', {total:4});
    		console.log('Serving with layout');
    	}
    },
    data: function(req, res) {
    		var response = ["twbs/bootstrap","HubSpot/vex","angular/angular.js","Socket Request #"+test];
    		test++;
    	res.json(response);
    	//console.log('here2:',req.isAjax);
    	//console.log('Home/Data Requested');
    },
}

module.exports = HomeController;