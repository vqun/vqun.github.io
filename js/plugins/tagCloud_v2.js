Saber.define("plugins.tagCloud", function($) {
	var TPL = "<li class=\"tc-tagItem\"><a href=\"${{url}}\">${{tag}}</a></li>";
	var defaultOpts = {
		"data": [],
		"radius": 200
	}
	return function(opts){
		var container = null;
		var controlor = {}
		var init = function() {
			container = document.createElement("div");
			container.className = "tagCloud";
			// 计算云标签的占据空间
			// var css = ";width:xxx;height:xxx;"
			// container.style.cssText = css;
			document.body.appendChild(container);
			opts = $.parseParam(defaultOpts, opts)
		}
		var info = {
			status: "shrinked"
		};
		var actions = {}
		var live = function() {}
		var relieve = function() {}
		var start = function() {
			init();
			live();
		}
		var spread = function() {
			if(info.status == "spreaded") {return true}
			info.status = "spreaded";
			var template = function(data, tpl) {
				var ret = tpl;
				for(var k in data) {
					ret = ret.replace(new RegExp("\\$\\{\\{"+k+"\\}\\}", "g"), data[k])
				}
				return ret
			}
			var tagAniOpts = [];
			var Floor = Math.floor, Sin = Math.sin, Cos = Math.cos, Pi = Math.PI;
			var max = opts.data.length;
			var tags = $.forEach(opts.data, function(i, d) {
				var phi = Math.acos(-1+(2*i-1)/max),theta = Math.sqrt(max*Pi)*phi;
				var distance = opts.radius;
				tagAniOpts.push({
					"top": opts.radius+Floor(distance*Cos(theta)*Sin(phi)),
					"left": opts.radius+Floor(distance*Sin(theta)*Sin(phi)),
					"opacity": Math.abs(Cos(phi)),
					"fontSize": Random(10, Math.max(opts.radius/13, 13))
				});
				return template(d, TPL)
			});
			container.innerHTML = "<ul class=\"tc-tagsOuter\">"+tags.join("")+"</ul>";
			var tagEls = $.T("li", container);
			var maxTime = 150*tagEls.length;
			info.anis = $.forEach(tagEls, function(k, tag) {
				var aniOpts = tagAniOpts[k];
				var tempAni = $.ani.animate(tag, {
					"duration": Random(1000, 300)
				});
				tempAni.play(aniOpts);
				return tempAni
			},[])
		}
		var shrink = function() {}
		var destroy = function() {
			relieve();
		}
		controlor.spread = spread;
		controlor.shrink = shrink;
		controlor.destroy = destroy;
		start();
		return controlor;

		function Random(from, to) {
			return Math.random()*(to-from)+from
		}
	}
})
