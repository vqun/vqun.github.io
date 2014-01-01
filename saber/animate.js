(function(context, undefined) {
	context = context || {};
	var is = context.is,
		clear = context.clear,
		parseParam = context.parseParam,
		forEach = context.forEach,
		styles = context.styles, // get computed styles
		cssText = context.cssText,
		cssUnits = context.cssUnits;
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
			"status": "non-start"
		}
		controlor.play = function(to) {
			if(!player || player.status == "playing") {
				return false;
			}
			player.status = "playing";
			player.target = to;
			var startT = new Date().getTime();
			var startCssText = cssText(who);
			var startStyles = cssUnits(styles(who, to)).remove();
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
					var startX = ColorAnalysis(key, startStyles[key]),
						endX = ColorAnalysis(key, value);
					if(is(startX, "array")) {
						return "#"+forEach(startX, function(k, v) {
							var newX = Math.floor(Arithmetic.apply(algorithm, [v, 0, endX[k], endT, now])).toString(16);
							return newX.replace(/(\b\w\b)/, function(m0, m1){
								return "0"+m1
							})
						}).join("")
					}
					return Arithmetic.apply(algorithm, [startX, 0, endX, endT, now])
				});
				who.style.cssText = startCssText.push(nowStyles).toString();
				player.playID = setTimeout(arguments.callee, by.frameTime)
			}, by.frameTime)
		}
		controlor.finish = function(to) {
			if(!player || player.status == "playing") {
				return false;
			}
			var oldEnd = by.end;
			by.end = function(who) {
				by.end(who);
				this.stop();
			}
			this.play(to)
		}
		controlor.pause = function() {
			player && (player.status = "pause") && clearTimeout(player.playID)
			return this;
		}
		controlor.resume = function() {
			player && (player.status == "pause") && player.target && this.play(player.target)
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
				return .5*(eX+sX + (eX-sX)*Math.sin(Math.PI*(t/eT-.5)))
			},
			"damper": function(sX, sT, eX, eT, t) {
				return sX + eT/t * Math.sin(t/eT * Math.asin(t*(eX-sX)/eT))
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
	function ColorAnalysis(key, value) {
		if(key.indexOf("color") !== -1||key.indexOf("Color")!==-1) {
			if(value.indexOf("rgb")!==-1) {
				value = clear(value);
				var temp = value.slice(4, -1).split(",");
				var ret = forEach(temp, function(k,v){return parseInt(v, 10)});
				return ret
			}else{
				var temp = value.slice(1).split("");
				if(temp.length===3){
					return forEach(temp, function(k,v){
						return parseInt(v+v, 16)
					})
				}else{
					var ret = [];
					for(var k=0, len=temp.length; k<len;k++){
						ret.push(parseInt(temp[k]+temp[++k], 16))
					}
					return ret
				}
			}
		}else{
			return value
		}
	}
})(Saber)