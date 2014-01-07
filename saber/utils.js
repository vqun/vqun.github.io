(function(global, undefined) {
	global.Saber = global.S = {};
	var S = global.Saber;
	var ArraySlice = Array.prototype.slice,
		ObjToString = Object.prototype.toString;
	S.All = document.getElementsByTagName("*");
	S.$ = function(id) {return document.getElementById(id)};
	S.T = function(tag) {return document.getElementsByTagName(tag)};
	S.C = function(who, ref) {
		var re = [];
		if(!Is(who, 'string')) return re;
		who = Trim(who);
		try{
			var temp = ref && IsNode(ref) && ref.getElementsByClassName(who) || [];
			re = ArraySlice.call(temp)
		}catch(err) {
			var all = (ref && IsNode(ref) && ref.getElementsByTagName("*")) || S.All;
			var k = 0;
			var curr = null;
			var reg = new RegExp('\\b' + who + '\\b');
			while(curr = all[k]) {
				reg.test(curr.className) && re.push(curr);
				++k;
			}
			all = curr = null;
		}
		return re;
	};
	S.IE = +navigator.userAgent.replace(/.*?MSIE\s+(\d+\.\d*).*/, "$1")||0;
	S.trim = Trim;
	S.style = Style;
	S.styles = Styles;
	// add the units to the styles
	S.cssUnits = CssUnits;
	// parse the css json to a cssText string and add the units to the styles
	S.cssParser = CssParser;
	S.cssFormat = CssFormat;
	S.cssText = CssText;
	S.first = First;
	S.on = On;
	S.off = Off;
	S.isNode = IsNode;
	S.is = Is;
	S.emptyFunc = function() {}
	S.forEach = ForEach;
	S.parseParam = ParseParam;
	S.clear = Clear;
	function ParseParam(src, obj) {
		return ForEach(src, function(key, value) {
			return obj[key]||value
		})
	}
	function ForEach(who, handler, type) {
		if(Is(who, "array")){
			var re = [];
			for(var k = 0, len = who.length; k < len; k++) {
				re.push(handler(k, who[k]))
			}
		}else{
			if(Is(type, "array")) {
				re = [];
				for(var j in who) {
					re.push(handler(j, who[j]))
				}
			}else {
				re = {};
				for(var j in who) {
					re[j] = handler(j, who[j])
				}
			}
		}
		return re;
	}
	function Trim(who) {
		if(!Is(who, 'string')) {return who}
		return who.replace(/^\s+|\s+$/, '')
	}
	function Clear(who) {
		if(!Is(who, "string")) {
			return who
		}
		return who.replace(/\s+/g, "")
	}
	function IsNode(who) {return !!who && who.nodeType===1}
	function Is(who, what) {
		if(what.toLowerCase() === 'node') {
			return IsNode(who)
		}
		var temp = ObjToString.call(who).slice(8, -1);
		return temp.toLowerCase() === what.toLowerCase()
	}
	function Style(who, what, value) {
		if(!IsNode(who)) {
			return '';
		}
		var ret = "";
		if(value != undefined) {
			if(S.IE&&S.IE<9) {
				switch(what){
					case "opacity":
						who.style.filter="alpah(opacity="+(+value*100)+")";
						if (!who.currentStyle || !who.currentStyle.hasLayout) {
							who.style.zoom = 1;
						}
					return value;
					case "float":
						what = "styleFloat";
					break;
				}
			}else {
				if(what=="float") {
					what="cssFloat"
				}
			}
			return (who.style[what] = value);
		}
		if(S.IE&&S.IE<9) {
			ret = 100;
			switch(what){
				case "opacity":
					try{
						ret = who.filters["alpha"].opacity
					}catch(e) {
						try{
							ret = who.filters["DXImageTransform.Microsoft.Alpha"].opacity
						}catch(e) {}
					}
				return ret/100;
				case "float":
					what = "styleFloat";
				break;
			}
		}else {
			if(what=="float") {
				what="cssFloat"
			}
		}
		var computed = who.currentStyle || (document.defaultView && document.defaultView.getComputedStyle(who, null));
		ret = computed[what];
		if(what == 'width' || what == 'height') {
			what = what == 'width' ? 'offsetWidth': 'offsetHeight';
			ret = ret === 'auto' ? who[what] : ret
		}
		return ret || ""
	}
	function Styles(who, what, set) {
		if(!IsNode(who)) {
			return {}
		}
		if(!!set){
			var oldCssText = who.style.cssText;
			return (who.style.cssText = oldCssText + CssParser(what));
		}else {
			return ForEach(what, function(key, value) {
				return Style(who, key)
			})
		}
	}
	function CssUnits(who) {
		var controlor = {};
		controlor.add = function() {
			return ForEach(who, function(key, value) {
				var ret = value;
				if(CssUnits.Maps.test(key) && Is(value, "number")) {
					ret += "px"
				}
				return ret
			})
		}
		controlor.remove = function() {
			return ForEach(who, function(key, value) {
				if(CssUnits.Maps.test(key)){
					return parseFloat(value)||0
				}else {return value}
				// return /^(\d+(\.\d*)?)[a-zA-Z]*/.test(value) && parseFloat(value) || value
			})
		}
		return controlor
	}
	CssUnits.Maps = /height|width|left|top|padding|margin|right|bottom|radius/i;
	function CssParser(who) {
		var prefix = ";";
		var formated = CssFormat(who, true);
		var cssArr = ForEach(formated, function(key, value) {
			if(key=="opacity" && S.IE&&S.IE<9){
				key = "filter";
				value = "alpha(opacity="+(+value*100)+")"
			}
			return key + ":" + value
		}, [])
		return prefix + cssArr.join(";")
	}
	// Delete/Add the dashes to change the keys in format "webkitBorderRadius"/"-webkit-border-radius"
	function CssFormat(who, add) {
		var ret = {}
		add = typeof add !== "undefined" ? add : true;
		ForEach(who, function(key, value) {
			if(add && !/\-/.test(key)){
				// format "webkitBorderRadius" to "-webkit-border-radius"
				ret[addDash(key)] = value
				return value
			}else{
				return (ret[key]=value);
			}
			ret[removeDash(key)]=value;
			return value
		})
		return ret
	}
	function addDash(who) {
		return who.replace(/[A-Z]/g, function(m){return "-"+m.toLowerCase()})
	}
	function removeDash(who) {
		var keys = who.split("-");
		var newKeys = null;
		var start = 1;
		if(!keys[0] && (keys[1]=="ms"||keys[1]=="webkit")) {
			// the ms and webkit is in format of "ms" or "webkit", start = 2
			// the others is in format of "MozBorderRadius" || "borderRadius", start = 1
			start = 2;
		}
		newKeys = ForEach(keys.slice(start), function(k, v) {
			return FirstUpper(v)
		})
		newKeys.splice(0, 0, keys[start-1]);
		return newKeys.join("")
	}
	function FirstUpper(who) {
		if(!Is(who, "string")) {
			return who
		}
		// var ret = who.split("");
		// return ret[0].toUpperCase()+ret.slice(1).join("")
		return who.replace(/(^.)(.*)/, function(m0,m1,m2){return m1.toUpperCase()+m2})
	}
	function CssText(who) {
		if(!IsNode(who)) {
			return null
		}
		var cssTextArr = who.style.cssText.split(";");
		var cssText = {};
		for(var k in cssTextArr) {
			var temp = cssTextArr[k].split(":")
			temp.length == 2 && (cssText[removeDash(Trim(temp[0]).toLowerCase())] = Trim(temp[1]))
		}
		var controlor = {};
		controlor.push = function(who) {
			ForEach(who, function(key, value) {
				cssText[key] = value
				return value
			})
			return this
		}
		controlor.toString  = function() {
			cssText = CssUnits(cssText).add();
			return CssParser(cssText)
		}
		return controlor
	}
	function First(who) {
		if(!IsNode(who)) {
			return null;
		}
		var c = null;
		c = who.firstElementChild || (function(el){
			var tmp = el;
			while(c = tmp.firstChild) {
				if(c.nodeType === 1) break;
				tmp = c;
			}
			return c;
		})(who)
		return c
	}
	function On(el, type, handler) {return evtAccess(el, type, handler)}
	function Off() {return evtAccess(el, type, handler, 1)}
	function evtAccess(el, type, handler, off) {
		if(!IsNode(el) || !type || !Is(handler, 'function')) {
			return false
		}
		var action = (!off && 'addEventListener') || 'removeEventListener';
		try{
			el[action](type, handler, true);
		}catch(e1) {
			try {
				action = !off && 'attachEvent' || 'detachEvent';
				el[action]('on'+type, handler);
			}catch(e2) {
				el['on'+type] = handler;
			}
		}
	}
})(window)