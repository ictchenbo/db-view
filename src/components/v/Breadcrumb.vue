<template>
  <div class="my-breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/main/home" id="first_top">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item v-for="(breadcrumb,index) in breadcrumbs" :to=breadcrumb.route :key="index">
        <span @click="showBreadCrumb(breadcrumb)">{{breadcrumb.name}}</span>
        <span class="right">
          <el-tooltip id="tip" class="icon" effect="dark" content="关闭">
            <i class="el-icon-third-delete"  @click="doClose(breadcrumb, index)"></i>
          </el-tooltip>
        </span>
      </el-breadcrumb-item>
      <span id="right">
        <el-tooltip class="icon" effect="dark" content="清空">
          <i class="el-icon-close"  @click="doCloseAll"></i>
        </el-tooltip>
      </span>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default ({
    computed:{
      breadcrumbs() {
        return this.$store.state.breadcrumbs || []
      },
    },
    methods:{
      doClose(breadcrumb, index){
        this.$store.commit('removeNav', breadcrumb)
      },
      doCloseAll(){
        this.$store.commit('removeAllNav')
      },
      showBreadCrumb(breadcrumb){
        this.$store.commit('loadNav', breadcrumb)
      }
    }
  })

</script>
<style scoped>
  .my-breadcrumb {
    padding: 8px 15px;
  }

  .my-breadcrumb a{
    cursor: pointer !important;
  }

  i.el-icon-close{
    cursor: pointer;
    size: 12px;
  }
</style>
