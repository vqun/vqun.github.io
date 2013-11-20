define("s", function(require, exports, module) {
	var router = require("router");
	var routerInfo = router.parse(location.href);
	seajs.require(routerInfo.hash.replace("#test/", ""));
});