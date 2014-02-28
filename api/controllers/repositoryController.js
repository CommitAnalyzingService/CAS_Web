
function isValidUrl(url) {
	return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

function isValidEmail(email) {
	return email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/);
}


/**
 * Provide a way to send updates to the client
 */
var repoPubPoll = function(req, repo) {
	Repository.subscribe(req.socket, [ repo.id ]);
	var checkStatus = function() {
		console.log(req.socket.id + ' is checking for update to repo '
			+ repo.name);
		Repository.findOne(repo.id).done(function(err, newRepo) {
			if(!err) {
				if(typeof repo !== "undefined") {
					if(repo.status != newRepo.status) {
						Repository.publishUpdate(repo.id, {
							status: newRepo.status
						});
					}
					if(newRepo.status == 'Analyzed') {
						clearInterval(checkStatusInterval);
						Repository.unsubscribe(req.socket, [ repo.id ])
					}
				}
			} else
				console.log(error)
		});
	};
	req.socket.on('disconnect', function() {
		console.log(req.socket.id + ' disconnected, removing repo subscription');
		clearInterval(checkStatusInterval);
		Repository.unsubscribe(req.socket, [ repo.id ])
	});
	var checkStatusInterval = setInterval(checkStatus, 5000);
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

    	var url = req.param('url').replace(/"|'|\\/g, '').replace("\\","\\\\");
    	var email = req.param('email');
    	if(!isValidUrl(url) && !isValidEmail(email)) {
    		res.json({success:false, error: 'Invalid Email Address and/or Repo URL'});
    		return;
    	}
    	
    	var urlParts = url.split('/');
    	var nameParts = urlParts[urlParts.length - 1];
    	var name = nameParts.split('.')[0];
    	
    	var listed = req.param('listed');
    	
    	
    	
    	Repository.create({
    		name:name,
    		url:url,
    		email: email,
    		listed: listed?true:false
    	}).done(function(err, repo) {
    		  if (err) {
    			res.json({error: err, success:false});
    		    return console.log(err);
    		  }else {
    		    console.log("Repo created:", repo);
    		    res.json({repo: repo, success:true});
    		  }
    	});
    },
    find: function(req, res) {
    	var repo_name = req.param('id');
    	
    	// Get the repository
    	Repository.findOne({name:repo_name}).done(function(err, repo){
    		if(!err) {
    			if(typeof repo !== "undefined") {
    				// Repository found, get the metrics
    				Metric.findOne({repo:repo.id}).done(function(err, metrics){
    					if(!err && typeof metrics != 'undefined') {
	    					repo.metrics = {
	    						individual: metrics,
	    						overall: {
	    							above: 0,
	    							below: 0,
	    							between: 0
	    						},
	    						history: {
	    							ids: [],
	    							values: {
	    								quality: [],
	    							}
	    						}
	    					};
	    				

				    		Commit.find({repository_id:repo.id}).sort('author_date_unix_timestamp DESC').done(function(err, commits){
				    			
				    			var historyFreq = 1;
				    			if(commits.length > 10) {
				    				var modInterval = commits.length % 10;
				    				var rawInterval = Math.floor(commits.length / 10);
				    				historyFreq = (modInterval == 0)? rawInterval: rawInterval + 1;
				    			}
				    			var historyCount = 1;
				    			var currentAvgs = [];
				    			var saveHistory = function() {
	    							var sum = 0;
	    							for(var i = 0; i < currentAvgs.length; i++) {
	    								sum += currentAvgs[i];
	    							}
	    							repo.metrics.history.ids.push(historyCount);
	    							repo.metrics.history.values.quality.unshift(sum / currentAvgs.length);
	    							currentAvgs = [];
				    			};
		    					var updateRepoMetrics = function(commit, summary) {
		    						repo.metrics.overall.above += summary.above;
		    						repo.metrics.overall.between += summary.between;
		    						repo.metrics.overall.below += summary.below;
		    						
	    							var total = summary.above + summary.between + summary.below;
	    							var quality = (total == 0)? 0: Math.round((summary.below / total) * 100);
	    							currentAvgs.push(quality);
		    						
		    						if(historyCount % historyFreq == 0 || historyCount == commits.length) {
		    							saveHistory();
		    						}
		    						
		    						historyCount++;
		    					};
				    			
				    			// Loop through each commit's keys to determine if in between metric threshold
				    			for(var i in commits) {
				    				commits[i].metric_summary = {
				    					above: 0,
				    					below: 0,
				    					between: 0
				    				};
				    				for(var key in commits[i]) {
				    					
				    					// Is key a metric?
				    					if(metrics.hasOwnProperty(key+'nonbuggy')) {
				    						
					    					var value = parseFloat(commits[i][key]);
				    						commits[i][key] = {value: value, threshold:0};
				    						var nonbuggy = key + 'nonbuggy',
				    						buggy = key + 'buggy';
				    						var threshold = 0;
				    						if(value <= metrics[nonbuggy]) {
				    							threshold = -1;
				    							commits[i].metric_summary.below += 1;
				    						} else if(value >= metrics[buggy]) {
				    							threshold = 1;
				    							commits[i].metric_summary.above += 1;
				    						} else {
				    							commits[i].metric_summary.between += 1;
				    						}
				    						commits[i][key].threshold = threshold;
				    					}
				    				}
				    				updateRepoMetrics(commits[i], commits[i].metric_summary);
				    				
				    				// Now normalize the fileschanged
				    				commits[i].fileschanged = commits[i].fileschanged.split(",CAS_DELIMITER");
				    				
				    				// Get rid of inconsistant commas 
				    				commits[i].fileschanged = commits[i].fileschanged.map(function(file) {
				    					return file.replace(/(^,)|(,$)/, '');
				    				});
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
    				
        			if(repo.status != 'Analyzed') {
        				repoPubPoll(req, repo);
        			}
    			} else {
    				// TODO: Send 404 and have it work correctly on client side.
	    			res.json({success:false, error:'Nothing Found'});
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
    },
}

module.exports = RepositoryController;
