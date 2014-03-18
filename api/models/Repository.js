/**
 * Repository
 * 
 * @module :: Model
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
			type: 'uuidv4',
			primaryKey: true,
			required: false
		},

		name: {
			type: 'string',
			required: true
		},

		url: {
			type: 'url',
			required: true
		},

		creation_date: {
			type: 'string',
			required: false
		},

		ingestion_date: {
			type: 'string',
			required: false
		},

		analysis_date: {
			type: 'string',
			required: false
		},
		
		last_data_dump: {
			type: 'string',
			required: false
		},

		email: {
			type: 'email',
			required: false
		},

		status: {
			type: 'string',
			required: true,
			defaultsTo: 'Waiting to be Ingested'
		},

		listed: {
			type: 'BOOLEAN',
			defaultsTo: 'TRUE'
		},
	},
	
	/**
	 * Generate default values
	 * 
	 * @param values The current object
	 * @param next The callback to continue
	 */
	beforeCreate: function(values, next) {
		
		Repository.countByName(values.name, function(err, count ) {
			if(!err) {
				
				// If there is another with the same name, append the count
				if(count > 0) {
					values.name += '-' + count;
				}
				
				// Strip any leading/tailing whitespace
				values.name = Utils.string.trim(values.name);
				values.url = Utils.string.trim(values.url);
				values.email = Utils.string.trim(values.email);
				
				// Generate the new uuid
				var newId = Utils.genUUID();

				// Get the current formated date
				var now = Utils.date.now();

				// Set the required values
				values.id = newId;
				values.creation_date = now,

				// Continue the creation
				next();
				
			} else {
				sails.log.error('beforeCreate() od Repositiory checking for duplicate names gave error:', err);
			}
			
		});
		
	}

};
