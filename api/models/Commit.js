/**
 * Commit
 * 
 * @module :: Model
 * @description :: The commit module for finding commits
 * 
 */

module.exports = {
	tableName: 'commits',
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	attributes: {
		
		// Basic Attributes
		commit_hash: {
			type: 'STRING',
			primaryKey: true
		},
		author_name: {
			type: 'STRING'
		},
		author_date_unix_timestamp: {
			type: 'STRING'
		},
		author_email: {
			type: 'STRING'
		},
		author_date: {
			type: 'STRING'
		},
		commit_message: {
			type: 'STRING'
		},
		repository_id: {
			type: 'STRING'
		},
		
		// Statistics
		fix: {
			type: 'STRING'
		},
		
		classification: {
			type: 'STRING'
		},
		
		contains_bug: {
			type: 'BOOLEAN',
			defaultsTo: false
		},
		
		fixes: {
			type: 'STRING',
			defaultsTo: ""
		},
		
		linked: {
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
		rexp: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		sexp: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		
		glm_probability: {
			type: 'FLOAT',
			defaultsTo: 0
		}

	}

};
