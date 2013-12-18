/**
 * Repository
 *
 * @module      :: Model
 * @description :: The repositories abstraction class
 *
 */

module.exports = {
  tableName: 'repositories',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  attributes: {
  	id: 'string',
  	name: 'string',
  	url: 'string',
  	creation_date: 'string',
  	ingestion_date: 'string',
  	analysis_date:'string',
  	email:'string'
  }

};
