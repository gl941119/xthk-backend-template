<template>
  <div class='login'>
    <div class='login-inner'>
      <div class='login-inner-form-wrap'>
        <div class='login-item base'>
          <div class='top'>
            <span class='title'>账号登录</span>
          </div>
          <a-form :form='form'>
            <a-form-item>
              <a-input
                maxlength='11'
                placeholder='请输入账号'
                size='large'
                v-decorator='[
                                "username",
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入您的账号!"
                                        }
                                    ]
                                }
                            ]'
              >
                <a-icon slot='prefix' style='color: rgba(0,0,0,.25)' type='user' />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                maxlength='16'
                placeholder='请输入密码'
                type='password'
                size='large'
                :autocomplete='false'
                v-decorator='[                                
                                "password",
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: "请输入您的密码!"
                                        }
                                    ]
                                }
                            ]'
              >
                <a-icon slot='prefix' style='color: rgba(0,0,0,.25)' type='lock' />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button
                :disabled='islogin'
                @click.stop='handlerLogin'
                class='login-form-button'
                html-type='submit'
                size='large'
                type='primary'
              >登&emsp;录</a-button>
              <a @click.stop='handlerForgotPassword' class='login-form-forgot' href='javascript:;'>忘记密码?</a>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { login, getLoginCode, getCheckQrStatus } from '_axios/user'

export default {
  data() {
    return {
      islogin: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this._login_key = ''
    window.addEventListener('unload', function() {}, false)
  },
  methods: {
    /**忘记密码事件  */
    handlerForgotPassword() {
      Modal.info({
        title: '温馨提示',
        content: '请联系人事老师进行密码找回哟^_^!'
      })
    },
    //登录成功
    loginSuccss(data) {
      console.log(data)
      this.$store.commit('setToken', data.token)
      //this.$store.dispatch('login', data)
      if (this.$route.query.redirect) {
        window.location.replace(decodeURIComponent(this.$route.query.redirect))
      } else {
        this.$router.replace({ name: 'home' })
      }
    },
    /** 用户登录 */
    handlerLogin() {
      this.form.validateFields((error, values) => {
        if (!error) {
          this.loading = true
          login(this.form.getFieldsValue())
            .then(({ data }) => {
              this.loading = false
              this.loginSuccss(data)
            })
            .catch(({ message }) => {
              this.loading = false
              this.$message.error(message)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  $w390: 390px;
  width: 100%;
  height: 100%;
  //background: url('../../assets/images/bg.png') no-repeat center;
  background-size: cover;
  background-attachment: fixed;
  .login-inner {
    position: fixed;
    width: 474px;
    height: 560px;
    margin: 0 auto;
    padding: 46px 443px 46px 31px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 6px;
    .ant-form-item {
      margin-bottom: 34px;
      &.ant-form-item-with-help {
        margin-bottom: 15px;
      }
    }
    .ant-input-lg {
      height: 47px;
    }
    .ant-input-prefix {
      i {
        font-size: 18px;
      }
    }
    &-form-wrap {
      position: absolute;
      right: 21px;
      top: 46px;
      width: 422px;
      height: 468px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 16px rgba(180, 199, 219, 0.5);
      opacity: 1;
      padding: 0 23px;
      border-radius: 6px;
    }
    .login-item {
      height: 100%;
      position: relative;
      .top {
        position: relative;
        display: flex;
        height: 150px;
        width: 100%;
        justify-content: center;
        align-items: center;
        > .title {
          display: inline-block;
          width: 104px;
          height: 37px;
          font-size: 26px;
          font-weight: bold;
          line-height: 37px;
          color: rgba(59, 76, 102, 1);
          opacity: 1;
        }
      }
    }

    .change-wrap {
      position: absolute;
      top: 12px;
      right: -8px;
      width: 97px;
      height: 94px;
      background-repeat: no-repeat;
      background-position: right top;
      cursor: pointer;
      .change-tip {
        position: absolute;
        width: 80px;
        height: 30px;
        top: 0;
        left: -80px;
        //background-image: url('../../assets/images/change-tip.png');
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        color: rgba(64, 158, 255, 1);
        //animation: login-change 0.5s linear 0.5s infinite alternate;
      }
    }
  }
  .login-logo {
    width: 100%;
    height: 100%;

    > div {
      flex-direction: row;
      justify-content: center;
      display: flex;
    }

    > :nth-child(1) {
      height: 185px;
    }
    > :nth-child(2) {
      height: calc(100% - 185px);
    }
    &-pic {
      width: 513px;
      height: 244px;
      // background-image: url('../../assets/images/system-pic.png');
      background-repeat: no-repeat;
    }

    &-name {
      width: 238px;
      height: 95px;
      //background-image: url('../../assets/images/system-name.png');
      background-repeat: no-repeat;
    }
  }
  .form-wrap {
    width: $w390;
    margin: 0 auto;
  }
  .login-form-forgot {
    float: right;
    margin-right: 2px;
    margin-top: 13px;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    color: rgba(24, 144, 255, 1);
    opacity: 1;
  }
  .login-form-button {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
  }
}
</style>
