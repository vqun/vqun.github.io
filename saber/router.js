// Only supports the http protocol based urls
// URL parse regular expression, Using exec returns:
// [href, protocol, auth, host, hostname, port, path, pathname, search, query, hash]
// If the url is a relative-url, the href is the matched string, and protocol/auth/host/hostname/port are all undefined
// all returns are translated to lower case.
// ex.
// urlReg.exec('http://user:pw@www.baidu.com:8080/ab/cd/e.js?q=9#hehe')
// ["http://user:pw@www.baidu.com:8080/ab/cd/e.js?q=9#hehe", "http:", "user:pw", "www.baidu.com:8080", "www.baidu.com", "8080", "/ab/cd/e.js?q=9", "/ab/cd/e.js", "?q=9", "q=9", "#hehe"]
define('router', function(require, exports, module) {
	var urlReg = /(?:(http\:|https\:)\/\/(?:(\w+\:\w+)\@)?((\w+(?:\.\w+)+)(?:\/?\:(\d+))?))?((\/?[^#?]*)*(\?(\w+\=\w*))?)(#[^\s]+)?/i;
	var defaultURL = {
		"href": "",
		"protocol": "http:",
		"auth": "",
		"host": location.host,
		"hostname": location.host.replace(/\:\d+/, ''),
		"port": "80",
		"path": "",
		"pathname": "",
		"search": "",
		"query": "",
		"hash": ""
	};
	exports.parse = function(url) {
		if(typeof url !== 'string') {
			return url;
		}
		url = url.toLowerCase();
		var parseResult = urlReg.exec(url);
		if(!parseResult[0]) {
			return defaultURL;
		};
		return {
			"href": parseResult[0] || defaultURL["href"],
			"protocol": parseResult[1] || defaultURL["protocol"],
			"auth": parseResult[2] || defaultURL["auth"],
			"host": parseResult[3] || defaultURL["host"],
			"hostname": parseResult[4] || defaultURL["hostname"],
			"port": parseResult[5] || defaultURL["port"],
			"path": parseResult[6] || defaultURL["path"],
			"pathname": parseResult[7] || defaultURL["pathname"],
			"search": parseResult[8] || defaultURL["search"],
			"query": parseResult[9] || defaultURL["query"],
			"hash": parseResult[10] || defaultURL["hash"]
		};
	};
	exports.format = function() {};
	exports.resolve = function() {};
});