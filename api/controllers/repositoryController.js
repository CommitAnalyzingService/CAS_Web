/**
 * New node file
 */
var test = 0;
var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); }
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
    	var result = false;
    	var url = req.param('url').replace(/"|'|\\/g, ''); //Sanitize input
    	exec("C:/Python33/python.exe C:/Users/Ben/Projects/CASWeb/files/process.py \""+url+"\"", function( error, stdout, stderr) {
    		result = JSON.parse(stdout);
    		res.json({id:'u3i2yw349o8ayt7', result: result,success:true});
    	});
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