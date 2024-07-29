import axios from 'axios';

import constant from '@/constant'

function intercept(){
  //http request 拦截器
  axios.interceptors.request.use(
    config => {

      let uid;
      if(constant.user){
        uid = constant.user.id || null
      }

      if(uid){
        let url = config.url
        if(~url.indexOf('?')){
          url = url + '&uid='+uid
        } else{
          url = url + '?uid='+uid
        }

        config.url = url
      }

      // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
      // qs.stringify() 参考：https://segmentfault.com/q/1010000007607111/a-1020000007607232
  /*    var qs = require('qs');

      config.data = qs.stringify(config.data);
      config.headers = {
        'Content-Type':'application/x-www-form-urlencoded'
      }*/

      //添加当前用户uid参数
      //方式一：在url后面拼接,config 有固定属性config.url
      // config.url += "?uid=22"; //要去原来的url中不是以?key=value结尾，否则不用？拼接，应该用&uid=22

      //二：在参数后面拼接
      /*
      eg：
        config.params.uid = '22';  //config.param 拦截拿到发送请求的参数。

      备注，测试发现config 对象不一定有param属性（不一定叫param）
       这里的param来自发送ajax时的参数名，
       如果ajax传递的参数名是this.$fetch(url, AAAAAA).then((r) => {}
       那么就应该用config.AAAAA 属性标识发送的参数，config.AAAAA.uid=22
       这要求要加uid的ajax 请求的参数名是一样的。
       这是一个弊端。
       */
      //config.params.uid = '22';

      // if(token){
      //   config.params = {'token':token}
      // }
      return config;
    },
    error => {
      return Promise.reject(err);
    }
  );


  //http response 拦截器
  // axios.interceptors.response.use(
  //   response => {
  //     if (response.data.status == 1) {//未登录
  //       router.push({
  //         path: "/login",
  //         query: {redirect: router.currentRoute.fullPath}//从哪个页面跳转
  //       })
  //     }
  //     return response;
  //   },
  //   error => {
  //     return Promise.reject(error)
  //   }
  // )

}

export default intercept;
