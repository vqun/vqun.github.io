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
		var opts = parseParam({
			'url': '',
			'charset': 'UTF-8',
			'timeout': 30 * 1000,
			'args': {},
			'onComplete': null,
			'onTimeout': $.core.func.empty,
			'uniqueID': null,
			
			'onFail': $.core.func.empty,
			'method': 'get', // post or get
			'asynchronous': true,
			'header' : {},
			'isEncode' : false,
			'responseType': 'json'// xml or text or json
		}, args);
		
		if (opts.url == '') {
			throw 'ajax need url in parameters object';
		}
		
		var tm;
		
		var trans = getXHR();
		
		var cback = function(){
			if (trans.readyState == 4) {
				clearTimeout(tm);
				var data = '';
				if (opts['responseType'] === 'xml') {
						data = trans.responseXML;
				}else if(opts['responseType'] === 'text'){
						data = trans.responseText;
				}else {
					try{
						if(trans.responseText && typeof trans.responseText === 'string'){
							
							// data = $.core.json.strToJson(trans.responseText);
							data = eval('(' + trans.responseText + ')');
						}else{
							data = {};
						}
					}catch(exp){
						data = opts['url'] + 'return error : data error';
						// throw opts['url'] + 'return error : syntax error';
					}

				}
				if (trans.status == 200) {
					if (opts['onComplete'] != null) {
						opts['onComplete'](data);
					}
				}else if(trans.status == 0){
					//for abort;
				} else {
					if (opts['onFail'] != null) {
						opts['onFail'](data, trans);
					}
				}
			}
			else {
				if (opts['onTraning'] != null) {
					opts['onTraning'](trans);
				}
			}
		};
		trans.onreadystatechange = cback;
		
		if(!opts['header']['Content-Type']){
			opts['header']['Content-Type'] = 'application/x-www-form-urlencoded';
		}
		if(!opts['header']['X-Requested-With']){
			opts['header']['X-Requested-With'] = 'XMLHttpRequest';
		}
		
		if (opts['method'].toLocaleLowerCase() == 'get') {
			var url = $.core.util.URL(opts['url'],{
				'isEncodeQuery' : opts['isEncode']
			});
			url.setParams(opts['args']);
			url.setParam('__rnd', new Date().valueOf());
			trans.open(opts['method'], url.toString(), opts['asynchronous']);
			try{
				for(var k in opts['header']){
					trans.setRequestHeader(k, opts['header'][k]);
				}
			}catch(exp){
			
			}
			trans.send('');
			
		}
		else {
			trans.open(opts['method'], opts['url'], opts['asynchronous']);
			try{
				for(var k in opts['header']){
					trans.setRequestHeader(k, opts['header'][k]);
				}
			}catch(exp){
			
			}
			trans.send($.core.json.jsonToQuery(opts['args'],opts['isEncode']));
		}
		if(opts['timeout']){
			tm = setTimeout(function(){
				try{
					trans.abort();
					opts['onTimeout']({}, trans);
					opts['onFail']({}, trans);
				}catch(exp){
					
				}
			}, opts['timeout']);
		}
		return trans;
	};
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