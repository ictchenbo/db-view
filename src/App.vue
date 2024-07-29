<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css'

  export default {
    name: 'app'
  }

</script>

<style>
 *{
    margin: 0;
    padding: 0;
    border: 0;
    font-family: "微软雅黑";
    font-size: 16px;
    line-height: 1.5em;
    vertical-align: baseline;
  }

  html {
      min-height: 100%;
      margin-bottom: 0;
  }

  body{
    min-height: 100%;
    margin-top: 0;
    margin-bottom: 0;
    background: #edeff1;
  }

::-webkit-scrollbar{
    width: 8px;
    height: 8px;
    background: #f5f5f5;
}

::-webkit-scrollbar-track{
    /*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);*/
    border-radius: 10px;
    background-color: #e2e6e6;
}

::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background-color: rgba(0,0,0,0.2);
}

  footer {
    padding: 30px 0;
    text-align: center;
    color: #999;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#f9f9f9), to(#f0f0f0));
  }

a, a:visited{
  color: #409EFF !important;
}

h1{
  font-size: 3rem;
}

h2{
  font-size: 2.5rem;
}

h3{
  font-size: 2rem;
}

h1,h2,h3{
  margin: 12px 0 8px;
}


.el-form-item.required label{
    color: red;
    font-weight: bold;
}

</style>
