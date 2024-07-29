<template>
  <div class="login-page">
    <el-row type="flex">
      <el-col :span="12">
        <img src="@/assets/images/img.png" class="login-icon"/>
      </el-col>
      <el-col :span="12" class="login-box">
          <img src="@/assets/images/logo.png" height="50px" style="margin-bottom: 20px;"/>
          <div class="login-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  >
              <div class="form-group">
                <el-form-item prop="username">
                  <el-input v-model="ruleForm.username" id="login-name" placeholder="请输入用户名" autofocus>chenbo</el-input>
                  <label class="login-field-icon fui-user" for="login-name"></label>
                </el-form-item>
              </div>

              <div class="form-group">
                <el-form-item prop="pwd">
                  <el-input type="password" v-model="ruleForm.pwd" id="login-pwd" placeholder="请输入密码">123456</el-input>
                  <label class="login-field-icon fui-lock" for="login-pwd"></label>
                </el-form-item>
              </div>

              <el-form-item>
                <el-button class="btn btn-primary btn-lg btn-block btn-login" type="primary" v-bind:loading="inLoading" @click="submitForm('ruleForm')">{{submitButton}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>

      </el-col>
    </el-row>
    <footer v-html="copyright"></footer>
  </div>
</template>

<script>
  import "@/assets/css/bootstrap.min.css"
  import "@/assets/css/flat-ui/css/flat-ui.css"

  import constant from '@/constant'

  let userList = []
  export default  {
    data() {
      let validatePass = (rule,value,callback) =>{
        if(value === ''){
          callback(new Error('请输入用户名'))
        }else if(userList.indexOf(value)==-1){
          callback(new Error('请输入正确的用户名'))
        }else {
          callback()
        }
      }
      return {
        ruleForm: {
          username: '',
          pwd: ''
        },
        rules: {
          username: [
            {  trigger: 'blur',validator:validatePass}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {min: 1, max: 10000, message: '请输入密码', trigger: 'blur'}
          ]
        },
        inLoading: false,
        submitButton: '登 录',
        copyright: constant.site.copyright
      };
    },
    created(){
      this.list()
    },
    methods: {
      list(){
        this.ajaxGET(this.api('/common/user'), {q: this.q})
          .then( list => {
            list.forEach(item=>{
              userList.push(item.username)
            })
          })
      },
      afterLogin(user){
        let path = '/main/home'
        if(user.isAdmin){
            path = '/admin/home'
        }
        this.$store.commit('removeAllNav')
        location.href = '#'+path;
        location.reload()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login({
              username: this.ruleForm.username.trim(),
              pwd: this.ruleForm.pwd.trim()
            })
          } else {
            this.$message.error("表单填写错误，请检查")
            return false;
          }
        });
      },
      login(data) {
        var url = this.api('/web/login')
        this.inLoading = true;
        this.submitButton = "登录中,请稍等......";
        this.ajaxPOST(url, data).then( user => {
          this.inLoading = false;
          this.submitButton = "登录";
          if(user){
            localStorage.setItem("user", JSON.stringify(user))
            constant.user = user
            //this.$emit('login')
            this.afterLogin(user)
          }
        }).catch( e => {
          this.$message.warning(e)
          this.inLoading = false;
          this.submitButton = "登录";
        })
      }
    }
  }

</script>

<style scoped>
  .login-page{
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#9111de), to(#94008a));
  }

  .login-box {
    position: relative;
    background: url(../assets/images/map.png);
    padding-top: 100px;
  }

  .login-form {
    width: 80%;
    min-width: 300px;
    max-width: 600px;
  }

  .login-form *{
    font-size: 16px;
  }

  .login-icon {
    left: 0px;
    top: 0px;
    width: 100%;
    position: relative;
  }

  .loading {
    display: none;
    color: #d23343;
    padding: 24px 10px;
  }

  .btn-login {
    background-color: #3399ff;
  }

  .btn-login:hover {
    background-color: #3090f0;
  }

  .login-field:focus {
    border-color: #3399ff;
  }

  .login-field:focus + .login-field-icon {
    color: #3399ff;
  }

</style>
