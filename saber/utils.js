define("utils", function(require, exports, module) {
	var JSON = {
		query: function(json) {
			if(Object.prototype.toString(json) !== "[object Object") return "";
			var querys = []
			for(var k in json) {
				querys.push(k+"="+(json[k]||""))
			}
			return querys.join("&")
		}
	}
	var defaultArgs = {
		"url": "",
		"method": "get",
		"data": {},
		"type": "json",
		"timeout": 10,
		"async": true,
		"header": {},
		"onSuccess": function() {},
		"onError": function() {},
		"onTimeout": function() {}
	}
	xhrCache = [];
	exports.ajax = function(args) {
		var opts = parseParam(defaultArgs, args);
		if(!opts.url) throw new Error("Need the request url");
		opts["type"] = opts["type"].toLowerCase();
		opts["data"]["_rnd"] = new Date().getTime();
		var query = JSON.query(opts["data"]);

		var inter = getXHR();
		inter.onreadystatechange = rsChange;
		if(!opts['header']['Content-Type']){
			opts['header']['Content-Type'] = 'application/x-www-form-urlencoded';
		}
		if(!opts['header']['X-Requested-With']){
			opts['header']['X-Requested-With'] = 'XMLHttpRequest';
		}
		var isGet = opts["method"].toLowerCase()==="get";
		inter.open(opts["method"], opts["url"]+(isGet&&("?"+query)||""), opts["async"])
		for(var k in opts["header"]) {
			inter.setRequestHeader(k, opts["header"][k])
		}
		inter.send(isGet&&""||query);
		var to = setTimeout(function() {
			try{
				inter.abort();
				opts["onTimeout"]({}, inter);
				opts["onError"]({}, inter)
			}catch(e){}
			clearTimeout(to)
		}, opts["timeout"]*1000);
		return inter;
		function rsChange() {
			if(inter.readyState === 4) {
				clearTimeout(to);
				var data = "";
				try{
					if(opts["type"] === "json") {
						data = eval("("+(inter.responseText &&
							typeof inter.responseText === "string" &&
							inter.responseText)+")")|| {};
					}else if(opts["type"] === "xml") {
						data = inter.responseXML
					}else if(opts["type"] === 'text') {
						data = inter.responseText
					}else {
						data = {}
					}
				}catch(e){
					data = opts["url"]+": return error data"
				}
				if(inter.status === 200) {
					opts["onSuccess"](data, inter)
				}else {
					opts["onError"](data, inter)
				}
			}
		}
	}
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
	}
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
	}
});