<template>
<div class="roulette">
    <game></game>
</div>
</template>

<script>
import {storageGet,SecondAutho, Autho } from '../../../static/js/app.js'
import game from '../canvas/canvas'
export default {
  components :{
    // machines
    game
  },
  /*
    beforeCreate() {
        if (localStorage.getItem('access_token') === null || localStorage.getItem('access_token') === undefined) {
            localStorage.setItem('url', window.location.pathname)
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.$store.state.appID + '&redirect_uri=' + this.$store.state.back_uri + '/page' + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
        }
  },
  */
  beforeCreate() {
//      Autho(this)
    },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.roulette{
        width: 100%;
        height: 100%;
        min-height: 100vh;
        position: relative;
        background: url('/static/ui/bg.png') no-repeat center;
        background-size: cover
    }
</style>