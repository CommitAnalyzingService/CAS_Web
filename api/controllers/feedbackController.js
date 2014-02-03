
// Duplicating this because I haven't looked into utility modules in sailsjs/nodejs
var genUUID = function() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

var FeedbackController = {
    submit: function(req, res) {
    	Feedback.create({
    		id: genUUID(),
    		commit_hash: req.param('commit_hash'),
    		score: req.param('score'),
    		comment: req.param('comment'),
    	}).done(function(err, feedback) {
    		if(!err) {
    			res.json({success: true});
    		} else {
    			console.log(err);
    			res.json({success: false, error: 'Could not submit feedback.'});
    		}
    		
    	})
    },
};

module.exports = FeedbackController;