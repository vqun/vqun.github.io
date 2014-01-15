(function(window, undefined) {
	var ObjToString = Object.prototype.toString;
	var RecommentModTpl = ""+
	"<dl class=\"recomment_mod\">"+
		"<dt class=\"avatar\"><img src=\"${avatarPath}\" alt=\"${fullName}\"></dt>"+
		"<dd><a href=\"${comment}${urlToken}\" title=\"${fullName}\">${fullName}</a></dd>"+
		"<dd>${bio}</dd>"+
		"<dd class=\"recomment_invite\"><a href=\"###\" title=\"\u9080\u8bf7\u56de\u7b54\" data-action=\"inviteAction\" data-info=\"invite\">\u9080\u8bf7\u56de\u7b54</a></dd>"+
	"</dl>";
	var InvitedModTpl = "<a href=\"${comment}${urlToken}\" title=\"${fullName}\">${fullName}</a>"

	var Evt = {
		on: function(el, type, handler) {
			return Evt.evtAccess(el, type, handler)
		},
		off: function(el, type, handler) {
			return Evt.evtAccess(el, type, handler, 1)
		},
		evtAccess: function(el, type, handler, off) {
			if(!el || el.nodeType!==1 || !type || Object.prototype.toString.call(handler).slice(8, -1)!=="Function") {
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
	};
	var recmmendWrap = null, recommendPosRef = null, searchInput = null,
		searchInvited = null, recommendNum = null;
	var actions = {
		lock: false,
		invitedNum: 0,
		defaultValue: "\u641c\u7d22\u4f60\u60f3\u9080\u8bf7\u7684\u4eba",
		inviteAction: function(evt) {
			evt = evt || window.event;
			var target = evt.target || evt.srcElement;
			var actionName = target.getAttribute("data-action");
			var actionInfo = target.getAttribute("data-info");
			if(!actionName || actionName != "inviteAction" || actions.lock) {
				return false;
			}
			actions.lock = true;
			var cls = "recomment_recall",
				attr = "recall",
				txt = "\u6536\u56de\u9080\u8bf7";
			if(actionInfo == "recall") {
				cls = "recomment_invite";
				attr = "invite";
				txt = "\u9080\u8bf7\u56de\u7b54";
				recommendNum.innerHTML = --actions.invitedNum
			}else {
				recommendNum.innerHTML = ++actions.invitedNum
			}
			target.parentNode.className=cls;
			target.setAttribute("data-info", attr);
			target.alt = txt;
			target.innerHTML = txt;
			actions.lock = false;
			try{
				evt.preventDefault();
			}catch(e) {
				evt.returnValue = false;
			}
		},
		searchFocus: function(evt) {
			evt = evt || window.event;
			var target = evt.target || evt.srcElement;
			if(target.value == actions.defaultValue) {
				target.value = ""
			}
			try{
				evt.preventDefault();
			}catch(e) {
				evt.returnValue = false;
			}
		},
		searchBlur: function(evt) {
			evt = evt || window.event;
			var target = evt.target || evt.srcElement;
			var v = trim(target.value);
			if(v == "") {
				target.value = actions.defaultValue
			}else{
				target.value = v;
			}
			try{
				evt.preventDefault();
			}catch(e) {
				evt.returnValue = false;
			}
		}
	};
	init();
	bindEvent();
	function init() {
		var tempDiv = document.createElement("div");
		var recommentMods = swipe(InviteData.recommended, RecommentModTpl, {
			"comment": InviteData.comment
		});
		recommendPosRef = document.getElementById("recommendPosRef");
		inserHTML(recommendPosRef, recommentMods.join(""), "afterend");

		var invitedData = InviteData.invited;
		searchInvited = document.getElementById("search_invited");
		var inviteds = swipe(invitedData, InvitedModTpl, {
			"comment": InviteData.comment
		});
		var tempHTML = ""+
		"\u60a8\u5df2\u9080\u8bf7" +
		inviteds.slice(0,2).join("\u3001") +
		"\u7b49<em id=\"recommendNum\">"+
		invitedData.length+
		"</em>\u4eba";
		inserHTML(searchInvited, tempHTML, "afterbegin");

		recmmendWrap = document.getElementById("recmmendWrap");
		recommendNum = document.getElementById("recommendNum");
		searchInput = document.getElementById("searchInput");
		actions.invitedNum = invitedData.length;
	}
	function bindEvent() {
		Evt.on(recmmendWrap, "click", actions.inviteAction);
		Evt.on(searchInput, "focus", actions.searchFocus);
		Evt.on(searchInput, "blur", actions.searchBlur);
	}
	
	function swipe(data, tpl, extra) {
		var dataArr = [];
		for(var k = 0, len = data.length; k < len; k++) {
			var dataStr = tpl;
			var curr = data[k];
			for(var key in curr) {
				dataStr = dataStr.replace(new RegExp("\\$\\{"+key+"\\}", "g"), curr[key]);
			}
			for(var key in extra) {
				dataStr = dataStr.replace(new RegExp("\\$\\{"+key+"\\}", "g"), extra[key]);
			}
			dataArr.push(dataStr);
		}
		return dataArr
	}
	function inserHTML(node, html, where){
		node = node && node.nodeType == 1 ? node : document.body;
		where = where? where.toLowerCase(): "beforeend";
		if (node.insertAdjacentHTML) {
			node.insertAdjacentHTML(where, html)
		}else {
			var range = node.ownerDocument.createRange();
			var frag;
			switch (where) {
				case "beforebegin":
					range.setStartBefore(node);
					frag = range.createContextualFragment(html);
					node.parentNode.insertBefore(frag, node);
					return node.previousSibling;
				case "afterbegin":
					if (node.firstChild) {
						range.setStartBefore(node.firstChild);
						frag = range.createContextualFragment(html);
						node.insertBefore(frag, node.firstChild);
						return node.firstChild;
					}else {
						node.innerHTML = html;
						return node.firstChild;
					}
					break;
				case "beforeend":
					if (node.lastChild) {
						range.setStartAfter(node.lastChild);
						frag = range.createContextualFragment(html);
						node.appendChild(frag);
						return node.lastChild;
					}else {
						node.innerHTML = html;
						return node.lastChild;
					}
					break;
				case "afterend":
					range.setStartAfter(node);
					frag = range.createContextualFragment(html);
					node.parentNode.insertBefore(frag, node.nextSibling);
					return node.nextSibling;
			}
			throw 'Illegal insertion point -> "' + where + '"';
		}
	};
	function trim(str) {
		if(!is(str, "string")) {
			return ""
		}
		return str.replace(/^\s+|\s+$/, "")
	}
	function is(who, what) {
		if(!who) {
			return false;
		}
		if(what=="node") {
			return who.nodeType == 1
		}
		return ObjToString.call(who).slice(8, -1).toLowerCase() == what.toLowerCase()
	}
})(window)