(function(context, undefined) {
	context = context || {};
	var is = context.is,
		parseParam = context.parseParam,
		forEach = context.forEach,
		styles = context.styles, // get computed styles
		cssText = context.cssText,
		// parse the css json to a cssText string and add the units to the styles
		// cssParser = context.cssParser;
	var ani = context.ani = {};
	ani.animate = Animate; // 动画库
	ani.algorithm = Algorithm() // 动画算法库
	function Animate(who, as, by) {
		if(!is(who, "Node")) {
			throw "Need a Node as the first argument"
		}
		as = is(as, "string") && as || "linear";
		by = parseParam({
			"duration": 500,
			"frameTime": 25,
			"start": context.emptyFunc,
			"end": context.emptyFunc
		}, by);

		var algorithm = this.algorithm.use(as);
		var controlor = {};

		var player = {
			"playID": 0,
			"target": null,
			"status": ""
		}
		controlor.play = function(to) {
			if(!player) {
				return false;
			}
			player.target = to;
			var startT = new Date().getTime();
			var startCssText = cssText(who);
			var startStyles = styles(who, to);
			var endStyles = to;
			var endT = by.duration;
			by.start(who);
			player.playID = setTimeout(function() {
				now = new Date().getTime() - startT;
				if(now>=endT) {
					who.style.cssText = startCssText.push(endStyles).toString();
					controlor.stop();
					by.end(who);
					return true;
				}
				var nowStyles = forEach(to, function(key, value) {
					var startX = startStyles[key],
						endX = value;
					return Arithmetic.apply(algorithm, [startX, 0, endX, endT, now])
				});
				who.style.cssText = startCssText.push(nowStyles).toString();
				player.playID = setTimeout(arguments.callee, by.frameTime)
			}, by.frameTime)
		}
		controlor.finish = function(to) {
			var oldEnd = by.end;
			by.end = function(who) {
				by.end(who);
				this.stop();
			}
			this.play(to)
		}
		controlor.pause = function() {
			player && clearTimeout(player.playID)
			return this;
		}
		controlor.resume = function() {
			player && player.target && this.play(player.target)
			return this;
		}
		controlor.stop = function() {
			player && clearTimeout(player.playID)
			this.destroy();
		}
		controlor.destroy = function() {
			player = null;
			controlor = null;
		}
		return controlor;
	}
	function Arithmetic(sX, sT, eX, eT, t) {
		// 动画计算，以开始、结束和当前时间做参数，计算当前动画值
		if(!is(this, "function")) {
			throw "Need to be called as Arithmetic.apply(this, arguments), this must be a animate algorithm"
		}
		return this(sX, sT, eX, eT, t)
	}
	function Algorithm() {
		var algorithms = {
			"linear": function(sX, sT, eX, eT, t) {
				return sX + (eX-sX)*t/eT
			},
			"spring": function(sX, sT, eX, eT, t) {
				return sX + (eX-sX)*Math.sin(.5*Math.PI*t/eT)
			},
			"spring2": function(sX, sT, eX, eT, t) {
				return sX + (eX-sX)*Math.sin(2*Math.PI*t/eT)
			}
		}
		return {
			"add": Add,
			"use": Use
		}
		function Add(name, handler) {
			if(is(handler, "function")) {
				algorithms[name] = handler;
			}
			return this
		}
		function Use(name) {
			return algorithms[name] || algorithms["linear"]
		}
	}
})(Saber)