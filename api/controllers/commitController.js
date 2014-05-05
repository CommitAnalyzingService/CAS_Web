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
                page: 0,
                limit: 10
            };
            console.log(req);
            if(typeof req.body.page != "undefined") {
                paginationOptions.page = req.body.page;
            }
            
            var query = Commit.find({repository_id: repo.id})
            .paginate(paginationOptions)
            .sort('author_date_unix_timestamp DESC');
            console.log(query);
            
            query
            .done(function(err, commits){

                // ERROR CHECKING FOR COMMITS
                if(err) {
                    sails.log.error(err);
                    return res.json({success: false, error: err});
                } else if(commits.length == 0) {

                    // No commits in the repo

                    return res.json({success: true, repo: repo});			
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
