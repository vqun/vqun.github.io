(function(global, undefined) {
	global.Saber = global.S = {};
	var S = global.Saber;
	var ArraySlice = Array.prototype.slice,
		ObjToString = Object.prototype.toString;
	S.All = document.getElementsByTagName("*");
	S.$ = function(id) {return document.getElementById(id)};
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
	S.trim = Trim;
	S.style = Style;
	S.styles = Styles;
	S.cssParser = CssParser;
	S.cssText = CssText;
	S.first = First;
	S.on = On;
	S.off = Off;
	S.isNode = IsNode;
	S.is = Is;
	S.emptyFunc = function() {}
	S.forEach = ForEach;
	S.parseParam = ParseParam;
	function ParseParam(src, obj) {
		return ForEach(src, function(key, value) {
			return obj[key]||value
		})
	}
	function ForEach(who, handler) {
		if(Is(who, "array")){
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
	function Trim(who) {
		if(!Is(who, 'string')) {return who}
		return who.replace(/^\s+|\s+$/, '')
	}
	function clear(who) {}
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
		if(value != undefined) {
			return (who.style[what] = value);
		}
		var computed = (document.defaultView && document.defaultView.getComputedStyle(who, null)) || who.currentStyle;
		var re = computed[what];
		if(what == 'width' || what == 'height') {
			what = what == 'width' ? 'offsetWidth': 'offsetHeight';
			re = re === 'auto' ? who[what] : re
		}
		return re || ''
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
	function CssParser(what) {}
	function CssText(who) {
		var cssText = who.style.cssText.split(";");
		var controlor = {};
		controlor.push = function() {}
		controlor.toString  = function() {}
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