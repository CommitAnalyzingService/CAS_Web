/**
 * Feedback
 * 
 * @module :: Model
 * @description :: The feedback abstraction orm
 * 
 */

module.exports = {
	tableName: 'feedback',
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	attributes: {
		id: {
			type: 'STRING',
			primaryKey: true
		},
		commit_hash: {
			type: 'STRING'
		},
		score: {
			type: 'INTEGER'
		},
		comment: {
			type: 'STRING'
		},
	}

};
