<template>
    <section class="user-warp">
    	<h3 class="user-avatar">
    		<i class="avatar">
                <img :src="user.avatar"/>
            </i>
    		<span class="user-name">{{user.nickname}}</span>
    	</h3>
    	<ul class="user-record">
    		<li class="user-record-item1">
                <router-link to="/user/score">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-jifen"></use>
                    </svg>
                    <span class="user-text">我的积分</span>
                    <span class="user-btn">&gt;</span>
                    <span class="user-content">{{user.points}}</span>
                </router-link>
            </li>
    		<li class="user-record-item2">
                <router-link to="/user/puzzle">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-pintu"></use>
                    </svg>
                    <span class="user-text">中奖记录</span>
                    <span class="user-btn">&gt;</span>
                    <span class="user-content"></span>
                </router-link>
            </li>
    	</ul>
    	<ul class="user-link">
    		<li class="user-link-item">
                <router-link to="/login">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mobile"></use>
                    </svg>
                    <span class="user-text">手机号</span>
                    <span class="user-content" >{{user.mobile}} <span class="user-btn">&gt;</span></span>
                </router-link>
            </li>
    	</ul>
    	<ul class="user-about">
    		<li class="user-about-item1">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-kefu1"></use>
                </svg>
                <span class="user-text">客服热线</span>
                <a class="user-content" :href="'tel:' + user.service_tel">{{user.service_tel}}</a>
            </li>
    		<li class="user-about-item2">
                <router-link to="/user/about">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-guanyu"></use>
                    </svg>
                    <span class="user-text">关于我们</span>
                    <span class="user-btn">&gt;</span>
                    <span class="user-content"></span>
                </router-link>
            </li>
    	</ul>
    </section>
</template>

<script>
import axios from 'axios'
import { Autho } from '../../../static/js/app.js'
export default {
  components :{
  },
  data () {
    return {
        user: Object
    }
  },
  props: {
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
      Autho(this)
    },
  created () {
      var self = this
      var uri = self.$store.state.uri
      this.init()
        self.$nextTick(() => {
            axios.get(uri + '/members/ucenter?access_token=' + localStorage.getItem('access_token'))
            .then((res) => {
                self.user = res.data.result
                // console.log(res.data.result)
            })
            .catch((error) => {
                console.log(error)
            })
        })
  },
  mounted () {
  },
  methods: {
      init() {
//        document.title = '个人中心'
      }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.user-warp {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background-color: #f5f5f9;
        padding-top: .4rem;
        font: .3rem  PingFangSC-Regular;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    h3,li {
        background-color: #fff
    }
    ul {
        margin-top: .4rem
    }
    li {
        height: .88rem;
        margin-bottom: 2px;
        padding: 0rem .34rem;
        line-height: .88rem;
        overflow: hidden;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    }
    .user-avatar {
        height: 1.4rem;
        line-height: 1.4rem;
        overflow: hidden;
        padding: 0rem .34rem
    }
    .avatar {
        width: 1rem;
        height: 1rem;
        float: left;
        margin: .2rem .32rem .2rem 0rem;
        border-radius: .16rem;
        img {
            width: 1rem;
            height: 1rem;
            background-color: pink;
            border-radius: .16rem
        }
    }
    .user-name {
        color: #000;
        float: left;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    }
    .icon {
        font-size: .36rem;
        float: left;
        margin-top: .26rem
    }
    .user-record-item1 .icon {
        color: #fcbc4f
    }
    .user-record-item2 .icon {
         color: #4b89e8
    }
    .user-link-item .icon {
         color: #22ac38
    }
    .user-about-item1 {
         .icon {
             color: #fa7685
         // font-size: .4rem
         }
         .user-content{
             color: #2a2fff
         }
    }
    .user-about-item2 .icon {
         color: #38dd9a
         // font-size: .32rem
    }
    .user-text {
        color: #222;
        margin-left: .38rem;
        float: left;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    }
    .user-content {
        color: #666;
        float: right;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    }
    .user-btn {
        color: #666;
        float: right;
        margin-left: .34rem;
       font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    }
}
</style>