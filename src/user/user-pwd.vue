<template>
  <div class="module" style="width: 600px;">
    <h3>修改密码</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" width="400px">
      <el-form-item label="原密码">
        <el-input ref="pwd0" type="password" v-model="form.pwd0" placeholder="请输入原密码" autofocus></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input ref="pwd" type="password" v-model="form.pwd" placeholder="请输入新密码，密码不少于6位"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input ref="pwd1" type="password" v-model="form.pwd1" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-lg btn-block" type="primary"
                   v-bind:loading="inLoading"
                   @click="submit">确认修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

  export default {
    data() {
      return {
        form: {},
        inLoading: false,
        rules: {
          pwd0: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {min: 1, max: 10000, message: '请输入密码', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {min: 1, max: 10000, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate(v => {
          if (v) {
            if(!this.form.pwd0){
              this.$message.error("原密码为空");
              this.$refs['pwd0'].focus();
              return false;
            }
            if(!this.form.pwd){
              this.$message.error("新密码为空");
              this.$refs['pwd'].focus();
              return false;
            }
            if(!this.form.pwd1){
              this.$message.error("请再次输入新密码");
              this.$refs['pwd1'].focus();
              return false;
            }
            //判断两次密码是否一致
            if (this.form.pwd != this.form.pwd1) {
              this.$message.error("前后两次输入密码不一致，请重新输入")
              this.$refs['pwd1'].focus();
              return false;
            }
            this.ajaxPOST(this.api('/web/passwd'), {
              oldpwd: this.form.pwd0, newpwd: this.form.pwd})
              .then(r => {
                this.$message('修改成功')
                this.form = {}
              }).catch(e => {
              console.log(e)
                if("新旧密码不匹配"==e){
                  this.$message.error('原密码输入错误，请重新输入');
                }else {
                  this.$message.error('修改失败，请稍后重试');
                }
              })
          } else {
            this.$message.error('输入无效');
            return false;
          }
        })
      }
    }
  }

</script>
