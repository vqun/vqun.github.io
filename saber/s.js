define("s", function(require, exports, module) {
	var router = require("router"),
		fs = require("fs");
	var tpl = require("template");
	var saber = require("saber");
	var routerInfo = router.parse(location.href);
	var file = routerInfo.hash.replace(/^#|\/$/g, "");
	if(!file) {
		return false;
	};
	var jsonFile = file + ".json";
	fs.read("resource/"+jsonFile, fCallback);
	var T = tpl.get(file.split("\/"));
	function fCallback(result) {
		// result = {code:10000, info: []}
		var node = tpl.builder(T, result.info);
		document.body.innerHTML = "";
		document.body.appendChild(node);
		saber.request(file);
	};
});