/**
 * Commit
 *
 * @module      :: Model
 * @description :: The Metircs Model
 *
 */

module.exports = {
  tableName: 'metrics',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  attributes: {
	  repo: {
		  type:'STRING'
	  }
	  nsbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		nsnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ndbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ndnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		nfbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		nfnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		entrophy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		entrophynonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		labuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		lanonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ldbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ldnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ltbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ltnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ndevbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		ndevnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		agebuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		agenonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		nucbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		nucnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		expbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		expnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		rexononbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		rexonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		sexpbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		},
		sexpnonbuggy: {
		   type: 'FLOAT',
		   defaultsTo: 0
		}
    
  }

};
