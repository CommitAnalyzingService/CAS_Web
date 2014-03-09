/**
 * UiController
 */
var UiController = {
    index: function(req, res) {
    	res.sendfile('views/'+req.param('controller') + '/' + req.param('file'));
    }
};

module.exports = UiController;