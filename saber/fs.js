define("fs", function(require, exports, module) {
	// fs.read
	var $ = require("utils");
	exports.read = function(file, callback) {
		var args = {
			"url": file,
			"onSuccess": callback,
			"method": "post" // file read force post
		};
		$.ajax(args);
	};
});