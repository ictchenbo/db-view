const DAY_IN_SECONDS = 24 * 3600;
const DAY_IN_MILLIS  = DAY_IN_SECONDS * 1000
const GMT_OFFSET = 0;

function now(){
  var dt = new Date();
  return [+dt, dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getDay()];
}

function mkTs(y, m, d) {
  return new Date(y, m, d) - GMT_OFFSET;
}

export default {
  now,
  mkTs,
  dateCalculator: {
    '1': function () {//today
      let t = now();
      let t1 = mkTs(t[1], t[2], t[3]);
      return {
        gt: t1,
        lt: t1 + DAY_IN_MILLIS
      }
    },
    '2': function () {//yestoday
      let t = now();
      let t1 = mkTs(t[1], t[2], t[3]);
      return {
        gt: t1 - DAY_IN_MILLIS,
        lt: t1
      }
    },
    '3': function () {//this week
      var t = now();
      var ts = parseInt(t[0] / DAY_IN_MILLIS) * DAY_IN_MILLIS - GMT_OFFSET;
      var wd = t[4];
      if (wd == 0) wd = 7;
      return {
        gt: ts - DAY_IN_MILLIS * (wd - 1),
        lt: ts + DAY_IN_MILLIS
      }
    },
    '4': function () {//last week
      var t = now();
      var ts = t[0] - GMT_OFFSET;
      var wd = t[4];
      if (wd == 0) wd = 7;
      let t1 = ts - DAY_IN_MILLIS * (wd - 1);
      return {
        gt: t1 - DAY_IN_MILLIS * 7,
        lt: t1
      }
    },
    '5': function () {//this month
      var t = now();
      let year = t[1], month = t[2]
      if(month==11){
        ++year;
        month = 0
      } else {
        ++month
      }
      return {
        gt: mkTs(t[1], t[2], 1),
        lt: mkTs(year, month, 1)
      }
    },
    '6': function () {//last month
      var t = now();
      if (t[2] > 0) t[2]--;
      else {
        t[2] = 11;
        t[1]--;
      }
      return {
        gt: mkTs(t[1], t[2], 1), //first day last month
        lt: mkTs(t[1], t[2], 1)//first day this month
      }
    },
    '7': function () {//this year
      var t = now();
      return {
        gt: mkTs(t[1], 0, 1), //first day this year
        lt: mkTs(t[1] + 1, 0, 1) //first day next year
      }
    },

    '0': function () {//no limit
      return null
    }
  },

  formatDate(fmt, milliSeconds){
    var date = new Date(milliSeconds);
    return this.formatDate(fmt, date)
  },

  formatDate(fmt, date){
      var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
  }
}
