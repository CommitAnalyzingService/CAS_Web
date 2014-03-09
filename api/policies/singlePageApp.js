/**
 * Send layout if not, then JSON
 */
module.exports = function(req, res, ok) {

	// Only allow through for JSON requests
	if(req.wantsJSON) {
		return ok();
	} else {
		res.render('layout');
	}
};