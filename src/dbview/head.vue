<template>
  <div class="mypage-header">
    <el-row>
      <el-col :span="18">
        <h2 class="title">DBVIS</h2>
        <h4 class="subtitle">数据监控与可视化分析平台</h4>
      </el-col>
      <el-col :span="6" class="right">
<!--         <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down"></i>
          </span>
        </el-dropdown> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>

  import user from '@/user/user'
  import constant from '@/constant'

  export default {
  }

</script>

<style scoped>

  h2.title{
    color: white;
    font-size: 2rem;
  }
  h4.subtitle{
    padding-left: 100px;
    color: #ccc;
  }

  .mypage-header {
    padding: 15px 15px;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#3a8ee6), to(#006b94));
  }

</style>
