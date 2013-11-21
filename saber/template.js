define("template", function(require, exports, module) {
	// template.get, template.builder
	var tpl = {
		"articles": "articles: <a href=\"${url}\">${name}</a>",
		"article": {
			"a": "article: <h1>${title}</h1>",
			"b": "article: <h2>${title}</h2>"
		},
		"tags": "Tags: <a href=\"${url}\">${name}</a>",
		"tag": {
			"a": "tag: <div style=\"background-color:red;\">${tag}</div>",
			"b": "tag: <div style=\"background-color:blue;\">${tag}</div>"
		}
	};
	var emptyContainer = document.createElement("div");
	var proToString = Array.prototype.toString;
	exports.get = function(paths) {
		var p = null;
		var T = tpl;
		while(p = paths.shift()) {
			T = T && T[p];
			if (!paths.length) break;
		}
		return T;
	};
	exports.builder = function(tpl, info) {
		var re = [];
		if(proToString.call(info) !== "[object Array]") {
			info = [info];
		}
		var currInfo = null, curr = null;
		var tempTpl = tpl;
		for(var k = 0, len = info.length; k < len; k++) {
			currInfo = info[k];
			for(var k in currInfo) {
				curr = currInfo[k];
				tempTpl = tempTpl.replace(new RegExp("\\$\\{\\s*"+k+"\\\\s*}", "gm"), curr);
			};
			re.push(tempTpl);
			tempTpl = tpl;
		}
		emptyContainer.innerHTML = re.join("");
		var node = emptyContainer.firstElementChild || emptyContainer.firstChild;
		emptyContainer.innerHTML = "";
		return node.;
	};
});