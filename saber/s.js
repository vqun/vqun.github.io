define("s", function(require, exports, module) {
	var router = require("router");
	var routerInfo = router.parse(location.href);
	// console.log(routerInfo);
	debugger;
	seajs.require(routerInfo.pathname.replace("/test", ""));
});