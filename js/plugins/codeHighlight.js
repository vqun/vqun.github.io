(function(context, undefined) {
	var KEYS = {
		"string": ["\"([^\"]+)\""],
		"keyword": ["alert", "break", "case", "catch", "continue", "debugger",
			"default", "default", "delete", "do", "eval", "else", "finally",
			"for", "function", "if", "in", "instanceof", "new", "return",
			"switch", "this", "throw", "try", "typeof", "var", "void",
			"while", "with", "Object", "prototype", "Array", "Number",
			"String", "Boolean", "Null", "Undefined", "RegExp", "Function", "window",
			"\{", "\}", "console", "arguments", "setTimeout", "setInterval"],
		// "method": ["([\\w\\$\\_]+)?\\(([^\\(\\)]*)\\)"],
		"method": ["([\\w\\$\\_]+)\\("],
		// "object": ["(\\w+)\\.(\\w+)", "\\/([^\\/\\*][^\\>\\<]*)\\/"],
		"object": ["(([\\w\\$\\_]+)(\\.))+"],
		"css": [],
		"html": []
	}
	var HIGHLIGHT_LINE_TMPL = "<li class=\"line\">${code}</li>";
	context.CodeHighlight = CodeHighlight;
	function CodeHighlight(code, indentNum) {
		this.indentNum = indentNum || 4;
		this.coder = code;
		this.highlight(code, indentNum);
	}
	CodeHighlight.prototype.highlight = function(code, indentNum) {
		var _code = "", _codes = null;
		if(code.nodeType == 1) {
			if(code.tagName.toLowerCase()=="textarea") {
				_code = code.value;
			}
		}
		indentNum = indentNum || this.indentNum;
		var indent = "";
		for(var k = 0;k<indentNum;k++) {
			indent += "\u00A0"
		}
		_code = _code.replace(/\s*$/g, "");
		_code = _code.replace(/\t/gm, indent);
		// 字符串高亮
		var STRING_REG = new RegExp(KEYS.string.join("|"), "gm");
		_code = _code.replace(STRING_REG, function(m0, m1) {
			return "\"" + "<i class=\"string\">"+m1+"</i>" + "\""
		});
		// 关键字高亮
		var KEY_WORDS_REG = new RegExp("\\b("+KEYS.keyword.join("|")+")\\b", "gm");
		_code = _code.replace(KEY_WORDS_REG, function(m0) {
			return "<i class=\"keyword\">"+m0+"</i>"
		});
		// 方法高亮
		var METHOD_REG = new RegExp(KEYS.method.join("|"), "gm");
		_code = _code.replace(METHOD_REG, function(m0, m1, m2) {
			// return (m1?"<i class=\"method\">"+m1+"</i>":"") + "("+ (m2?"<i class=\"arguments\">"+m2+"</i>":"")+")"
			return "<i class=\"method\">"+m1+"</i>" + "("
		});
		// 对象高亮
		var OBJECT_REG = new RegExp(KEYS.object.join("|"), "gm");
		_code = _code.replace(OBJECT_REG, function(m0, m1, m2) {
			var ns = m0.split(".");
			var lights = [];
			// for(var k = 0, steps = ns.length-1;k<steps;k++) {
			// 	if(!(k%2)) {
			// 		lights.push("<i class=\"object\">"+ns[k]+"</i>")
			// 	}else {
			// 		lights.push("<i class=\"property\">"+ns[k]+"</i>")
			// 	}
			// }
			for(var k = 0, steps = ns.length-1;k<steps;k++) {
				if(!k) {
					lights.push("<i class=\"object\">"+ns[k]+"</i>")
				}else {
					lights.push("<i class=\"property\">"+ns[k]+"</i>")
				}
			}
			return lights.join(".") + "."
		});
		_codes = _code.split(/\n|\r/gm);
		// 删除最后一个空行
		var lastLine = _codes[_codes.length-1];
		if(/^\s+$/.test(lastLine) || !lastLine) {
			_codes.pop();
		}
		this.codes = _codes;
		return _code;
	}
	CodeHighlight.prototype.line = function(tmpl) {
		this.tmpl = tmpl || this.tmpl || HIGHLIGHT_LINE_TMPL;
		tmpl = this.tmpl;
		var ret = [];
		var _codes = this.codes;
		for(var k = 0, len=_codes.length;k<len;k++) {
			ret.push(tmpl.replace("${code}", "<pre>"+(_codes[k]||" ")+"</pre>"))
		}
		this.codes = ret;
		ret = null;
		return this
	}
	CodeHighlight.prototype.render = function(container) {
		this.container = container || this.container || document.body;
		container = this.container;
		container.className = "codeHighlight";
		container.innerHTML = this.codes.join("");
		return this
	}
	CodeHighlight.prototype.reset = function(code) {
		code = code || this.coder;
		var _code = this.highlight(code);
		this.line().render();
	}
	CodeHighlight.prototype.update = function() {
		this.reset(this.coder)
	}
})(Saber)