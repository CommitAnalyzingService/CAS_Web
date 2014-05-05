/**
 * CommitCounts
 * 
 * @author Ben Grawi <bjg1568@rit.edu>
 * @date April 2014
 * @desc Simply hold values in memory
 */

var SimpleCache = require('./SimpleCache.js');

/**
 * Holds values in memory by key
 * @constructor
 */
function CommitCounts() {
}

/**
 * Gets an the repo commit counts from the cache
 */
function generate(cb, force) {
    
    // Init variables
    var now = new Date();
    var cacheKey = 'commitCounts_' + now.getMonth() + now.getDay();
    var commitCounts = [];
    
    // Try to get it from the cachce first
    if(((commitCounts = SimpleCache.get(this.cacheKey)) == null) || force) {
        Commit.query('SELECT repository_id, COUNT(*) as commit_count, COUNT(nullif(contains_bug, false)) as commit_contains_bug_count FROM commits GROUP BY repository_id', {},
            function (err, result) {
                if(err) throw err;
                commitCounts = result.rows;
                SimpleCache.put(cacheKey, result.rows);
                var repoCommitCounts = {};
                for(var i = 0, l = commitCounts.length; i < l; i++) {
                    repoCommitCounts[commitCounts[i].repository_id] = {
                        total: +commitCounts[i].commit_count,
                        contains_bug: +commitCounts[i].commit_contains_bug_count
                    };
                }
                cb(repoCommitCounts);
            }
        );
    } else {
        cb(commitCounts);
    }
}

/**
 * Gets all the commit coutns
 */
function getAll(cb) {
    this.generate(cb, false);
}

/**
 * Get a single repo. If it doesn't exist, then force refresh the cache
 */
function getOne(id, cb) {
    generate(function(repoCommitCounts) {
        if(repoCommitCounts.hasOwnProperty(id)) {
            cb(repoCommitCounts[id]);
        } else {
            this.generate(function(repoCommitCounts) {
                cb(repoCommitCounts[id]);
            }, true);
        }
    }, false);
}

CommitCounts.prototype.generate = generate;
CommitCounts.prototype.getAll = getAll;
CommitCounts.prototype.getOne = getOne;
module.exports = new CommitCounts();
