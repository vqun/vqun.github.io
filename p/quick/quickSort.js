var test = [10, 5, 6, 41, 98, 25, 3, 65, 32,78, 12, 32, 54, 65];
alert("快速排序：\n"+quickSort(test).join(" < "))

function quickSort(arr, low, high) {
	if(low == undefined) low = 0;
	if(high == undefined) high = arr.length-1;
	if(low>=high){
		return true
	}
	var p = partition(arr, low, high);
	arguments.callee(arr, low, p-1);
	arguments.callee(arr, p+1, high);
	return arr
}
function partition(arr, low, high) {
	var base = arr[low];
	var i = low+1,
		j = high,
		time = high - low;
	var less = null, great = null;
	while(time) {
		arr[j] < base ? (less = j) : --j;
		arr[i] > base ? (great = i) : ++i;
		if(less && great !== null) {
			exchange(arr, less, great);
			less = great = null;
			--j;
			++i
		}
		if(j<=i) {
			if(arr[i]>base) {
				i--
			}
			break
		}
		--time;
	}
	exchange(arr, low, i)
	return i
}
function exchange(arr, i, j) {
	var tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp
}