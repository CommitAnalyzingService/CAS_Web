/**
 * Repository
 *
 * @module      :: Model
 * @description :: The repositories abstraction class
 *
 */

module.exports = {
	tableName: 'repositories',
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	attributes: {
		id: {
			type: 'STRING',
			primaryKey: true
		},
		name: {
			type: 'STRING'
		},
		url: {
			type: 'STRING'
		},
		creation_date: {
			type: 'STRING'
		},
		ingestion_date: {
			type: 'STRING'
		},
		analysis_date: {
			type: 'STRING'
		},
		email: {
			type: 'STRING'
		},
		status: {
			type: 'STRING'
		},
	}
};
