/**
 * UiController
 */
var UiController = {
    index: function(req, res) {
    	res.sendfile('views/'+req.param('controller') + '/ui/' + req.param('file'));
    }
};

module.exports = UiController;