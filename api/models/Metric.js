/**
 * Commit
 * 
 * @module :: Model
 * @description :: The Metircs Model
 * 
 */

module.exports = {
	tableName: 'metrics',
	migrate: 'safe',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	autoPK: false,
	attributes: {
		repo: {
			type: 'STRING',
			primaryKey: true
		},
		nsbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nsnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ns_sig: {
			type: 'FLOAT',
		},
		ndbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ndnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nd_sig: {
			type: 'FLOAT',
		},
		nfbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nfnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nf_sig: {
			type: 'FLOAT',
		},
		entrophybuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		entrophynonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		entrophy_sig: {
			type: 'FLOAT',
		},
		labuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		lanonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		la_sig: {
			type: 'FLOAT',
		},
		ldbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ldnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ld_sig: {
			type: 'FLOAT',
		},
		ltbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ltnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		lt_sig: {
			type: 'FLOAT',
		},
		ndevbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ndevnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		ndev_sig: {
			type: 'FLOAT',
		},
		agebuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		agenonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		age_sig: {
			type: 'FLOAT',
		},
		nucbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nucnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		nuc_sig: {
			type: 'FLOAT',
		},
		expbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		expnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		exp_sig: {
			type: 'FLOAT',
		},
		rexpnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		rexpbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		rexp_sig: {
			type: 'FLOAT',
		},
		sexpbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		sexpnonbuggy: {
			type: 'FLOAT',
			defaultsTo: 0
		},
		sexp_sig: {
			type: 'FLOAT',
		},
	}
};
