/*
 * @desc 对于颜色动画，若使用（不管是颜色开始值还是颜色结束值）了rgba，则返回值也使用rgba；
 *	其他情况都统一转换为rgb形式，因为chrome会默认把颜色值都转换成rgb格式，为统一使然
 * @log 截止2014.01.02：支持盒尺寸（包括border-radius，暂不支持box-shadow等复杂的样式变换）相关值/位置/颜色/透明度
 * 	不支持red这种英文单词的颜色匹配！
 */
(function(context, undefined) {
	context = context || {};
	var is = context.is,
		clear = context.clear,
		parseParam = context.parseParam,
		forEach = context.forEach,
		styles = context.styles, // get computed styles
		cssText = context.cssText,
		cssUnits = context.cssUnits;
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
			console.log(JSON.stringify(startStyles))
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
					var computed = 0;
					if(is(startX, "array")) {
						computed = ColorCompute(startX, endX, algorithm, endT, now);
						return computed
					}else {
						computed = Arithmetic.apply(algorithm, [startX, 0, endX, endT, now]);
						return computed!==0&&isNaN(computed)?value:computed
					}
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
			var reg = /^(rgb.?\()(\d+),(\d+),(\d+)(?:,(\.?\d+))?(\))/i;
			if(value.indexOf("rgb")!==-1) {
				value = clear(value);
				var temp = value.slice(4, -1).split(",");
				var temp = value.match(reg).slice(1);
				if(temp.length==6){
					// if it is a RGB, the fifth element is undefined, just remove it
					temp.splice(4,1)
				}
				var ret = forEach(temp, function(k,v){
					var r = parseFloat(v, 10);
					return isNaN(r) ? v : r;
				})
				return ret
			}else{
				// change the '#f00' or '#ff0000' format to the 'rgb' format
				var temp = value.slice(1).split("");
				var ret = ["rgb("];
				if(temp.length===3){
					var res = forEach(temp, function(k,v){
						return parseInt(v+v, 16)
					});
					Array.prototype.push.apply(ret, res);
					ret.push(")");
					return ret
				}else{
					for(var k=0, len=temp.length; k<len;k++){
						ret.push(parseInt(temp[k]+temp[++k], 16))
					}
					ret.push(")");
					return ret
				}
			}
		}else{
			return value
		}
	}
	function ColorCompute(start, end, algorithm, endT, now) {
		if(start[0]=="rgba(") {
			if(end[0]=="rgb(") {
				end[0]="rgba(";
				end.splice(4,0,"1")
			}
		}else{
			if(end[0]=="rgba") {
				start[0]="rgba(";
				start.splice(4,0,"1")
			}
		}
		var newV = forEach(start.slice(1, -1), function(key, value) {
			return Math.floor(Arithmetic.apply(algorithm, [value, 0, end[key+1], endT, now]))
		}, []);
		return start[0]+newV.join(",")+start[start.length-1]
	}
})(Saber)