var test = [10, 5, 6, 41, 98, 25, 3, 65, 32,78, 12, 32, 54, 65];
alert("最大堆排序：\n"+maxHeapSort(test).join(" > "))

function maxHeapSort(arr) {
	var temp = arr.slice(0);
	for(var k = 0,len=arr.length;k<len;k++) {
		temp = buildMaxHeap(temp);
		arr[k]=temp.shift()
	}
	return arr
}
function buildMaxHeap(arr) {
	var h = Math.ceil(log(2, arr.length));
	for(var k = Math.pow(2, h-1)-2;k>=0;k--) {
		maxHeap(arr, k)
	}
	return arr
}
function maxHeap(arr, i) {
	var l = 2*i+1, r = 2*(i+1);
	var root = arr[i],
		left = l<arr.length && arr[l] || null,
		right = r<arr.length && arr[r] || null;
	var max = root, maxI = i;
	if(left != null && left > root) {
		max = left;
		maxI = l;
	}
	if(right != null && right > max) {
		max = left;
		maxI = r;
	}
	if(maxI !== i) {
		exchange(arr, i, maxI);
		arguments.callee(arr, maxI);
	}
}
function exchange(arr, i, j) {
	var tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp
}
function log(base, value) {
	if(base < 1 || value < 0) {
		return -Infinity
	}
	var minus = 1
	if(base == 2) {
		minus = Math.LN2
	}else if(base == 10) {
		minus = Math.LN10
	}else {
		minus = Math.log(base)
	}
	return Math.log(value)/minus
}