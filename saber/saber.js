(function(global, undefined) {
	if(!global.Saber) {
		global.Saber = {};
	}
	var Saber = global.Saber;
	var doc = document;
	var oldWebKit = +/AppleWebKit\/(\S+)/.exec(navigator.userAgent)[1]<535.23;
	var regExp = {
		'isCss': /^[^.]\S+\.css\s*$/g,
		'comment': /\/\//
	};
	var cachedModules = [];
	function uri(id) {
		var ref = Saber["config"].path || "";
		var uri = ref + id;
		uri = uri.replace(/\/\/+/g, '\/');
		return uri;
	};
	function request(uri, callback) {
		// first transform to lower case and clear the space in the uri
		uri = uri.toLowerCase().replace(/\s+/g, '');
		var isCss = regExp.isCss.test(uri);

		var loader = doc.createElement(isCss?"link":"script");
		live(loader, isCss);
		if(isCss) {
			loader.rel = "stylesheet";
			return true;
		}
	};
	function live(loader, isCss) {
		var unsupported = isCss && (oldWebKit || !("onload" in loader));
		if(unsupported) {
			pullCss(loader);
		}
		loader.onload = loader.oncomplete = loader.onreadystatechange = function() {};
	};
	function pullCss(loader) {};
	// function request(id) {
	// 	var modUri = uri(id);
	// 	var mod = null;
	// 	if(mod = cachedModules[modUri]) {
	// 		return mod;
	// 	}
	// 	mod = new Module(id, modUri);
	// 	mod.load();
	// };
	function Module(id, uri) {
		this.id = id;
		this.uri = uri;
	};
	Module.prototype.load = function() {};
})(this);