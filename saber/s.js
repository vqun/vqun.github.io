define("s", function(require, exports, module) {
	var router = require("router");
	var routerInfo = router(location.href);
	console.log(routerInfo)
});