let utils = {}

utils.selfloop = function(key){ return key; };

utils.foreach = function(arr, eachFn){
    for(var i=0; i<arr.length; ++i){
		eachFn(arr[i],i );
    }
};

utils.filter = function(arr, filterFn){
	var ret = [];
	if(arr && arr.length){
		for(var i=0; i<arr.length; ++i){
			if(true == filterFn(arr[i])) {
				ret.push(arr[i]);
			}
		}
	}
	return ret;
};

utils.group = function(arr, groupFn){
    var groups = {};
    for(var i=0; i<arr.length; ++i){
		var item = arr[i];
		var key = item.key;
		if(groupFn) key = groupFn(item);
		var g = groups[key] || [];
		g.push(item);
		groups[key] = g;
    }
    return groups;
};


utils.toMap = function(arr, keyFunc){
	var map = {};
	for(var i=0; i<arr.length; ++i){
		if(keyFunc){
			map[keyFunc(arr[i])] = arr[i];
		}else{
			map[arr[i].key] = arr[i];
		}
	}
	return map;
}

utils.toArray = function(obj, opFn){
    var arr = [];
    for(var key in obj){
    	var res = opFn(key, obj[key]);
    	if(res) arr.push(res);
    }
    return arr;
}

//map   key -> [value]  one to many
utils.map = function(arr, mapperFn){
	var ret = [];
	for(var i=0; i<arr.length; ++i){
		var res = mapperFn(arr[i], i);
		if(res && res.length>0) ret = ret.concat(res);
	}
	return ret;
}

utils.mergeObject = function(obj1, obj2){
    //check if obj1 & obj2 are objects
    var ret = obj1 || {};
    if(obj2) for(var key in obj2) ret[key] = obj2[key];
    return ret;
}

utils.unique = function(arr, keyFunc){
	var map = {};
	var arr2 = [];
	var func = keyFunc || utils.selfloop;
	for(var i=0; i<arr.length; ++i){
		var key = func(arr[i]);
		if(map[key]) continue;
		map[key] = 1;
		arr2.push(arr[i]);
	}
	return arr2;
}


utils.flatArray = function(arr, tfunc){
	var ret = [];
	for(var i=0; i<arr.length; ++i){
	    ret = ret.concat(tfunc(arr[i]));
	}
	return ret;
}

//判断是否为空对象
utils.isEmptyObject=function(e){
	  var t;  
	    for (t in e)  {
	        return !1; 
	    }
	    return !0  ;
}

utils.shortText = function(t, len){
	if(t.length>len) return t.substr(0, len)+'...';
	return t;
}


utils.padLeft = function(s, n){
  s = ''+s;
  while(s.length<n) s='0'+s;
  return s;
}

utils.formatFileSize = function(size){
	var arr = ['', 'K', 'M', 'G', 'T'];
	for(var i=0; i<arr.length; ++i){
		var n = parseInt(size/1024);
		if(n==0) return size+arr[i]+'B';
		size = n;
	}
	return '大于1T';
}

export default utils
