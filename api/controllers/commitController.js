var CommitController = {
    find: function (req, res) {
        
        var repo_name = req.params.name;

        // Get the repository
        Repository.findOne({name:repo_name}).done(function(err, repo) {

            // ERROR CHECKING FOR REPO
            if(err) {
                sails.log.error(err);
                return res.json({success: false, error: err});
            } else if(typeof repo === "undefined") {

                // Repository does not exist
                return res.json({success:false, 
                                 error:'404: Repository not found'});
            }
            
            // REPO is valid
            
            var paginationOptions = {
                page: (+req.param('page')) || 0,
                limit: (+req.param('limit')) || 20
            };
            
            var critera = {
                commit_hash: {like: null},
                classification: {like: null},
                author_email: {like: null},
                commit_message: {like: null}
            };
            
            var criteriaCount = 0;
            var result = null;
            for(var key in critera) {
                criteriaCount++;
                if((result = req.param(key)) !== null) {
                    critera[key].like = "%" + result + "%";
                    criteriaCount++;
                } else {
                    delete critera[key];
                }
            }
            
            var type = req.param('type');
            if(type == 'predictive') {
                var d = new Date();
                d.setMonth(d.getMonth() - 3);
                critera.author_date_unix_timestamp = {'>=': d.getTime()};
            }
            
            var sortParam = req.param('sort');
            var sort = '';
            if(sortParam !== null) {
                
                var sortModifier = sortParam.substr(0, 1);
                var sortDESC = (sortModifier != '+');
                var sortType = (sortDESC && sortModifier != "-")? sortParam: sortParam.substr(1);
                
                if(sortType == 'risk') {
                    sort = "glm_probability";
                } else if(sortType == 'time') {
                    sort = "author_date_unix_timestamp";
                } else {
                    sort = false;
                }
                
                if(sort) {
                    sort += (sortDESC)? " DESC": " ASC";
                }
            }
            
            if(!sort) {
                sort = 'author_date_unix_timestamp DESC';
            }
            
            var query = Commit.find({repository_id: repo.id});
            if(criteriaCount > 0) {
                query.where(critera);
            }
            query.paginate(paginationOptions)
            .sort(sort)
            .done(function(err, commits){

                // ERROR CHECKING FOR COMMITS
                if(err) {
                    sails.log.error(err);
                    return res.json({success: false, error: err});
                } else if(commits.length == 0) {

                    // No commits in the repo

                    return res.json({success: true, commits: []});			
                }

                // COMMITS VALID

                // Loop through each commit
                for(var i = 0, l = commits.length; i < l; i++) {

                    // Normalize the fileschanged
                    commits[i].fileschanged = commits[i].fileschanged
                    .split(",CAS_DELIMITER").map(function(file) {
                        return file.replace(/(^,)|(,$)/, '');
                    });
                }
                return res.json({success: true, commits: commits});
            })
        });
    },
}

module.exports = CommitController;
