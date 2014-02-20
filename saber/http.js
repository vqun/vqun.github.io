(function(global, $, undefined) {
	var CONFIG = {
		"method": "GET",
		"data": {},
		"charset": "UTF-8",
		"type": "json",
		"ansyc": true,
		"header": {},
		"success": $.emptyFunc,
		"fail": $.emptyFunc,
		"requesting": $.emptyFunc,
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
		var config = $.parseParam(CONFIG, conf);
		config.method = config.method.toUpperCase();
		if(!config["header"]["Content-Type"]){
			config["header"]["Content-Type"] = "application/x-www-form-urlencoded";
		}
		if(!config["header"]["X-Requested-With"]){
			config["header"]["X-Requested-With"] = "XMLHttpRequest";
		}
		var isGet = !!(config.method=="GET");
		var data = $.forEach(config.data, function(key, value) {
			return key+"="+value
		}, []).join("&");
		var tout = setTimeout(function() {
			xhr.abort()
			config.fail(null, xhr)
		}, config.timeout)
		if(config.ansyc) {
			xhr.onreadystatechange = function() {
				if(xhr.readyState==4) {
					clearTimeout(tout);
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
		$.forEach(config.header, function(key, value) {
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
})(Saber, Saber)