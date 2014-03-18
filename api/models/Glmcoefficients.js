/**
 * Repository
 * 
 * @module :: Model
 * @description :: The repositories abstraction class
 * 
 */

module.exports = {
	tableName: 'glm_coefficients',
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	attributes: {
		repo: {
			type: 'STRING',
			primaryKey: true
		},
		intercept: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		intercept_sig: {
			type: 'FLOAT'
		},
		ns: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ns_sig: {
			type: 'FLOAT'
		},
		nd: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nd_sig: {
			type: 'FLOAT'
		},
		nf: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nf_sig: {
			type: 'FLOAT'
		},
		entrophy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		entrophy_sig: {
			type: 'FLOAT'
		},
		la: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		la_sig: {
			type: 'FLOAT'
		},
		ld: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ld_sig: {
			type: 'FLOAT'
		},
		lt: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		lt_sig: {
			type: 'FLOAT'
		},
		ndev: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ndev_sig: {
			type: 'FLOAT'
		},
		age: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		age_sig: {
			type: 'FLOAT'
		},
		nuc: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nuc_sig: {
			type: 'FLOAT'
		},
		exp: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		exp_sig: {
			type: 'FLOAT'
		},
		rexp: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		rexp_sig: {
			type: 'FLOAT'
		},
		sexp: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		sexp_sig: {
			type: 'FLOAT'
		}
	}
};
