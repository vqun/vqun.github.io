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
	S.first = First;
	S.on = On;
	S.off = Off;
	S.isNode = IsNode;
	S.is = Is;
	function Trim(who) {
		if(!Is(who, 'string')) {return who}
		return who.replace(/^\s+|\s+$/, '')
	}
	function IsNode(who) {return !!who && !!who.nodeType && who.nodeType===1}
	function Is(who, what) {
		var temp = ObjToString.call(who).slice(8, -1);
		return temp.toLowerCase() === what
	}
	function Style(who, what, value) {
		if(!who || !who.nodeType || who.nodeType !== 1) {
			return '';
		}
		if(value != undefined) {
			return (who.style[what] = value);
		}
		var computed = (document.defaultView && document.defaultView.getComputedStyle(who, null)) || who.currentStyle;
		return parseInt(computed[what]) || 0
	}
	function First(who) {
		if(!who || !who.nodeType || who.nodeType !== 1) {
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