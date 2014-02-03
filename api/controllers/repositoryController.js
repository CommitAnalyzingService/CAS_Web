/**
 * New node file
 */
var test = 0;
var sys = require('sys');
var exec = require('child_process').exec;
var moment = require('moment');
function puts(error, stdout, stderr) { sys.puts(stdout); }

function isValidUrl(url) {
	return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

function isValidEmail(email) {
	return email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/);
}

var genUUID = function() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };


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
    	/*var result = false;
    	var url = req.param('url').replace(/"|'|\\/g, '').replace("\\","\\\\"); //Sanitize input
    	exec("C:/Python33/python.exe C:/Users/Ben/Projects/CAS_Reader/readRepo.py \""+url+"\"",
    	function( error, stdout, stderr) {
    		console.log(stderr);
    		result = JSON.parse(stdout);
    		res.json({id:'u3i2yw349o8ayt7', result: result,success:true});
    	});*/
    	var url = req.param('url').replace(/"|'|\\/g, '').replace("\\","\\\\");
    	var email = req.param('email');
    	if(!isValidUrl(url) && !isValidEmail(email)) {
    		res.json({success:false, error: 'Invalid Email Address and/or Repo URL'});
    		return;
    	}
    	
    	var urlParts = url.split('/');
    	var nameParts = urlParts[urlParts.length - 1];
    	var name = nameParts.split('.')[0];
    	var now = moment().format('YYYY-MM-DD HH:mm:ss');
    	
    	
    	
    	Repository.create({
    		id:genUUID(),
    		name:name,
    		url:url,
    		creation_date: now,
    		status: 'Waiting to be Ingested',
    		email: email
    	}).done(function(err, repo) {
    		  if (err) {
    		    return console.log(err);
    		  }else {
    		    console.log("Repo created:", repo);
    		    res.json({repo: repo, success:true});
    		  }
    	});
    },
    find: function(req, res) {
    	var repo_name = req.param('id');
    	//var fs = require('fs');
    	//var file = process.cwd() + '/files/'+repo_id+'.json';
    	/*
    	fs.readFile(file, 'utf8', function (err, data) {
    		if (err) {
    			console.log('Error: ' + err);
    			res.json({error:'Repo does not exist.', file: file, success: false});
    			return;
    		}
    		//data = JSON.parse(data)
    		res.view({layout: null, repo: data});
    	});
    	*/
    	// Get the repository
    	Repository.findOne({name:repo_name}).done(function(err, repo){
    		if(!err) {
    			if(typeof repo !== "undefined") {
    				// Repository found, get the metrics
    				Metric.findOne({repo:repo.id}).done(function(err, metrics){
    					if(!err && typeof metrics != 'undefined') {
	    					repo.metrics = metrics;
				    		Commit.find({repository_id:repo.id}).sort('author_date_unix_timestamp DESC').done(function(err, commits){
				    			// Loop through each commit's keys to determine if in between metric threshold
				    			for(var i in commits) {
				    				for(var key in commits[i]) {
				    					var value = parseFloat(commits[i][key]);
				    					// Is key a metric?
				    					if(metrics.hasOwnProperty(key+'nonbuggy')) {
				    						commits[i][key] = {value: value, threshold:0}
	
				    						var nonbuggy = key + 'nonbuggy',
				    						buggy = key + 'buggy';
				    						if(key == 'entrophy') {
				    							buggy = key;
				    						}
				    						if(value <= metrics[nonbuggy]) {
				    							commits[i][key].threshold = -1;
				    						} else if(value >= metrics[buggy]) {
				    							commits[i][key].threshold = 1;
				    						} else {
				    							commits[i][key].threshold = 0;
				    						}
				    					}
				    				}
				    			}
				    			repo.commits = commits;
				        		res.json({success: true, repo: repo});
				        	});
    					} else {
    						repo.commits = [];
    						repo.metrics = [];
    						
    						Commit.find()
    						.where({repository_id:repo.id})
    						.limit(1)
    						.exec(function(err, commits) {
    							if(commits.length > 1) {
    	    						res.json({success: true, repo: repo});
    							} else {
    								res.json({success: true, repo: repo});
    							}
    						});
    					}
    				});
    			} else {
    				// TODO: Send 404 and have it work correctly on client side.
	    			res.json({success:false, error:'Nothing Found'});
	    		}
    			if(repo.status != 'Analyzed') {
    				Repository.subscribe(req.socket, [repo.id]);
        			var checkStatus = function() { 
        				console.log('Checking for update to repo '+ repo.name);
        				Repository.findOne(repo.id).done(function(err, newRepo){
        					if(!err) {
        						if(typeof repo !== "undefined") {
        							if(repo.status != newRepo.status) {
        								Repository.publishUpdate(repo.id, {status: newRepo.status});
        							}
        							if(newRepo.status == 'Analyzed') {
        								clearInterval(checkStatusInterval);
        								Repository.unsubscribe(req.socket, [repo.id])
        							}
        						}
        					} else console.log(error)
        				});
        			}
        			var checkStatusInterval = setInterval(checkStatus, 5000);
    			}
    			
    		} else console.log(err);
    	});
    },
    update: function(req, res) {
    	
    	var repo_name = req.param('id');
    	var update = {};
    	var valid = false;
    	if('email' in req.body) {
    		if(isValidEmail(req.body.email)) {
    			update.email = req.body.email;
    			valid = true;
    		} else {
    			valid = false;
    		}
    	}
    	if(!valid) {
    		res.json({success:false, error:'Only allowed to update valid emails.'});
    		return;
    	}
    	Repository.update({name:repo_name}, update).done(function(err, repo){
    		if(!err) {
    			if(typeof repo !== "undefined") {
    				res.json({success:true});
    			} else {
    				res.json({success:false, error:'Nothing Found'});
    			}
    		} else {
    			console.log(err);
    			res.json({success:false, error:'Something went wrong with the database connection.'});
    		}
    	});
    }
}

module.exports = RepositoryController;
