<template>
  <div class="login">
     <!-- 导航栏  -->
    <van-nav-bar
    title="登录"
    />
     <!-- 导航栏  -->
    <!-- 表单 -->
    <van-cell-group>
    <van-field
    v-model="user.mobile"
        label="手机号:"
        required
        clearable
        placeholder="请输入手机号"
    />
    <van-field
        v-model="user.code"
        required
        label="验证码:"
        placeholder="请输入验证码"
    />
    </van-cell-group>
    <!-- 表单 -->
    <!-- 按钮 -->
    <div class="login-btn-box">
    <van-button type="info" @click = "onLogin">登录</van-button>
    </div>
    <!-- 按钮 -->

  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  computed: {},
  watch: {
  },
  created () {},
  methods: {
    async onLogin () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const res = await login(this.user)
        console.log('登录成功', res)
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        this.$router.push('/')
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }

      // 停止 loading，它会把当前页面中所有的 toast 都给清除
      // loginToast.clear()
    }
  }
}
</script>

<style scoped lang="less">
.login {
  .login-btn-box {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>
