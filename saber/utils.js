define("utils", function(require, exports, module) {
	var defaultArgs = {
		"url": "",
		"method": "get",
		"data": {},
		"type": "json",
		"timeout": 10,
		"success": function() {},
		"error": function() {}
	};
	xhrCache = [];
	exports.ajax = function(args) {
		var opts = parseParam({}, args);
	};
	function parseParam(oSource, oParams, isown) {
		var key, obj = {};
		oParams = oParams || {};
		for (key in oSource) {
			obj[key] = oSource[key];
			if (oParams[key] != null) {
				if (isown) {
					if (oSource.hasOwnProperty(key)) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
	function getXHR() {
		var xhr = null;
		try {
			xhr = new XMLHttpRequest();
		}catch (try_MS) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}catch (other_MS) {
				try {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}catch (e) {
					xhr = null;
				}
			}
		}
		return xhr;
	};
});