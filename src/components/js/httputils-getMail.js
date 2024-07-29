import axios from 'axios';

let qs = require('qs')

axios.defaults.timeout = -1;
axios.defaults.baseURL = '';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

function adaAJAX(method, url, params){
  return new Promise((resolve, reject) => {
    let data = null;
    if('get'===method){
      data = {
        params: params
      }
    }else{
      data = qs.stringify(params)
    }
    axios[method](url, data)
    .then( r => {
      let d = r.data
      if(d.status === 0){
        let d1 = d.data
        if(d.pager){
          d1 = d1 || []
          d1.pager = d.pager //这里采用了非正常手段 为数组添加自定义属性
        }
        resolve(d1)
      }else{
        reject(d.msg)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

export function emialGET(url, params = {}) {
  return adaAJAX('get', url, params)
}

export function emialPUT(url, data = {}) {
  return adaAJAX('put', url, data)
}

export function emialPOST(url, data = {}) {
  return adaAJAX('post', url, data)
}

export function emialDELETE(url, data = {}) {
  return adaAJAX('delete', url, data)
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {

  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {

  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data))
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, qs.stringify(data))
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}


export function del(url){
  return new Promise((resolve, reject) => {
    axios.delete(url).then( r => {
      resolve()
    }, e => {
      reject(e)
    })
  })
}
