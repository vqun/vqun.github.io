// ===== visualized example
var nums = [29, 100, 12, 4, 10, 43, 66, 53, 61, 35, 44, 79, 64, 39, 46, 36, 47, 18, 49, 5, 7, 30, 27, 28, 19, 6, 11, 9, 13, 68, 16, 37, 15, 17, 23, 21, 22, 31, 83, 2, 33, 48, 81, 41, 42, 95, 62, 40, 99, 14, 26, 51, 1, 38, 24, 25, 50, 52, 20, 54, 32, 80, 63, 3, 65, 55, 87, 56, 60, 67, 69, 70, 98, 34, 71, 94, 84, 72, 73, 93, 86, 74, 58, 97, 92, 76, 59, 45, 75, 77, 78, 96, 82, 8, 85, 57, 88, 90, 91, 89]
var sortContainer = document.getElementById('sortList');
var sortItems = document.getElementsByTagName('li', sortContainer);
var Sort = function() {};
Sort.prototype = {
	sort: function(a) {},
	less: function(a, b) {
		if((typeof a === 'number' && typeof b === 'number') || (typeof a === 'string' && typeof b === 'string')) {
			return a < b;
		}
		if(!a.C || typeof a.C !== 'function') {
			return false;
		}
		if(!b.C || typeof b.C !== 'function') {
			return false;
		}
		return a.C() < b.C();
	},
	exchange: function(a, i, j) {
		var t = a[i];
		a[i] = a[j];
		a[j] = t;
		return true;
	},
	show: function(a) {
		console.log(a.join(', '));
	},
	isSorted: function(a) {
		for(var k = a.length; k; ) {
			if(this.less(a[--k], a[k-1])) {
				return false;
			}
		}
		return true;
	}
};
/* 为了配合可视化演示，重写exchange */
var swapElement = function(p, n, o) {
	var nt = n.cloneNode(true),
		ot = o.cloneNode(true);
	p.replaceChild(nt, o);
	p.replaceChild(ot, n);
	// sortItems = document.getElementsByTagName('li', sortContainer);
	return true;
};
var oldExch = Sort.prototype.exchange;
var baseT = 0;
Sort.prototype.exchange = function(a, i, j) {
	if(i === j) {
		return true;
	}
	oldExch(a, i, j);
	setTimeout(function() {
		swapElement(sortContainer, sortItems[i], sortItems[j]);
	}, baseT);
	baseT += 100;
	return true;
};
// <1. Selection Sort>
var SelectionSort = new Sort();
SelectionSort.sort = function(a) {
	var less = this.less, exchange = this.exchange;
	var N = a.length, min;
	for(var k = 0; k < N; ++k) {
		min = k;
		for(var j = k + 1; j < N; ++j) {
			if(less(a[j], a[min])) {
				min = j;
			}
		}
		exchange(a, k, min);
	}
	return true;
};
// visualized example
// SelectionSort.sort(nums);
// </1. Selection Sort>

// <2. Insertion Sort>
var InsertionSort = new Sort();
InsertionSort.sort = function(a) {
	var less = this.less, exchange = this.exchange;
	var N = a.length, min;
	for(var k = 1; k < N; ++k) {
		for(var j = k; j && less(a[j], a[j-1]); --j) {
			exchange(a, j, j-1);
		}
	}
	return true;
};
// visualized example
// InsertionSort.sort(nums);
// </2. Insertion Sort>

// <3. Shell Sort>
var ShellSort = new Sort();
ShellSort.sort = function(a) {
	var less = this.less, exchange = this.exchange;
	var N = a.length;
	var h = 1;
	while(h < N/3) h = 3*h + 1;
	while(h>=1) {
		for(var i = h; i < N; i++) {
			for(var j = i; j>=h&&less(a[j], a[j-h]); j-=h) {
				exchange(a, j, j-h);
			}
		}
		h = Math.floor(h/3);
	}
	return true;
};
// visualized example
// ShellSort.sort(nums);
// </3. Shell Sort>


// <4. Heap Sort>
var HeapSort = new Sort();
// </4. Heap Sort>