<template>
  <div class="main-page">
    <el-row >
      <my-header/>
    </el-row>

    <el-row>
      <el-col :span="4" >
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          >
          <el-menu-item index="home">
            <i class="el-icon-document"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="system-monitor">
            <i class="el-icon-view"></i>
            <span slot="title">集群监控</span>
          </el-menu-item>
          <el-menu-item index="query">
            <i class="el-icon-search"></i>
            <span slot="title">通用数据库查询</span>
          </el-menu-item>
          <el-submenu index="dbop">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>数据库操作</span>
            </template>
            <el-menu-item index="dbop/kafka-consumer">GBase 8a同步端</el-menu-item>
            <el-menu-item index="dbop/hand-sync">手工同步</el-menu-item>
          </el-submenu>
          <el-submenu index="setting">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="setting/pool-list">数据库连接管理</el-menu-item>
            <el-menu-item index="setting/sync-task">同步任务管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>

      <el-col :span="20" class="main-body">
        <transition>
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>

    <footer v-html="copyright"></footer>
  </div>
</template>
<script>
  import MyHeader from './head'

  import constant from '@/constant'
  import user from '@/user/user'

  export default {
    components: {
      MyHeader
    },
    data(){
      return {
        index: "home",
        copyright: constant.site.copyright
      }
    },
    created(){
    },
    methods:{
      handleOpen(){},
      handleClose(){},
      handleSelect(key, keyPath) {
        location.href = '#/'+key;
      }
    }
  }
</script>
<style>
  .main-page {
    background: white;
  }

  .main-left{
    height: 100%;
    margin-bottom: 0;
    min-height: 600px;
    border-right: 1px solid #f0f3f9;
    padding:2px 1px;
  }

  .my-tabbar{
    border-bottom: 1px solid #f0f3f9;
    font-size: 12px;
  }

  .main-body{
    min-height: 600px;
    padding-right: 0;
    background: #f9f9fa;
  }

  .main-body .module{
    padding: 15px;
  }

  .search-bar-zone {
    height: 54px;
  }

  .dialog-form{
    max-height: 600px;
  }

  .dialog-form .el-form-item{
    margin:2px 0;
  }

  .el-pagination{
    white-space: normal;
  }

  .vl-notify .vl-notify-content{
    max-height: 600px;
  }

  .vl-notify-content .dialog-form{
    margin: 0 15px;
  }

  .el-radio-group .el-radio{
    display: block;
  }

  .el-radio+.el-radio{
    margin-left: 0;
  }

  .el-input__inner{
    padding-left: 9px;
  }
  .el-textarea__inner{
    padding-left: 9px;
  }


</style>
