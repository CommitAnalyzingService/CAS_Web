/**
 * Default 404 (not found) handler
 * 
 * If no matches are found, Sails will respond using this handler:
 * 
 * For more information on 404/notfound handling in Sails/Express, check out:
 * http://expressjs.com/faq.html#404-handling
 */

module.exports[404] = function pageNotFound(req, res, express404Handler) {

	// If the user-agent wants a JSON response, send json
	if(req.wantsJSON) {
		return res.json({statusCode: 404, success: false, error: "404 Not Found"}, 404);
	}
	res.render('layout', null, function (err) {
	    if (err) {
	      return express404Handler();
	    }
	    res.render('layout');
	});
};