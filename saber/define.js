(function(global, undefined) {
	var CONFIG = {
		"method": "GET",
		"data": {},
		"charset": "UTF-8",
		"type": "json",
		"ansyc": true,
		"header": {},
		"success": emptyFunc,
		"fail": emptyFunc,
		"requesting": emptyFunc,
		"timeout": 60*1000
	};
	global.Http = function() {
		this.xhr = XHR();
	}
	global.Http.prototype.request = function(url, conf) {
		if(!url && !$.is(url, "string")) {
			throw new Error("Need A Request URL")
		}
		xhr = this.xhr||XHR();
		if(!xhr) {return false}
		var config = parseParam(CONFIG, conf);
		config.method = config.method.toUpperCase();
		if(!config["header"]["Content-Type"]){
			config["header"]["Content-Type"] = "application/x-www-form-urlencoded";
		}
		if(!config["header"]["X-Requested-With"]){
			config["header"]["X-Requested-With"] = "XMLHttpRequest";
		}
		var isGet = !!(config.method=="GET");
		var ds = [];
		forEach.call(ds, config.data, function(key, value) {
			this.push(key+"="+value)
		});
		var data = ds.join("&");
		var tout = setTimeout(function() {
			xhr.abort()
			config.fail(null, xhr)
		}, config.timeout)
		if(config.ansyc) {
			xhr.onreadystatechange = function() {
				clearTimeout(tout);
				if(xhr.readyState==4) {
					var res = getResponse(config.type, xhr);
					if(xhr.status>=200&&xhr.status<400){
						config.success(res, xhr)
					}else{
						config.fail(null, xhr)
					}
				}else{
					config.requesting(xhr.readyState)
				}
			}
		}
		xhr.open(config.method, url+(isGet&&data?"?"+data:""), config.ansyc);
		forEach(config.header, function(key, value) {
			xhr.setRequestHeader(key, value);
			return value
		});
		xhr.send(isGet?null:data)
	}
	global.Http.prototype.abort = function() {
		this.xhr.abort()
	}
	global.Http.request = function(url, conf) {
		var http = new Http();
		http.request(url, conf);
		return http
	}
	function XHR() {
		var xhr = null;
		try{
			xhr = new XMLHttpRequest()
		}catch(e) {
			try{
				xhr = new ActiveXObject("Msxml2.XMLHTTP")
			}catch(e){
				try{
					xhr = new ActiveXObject("Microsoft.XMLHTTP")
				}catch(e){
					xhr = null
				}
			}
		}
		return xhr
	}
	function getResponse(type, xhr) {
		var res = null;
		if(type=="json") {
			res = xhr.responseText&&$.is(xhr.responseText, "string") ? eval("("+xhr.responseText+")") : {}
		}else if(type=="text") {
			res = xhr.responseText
		}else if(type=="xml") {
			res = xhr.responseXML
		}
		return res
	}
	function forEach(who, handler, type) {
		if(who.constructor == Array){
			var re = [];
			for(var k = 0, len = who.length; k < len; k++) {
				re.push(handler(k, who[k]))
			}
		}else{
			re = {};
			for(var j in who) {
				re[j] = handler(j, who[j])
			}
		}
		return re;
	}
	function parseParam(src, obj) {
		return forEach(src, function(key, value) {
			return obj[key]||value
		})
	}
	function emptyFunc() {}
})(this);

(function(global, undefined) {
	var REGEXP = {
		"jsComment": /((\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(\/\/.*))/gm,
		"module": /require\("\s*([^\s]+)\s*"\)/gm
	}
	var Cached = {
		"completedModules": {},
		"loadingModules": {}
	}
	function define(mod) {
		var module = new Module(mod, this);
		var modID = module.id;
		if(Cached.completedModules[modID]) {
			module.parent.complete(module);
			return "complete"
		}
		if(Cached.loadingModules[modID]) {
			return "loading"
		}
		Cached.loadingModules[modID] = module;
		var http = new Http();
		http.request(define.config.base + module.mod, {
			"type": "text",
			"success": function(_mod, xhr) {
				module.defined(_mod)
			}
		})
		return "loading"
	}
	define.config = {
		"base": "/"
	}
	function Module(mod, parent) {
		this.mod = mod;
		this.parent = parent;
		this.moduleCode = ""; // module code for eval after all the dependencies complete
		this.id = "__Saber__defined__" + mod;
		this.dependencies = [];
		this.dependent = 0;
		this.uncomplete = 0;
		this.lock = false;
		this.queue = [];
	}
	Module.prototype.defined = function(module) {
		var modCode = module.toString();
		// 1. delete the comments
		modCode = RemoveComments(modCode);
		this.moduleCode = modCode;
		// 2. find out the dependent modules
		var depModules = CheckoutModules(modCode);
		this.dependencies = depModules;
		this.dependent = this.uncomplete = depModules.length;
		if(!this.dependent) {
			return this.eval();
		}
		// 3. manipulate the modules
		for(var k = this.dependent;k;) {
			define.call(this, this.dependencies[--k])
		}
	}
	Module.prototype.complete = function(mod) {
		if(this.lock) {
			this.queue.push(mod);
			return "complete_waiting"
		}
		this.lock = true;
		if(!(--this.uncomplete)) {
			return this.eval()
		}else {
			var nextMod = this.queue.shift();
			this.complete(nextMod);
			return "dealing"
		}
	}
	Module.prototype.eval = function() {
		eval.call(global, this.moduleCode);
		Cached.completedModules[this.id] = true;
		Cached.loadingModules[this.id] = undefined;
		if(this.parent === global) {
			return "complete"
		}
		this.parent.complete(this);
		return "dealing"
	}
	global.define = define;
	global.require = function() {};
	function RemoveComments(str) {
		return str.replace(REGEXP.jsComment, "").replace(/(^\r|\n$)|^\s+|\s+$/gm, ";")
	}
	function CheckoutModules(mod) {
		var ret = [];
		var _mod = null;
		while(_mod = REGEXP.module.exec(mod)) {
			ret.push(_mod[1])
		}
		return ret
	}
})(this)