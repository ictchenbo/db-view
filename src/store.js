import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex);

function putLocal(state){
  localStorage.setItem("state", JSON.stringify(state))
}

function load(state, navItem){
  let cond = navItem.cond
  let prefix = '#'+navItem.route
  state.dataItems = navItem.data.items
  state.dataType  = navItem.data.type || 'email'
  if(cond._id){
    state.selectedId = cond._id
    location.href = prefix+'/'+cond._id
  }

  location.href = prefix
}

//store相关配置,数据注册中心--start
const store = new Vuex.Store({
  state: {
    dataType: 'email', //类型
    dataItems: [],  //列表
    queryCond: null, //查询条件
    pager: {},
    selectedId: null, //选择项ID
    dataItem:{}, //选中的某项数据
    current: '/login',
    breadcrumbsName: new Set,
    breadcrumbs:[]
  },
  mutations: {
    setAll(state, all){
      let x = localStorage.getItem("state")
      if(x){
        Object.assign(state, JSON.parse(x));
      }
    },
    setData(state, data) {
      debugger
      let type = data.type, cond = data.cond || {}

      state.dataType = type
      state.dataItems = data.items
      state.pager = data.pager
      state.queryCond = cond
      state.dataItem = data.item

      putLocal(state)
    },
    setData2(state, data) {
      let type = data.type, cond = data.cond || {}

      state.dataType = type
      state.dataItems = data.items
      state.pager = data.pager
      state.queryCond = cond
      state.dataItem = data.item

      let q = cond.query && cond.query.q;
      let name = cond._title || q
      let breadcrumb={
        name,
        data,
        cond,
        route:'/main/'+type
      }
      state.breadcrumbs.push(breadcrumb)

      putLocal(state)
    },
    setDataItems(state, items) {
      state.dataItems = items;
      putLocal(state)
    },
    setDataType(state, type) {
      state.dataType = type
      putLocal(state)
    },
    setQueryCond(state, cond) {
      state.queryCond = cond
      putLocal(state)
    },
    setSelectedId(state, id) {
      state.selectedId = id
      putLocal(state)
    },
    setDataItem(state,item){
      state.dataItem = item
      putLocal(state)
    },
    putBreadcrumbs(state, breadcrumb){
      if(!state.breadcrumbsName.has(breadcrumb.name)){
        state.breadcrumbsName.add(breadcrumb.name)
        state.breadcrumbs.push(breadcrumb)
      }
      putLocal(state)
    },

    removeNav(state, item){
      let rs = state.breadcrumbs.filter(a => {
        return a != item
      })
      state.breadcrumbs = rs
      putLocal(state);
      if(rs.length>0){
        load(state, rs[rs.length-1])
      } else{
        location.href = '#/main/home'
        window.open("/", "_self");
      }
    },
    removeAllNav(state){
      state.breadcrumbs = []
      putLocal(state);
      location.href = '#/main/home'
      window.open("/", "_self");
    },
    removeLastNav(state){

    },
    loadNav(state, item){
      console.log(state,item)
      load(state, item)
    }
  }
})

export default store;
