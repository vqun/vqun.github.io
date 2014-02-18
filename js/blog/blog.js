(function($, undefined) {
	var main = $.id("main-panel");

	var start = location.href.indexOf("?");
	if(start==-1){
		location.href = "/";
		return false
	}
	var blog = location.href.slice(start+1) + ".json";
	var http = new $.Http();
	http.request(blog, {
		"success": function(data, xhr) {
			var tpl = data.template;
			document.title = data.title;
			var tplInter = new $.Http();
			tplInter.request(tpl, {
				"type": "text",
				"success": function(_tpl, xhr) {
					var c = $.forEach(data.content, function(key, value) {
						var i = value.indexOf("{");
						var _type = value.slice(0,i);
						var _content = value.slice(i+1,-1);
						if(_type=="CONTENT") {
							return "<p>"+_content+"</p>"
						}
						if(_type=="IMAGE"){
							return "<p class=\"img_content\"><a href=\""+_content+"\" target=\"_blank\">"+"<img src=\""+_content+"\" alt=\"\" /></a></p>"
						}
					})
					data.content = c.join("")
					$.forEach(data, function(key, value) {
						_tpl = _tpl.replace(new RegExp("\\$\\$\\{"+key+"\\}", "g"), value)
					})
					main.innerHTML = _tpl
				},
				"fail": function(d, xhr) {
					console.log(xhr.status)
				}
			})
		},
		"fail": function(d, xhr) {
			console.log(xhr.status)
		}
	})
})(Saber)