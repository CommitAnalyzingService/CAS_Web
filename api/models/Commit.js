/**
 * Commit
 *
 * @module      :: Model
 * @description :: The commit module for finding commits
 *
 */

module.exports = {
  tableName: 'commits',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  attributes: {
	  	//Basic Attributes
		commit_hash: 'STRING',
		author_name: 'STRING',
		author_date_unix_timestamp: 'STRING',
		author_email: 'STRING',
		author_date: 'STRING',
		commit_message: 'STRING',
		repository_id:'STRING',
		//Statistics
		contains_bug: {
		    type: 'BOOLEAN',
		    defaultsTo: false
		},
		ns: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		nd: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		nf: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		entrophy: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		la: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		ld: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		fileschanged: {
		    type: 'STRING',
		    defaultsTo: undefined
		},
		lt: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		ndev: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		age: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		nuc: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		exp: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		rexo: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
		sexp: {
		    type: 'FLOAT',
		    defaultsTo: 0
		},
    
  }

};
