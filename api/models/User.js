/**
 * User
 * 
 * @module :: Model
 * @description :: The users abstraction class
 * 
 * Note that waterline's default fields for createdAt and updatedAt are
 * part of the model
 * 
 */

module.exports = {
	tableName: 'users',
	migrate: 'safe',
	autoPK: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: {
			type: 'uuidv4',
			primaryKey: true,
			required: false
		},

		email: {
			type: 'email',
			required: true
		},

		password: {
			type: 'string',
			required: true
		},
		
		/**
		 * Delete the password before use anywhere
		 * @returns The current model without a password
		 */
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},
		
		/**
		 * Checks if the provided password is correct
		 * @param password The raw password to check
		 * @returns {Boolean} The validitiy of the password
		 */
		isCorrectPassword: function(password) {
			return Utils.password.hash(password) === this.password;
		}
	},
	
	/**
	 * Generate default values
	 * 
	 * @param values The current object
	 * @param next The callback to continue
	 */
	beforeCreate: function(values, next) {
		User.countByEmail(values.email, function(err, count ) {
			if(!err) {
				
				// If there is another with the same email, stop creation
				if(count > 0) {
					return next('This email is already taken');
				}
				
				// Generate the new uuid
				var newId = Utils.genUUID();

				// Set the required values
				values.id = newId;
				
				// Hash the password 
				values.password = Utils.password.hash(values.password);

				// Continue the creation
				next();
				
			} else {
				sails.log.error('beforeCreate() User checking for duplicate emails gave error:', err);
				next(err);
			}
			
		});
		
	}
};