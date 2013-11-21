define("fs", function(require, exports, module) {
	// fs.read
	var utils = require("utils");
	exports.read = function(file, callback) {
		var args = {
			"url": file,
			"success": callback,
			"method": "post" // file read force post
		};
		utils.ajax(args);
	};
});