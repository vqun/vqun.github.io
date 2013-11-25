define("fs", function(require, exports, module) {
	// fs.read
	// var utils = require("utils");
	var J = require("jQuery");
	var $ = J.jQuery;
	exports.read = function(file, callback) {
		// var args = {
		// 	"url": file,
		// 	"onComplete": callback,
		// 	"method": "post" // file read force post
		// };
		// utils.ajax(args);
		$.ajax(file, {
			"dataType": "json",
			"success": callback
		});
	};
});