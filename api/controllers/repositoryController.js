/**
 * New node file
 */
var test = 0;
var RepositoryController = {
    index: function(req, res) {
    	if(req['headers']['x-request-origin'] == 'app') {
    		res.view('repository/index', {layout: null});
    		console.log('Serving with no layout');
    	} else {
    		res.view('repository/index');
    		console.log('Serving with layout');
    	}
    },
    create: function(req, res) {
    	res.json({id:'u3i2yw349o8ayt7',success:true});
    },
    find: function(req, res) {
    	var repo_id = req.param('id');
    	var fs = require('fs');
    	var file = process.cwd() + '/files/'+repo_id+'.json';
    	
    	fs.readFile(file, 'utf8', function (err, data) {
    		if (err) {
    			console.log('Error: ' + err);
    			res.json({error:'Repo does not exist.', file: file, success: false});
    			return;
    		}
    		//data = JSON.parse(data)
    		res.view({layout: null, repo: data});
    	});
    }
}

module.exports = RepositoryController;