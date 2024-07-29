import dateUtil from './date-util'

function loop(s){
	return s;
}

const UDTF = {
	'GMT:': function(s){
		return dateUtil.formatDate('yyyy-MM-dd', parseInt(s))
	},
	'DATE:': loop,
	'EMAIL:': loop,
	'URL:': loop
}

export default {
  install(Vue, options) {
    Vue.prototype.$formatDate = dateUtil.formatDate

    Vue.prototype.$dateCalculator = function (key, cond) {
      return dateUtil.dateCalculator[key](cond);
    }

    Vue.prototype.fmtStr = function(str){
    	for(let key in UDTF){
    		if(str.startsWith(key)){
    			let s = str.substring(key.length);
    			return UDTF[key](s)
    		}
    	}

    	return str
    }
  }
}
