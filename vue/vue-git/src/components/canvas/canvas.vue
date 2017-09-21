<template>
  <div class="game-warp">
    <div class="game-btn-two">
      <router-link to="/roulette/instructions" class="game-btn btn1">活动规则</router-link>
      <router-link to="/roulette/info" class="game-btn btn2">中奖记录</router-link>
    </div>
    <div class="bg" v-if="false"></div>
    <div class="game-whell">
      <div class="content">
        <div class="wheel">
          <canvas class="item" id="wheelCanvas" width="422px" height="422px">
          </canvas>
          <img class="pointer p2" src="/static/ui/go.png" @touchend="srandom" v-show="imgbtn">
          <img class="pointer p2" src="/static/ui/go.png" v-show="!imgbtn">
        </div>
      </div>
      <div class="tips">
        <span id="tip" v-if="false">即将揭晓</span>
      </div>
    </div>
    <div class="reward-text">中奖名单</div>
    <div class="reward-box">
      <section></section>
      <ol ref="ol">
        <li v-for="item in records">
          <span>恭喜</span>
          <span class="name">{{item.nickname}}</span>
          <span style="color: #222;">获得</span>
          <span>{{item.amount}}个{{item.prize_name}}</span>
        </li>
      </ol>
    </div>
    <!--<div class="btngs" v-if="btnpng"></div>-->
    <!--<machines :show="show" @show-game="hid" :pics="chip_pics"></machines>-->
    <div class="machines" ref="bgs" v-if="show&&show5">
      <div class="machines-main">
        <p class="machines-font">获得</p>
        <div class="machines-warp">
          <ul v-if="type === 3">
            <li v-for='data in chip_pics'>
              <img :src='data.pic' :alt="data.status" />
            </li>
          </ul>
          <div class="machines-jf" v-if="type === 2">
            <span>{{m1}}</span>
            <span>{{m2}}</span>
            <span>{{m3}}</span>
          </div>
          <!--<div class="machines-no" v-if="type === 5">未中奖请再接再励</div>-->
        </div>
      </div>
      <div class="machines-btn" v-if="false" @touchend="trun"></div>
      <div class="machines-btn" v-if="!btn" @touchend="trun2"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { init, drawWheelCanvas, rotateFunc, tou } from '../../../static/js/index.js'
import {storageGet,SecondAutho, Autho } from '../../../static/js/app.js'
// import { getCookie } from '../../../static/js/app.js'
import axios from 'axios'
import api from '@/fetch/api'
// import machines from '../machines/machines'
export default {
  components: {
    // machines
  },
  data() {
    return {
      show: false,
      show5: true, // type=5为false
      // show2: this.show,
      wheels: [],
      records: [],
      lens: '',
      amount: '', // 中奖数量
      chip_pics: '', // 奖品图片
      prize_name: '', // 奖品名称
      type: '', // 奖品类型
      wheel_id: '', // 奖品编号
      // 条框
      // running: this.show,
      num: 0,
      timer: '',
      timer2: '',
      btn: true,
      // url: this.pics
      m1: 0,
      m2: 0,
      m3: 0,
      btnpng: false,
      imgbtn: true,
      nc: 0,
      timeaaa: '',
      num2: 0
    }
  },
  props: {
  },
  beforeCreate() {
    this.num2 = 0
    clearInterval(this.timeaaa)
  },
  created() {
  	var self = this
  	if(!SecondAutho()) {
			return
		}
		this.access_token = storageGet('access_token')
		this.$store.commit('setLoadingStatus', true)
		api.isBindPhone(this.access_token).then((res) => {
			this.$store.commit('setLoadingStatus', false)
			this.$nextTick(() => {
	      if (self.$store.state.wheels === null || self.$store.state.wheels === undefined || self.$store.state.wheels === '') {
	        axios.get(this.$store.state.uri + 'game/wheel')
	          .then((res) => {
	            self.wheels = res.data.result.wheels
	            self.$store.dispatch('get_wheels', res.data.result.wheels)
	            self.records = res.data.result.records
	            self.$store.dispatch('get_records', res.data.result.records)
	            this.lens = res.data.result.records.length
	            init(self.wheels)
	            // console.log(self.wheels)
	            var flag = 0
	            var len = self.wheels.length // self.wheels.length
	            for (var i = 0; i < self.wheels.length; i++) {
	              var img = new Image()
	              img.src = self.wheels[i].pic
	              if (self.wheels[i].pic === '' || self.wheels[i].pic === null) {
	                len = len - 1
	                // console.log(123)
	              }
	              img.onload = () => {
	                flag++
	                // console.log(flag, len)
	                if (flag === len) {
	                  drawWheelCanvas()
	                }
	              }
	            }
	          }).catch()
	      } else {
	        // self.wheels = self.$store.state.wheels
	        self.records = self.$store.state.records
	        this.lens = self.$store.state.records.length
	        // init(self.$store.state.wheels)
	        // console.log(this.wheels)
	        var flag = 0
	        var len = self.$store.state.wheels.length
	        for (var i = 0; i < self.$store.state.wheels.length; i++) {
	          var img = new Image()
	          img.src = self.$store.state.wheels[i].pic
	          if (self.$store.state.wheels[i].pic === '' || self.$store.state.wheels[i].pic === null) {
	            len = len - 1
	            // console.log(123)
	          }
	          img.onload = () => {
	            flag++
	            // console.log(flag, len)
	            if (flag === len) {
	              drawWheelCanvas()
	            }
	          }
	        }
	      }
	    })
		})
		.catch((error) => {
			this.$store.commit('setLoadingStatus', false)
		})
    

  },
  mounted() {
    rotateFunc(self)
    // tou
    /*eslint-disable */
    var self = this
    var h = 0
    // self.num2 = 0
    clearInterval(this.timeaaa)
    $('.reward-box ol').append($('.reward-box ol li')[0])
    self.timeaaa = setInterval(() => {
      // console.log($('.reward-box ol').height())
      self.num2 += 1
      // console.log('num' + num)
      h = $('.reward-box ol li').height() * (this.lens)
      $('.reward-box ol').css({ top: -self.num2 })
      if (self.num2 >= h) {
        self.num2 = 0
      }
    }, 30)
    // style
    $('.game-whell').css({
      'height': $('.content').height() * 1.27
    })
    $('.content').css({
      'height': $('.content').width(),
      'margin-top': $('.content').width() * -0.5,
      'margin-left': $('.content').width() * -0.5
    })
  },
  methods: {
    hid(val) {
      this.show = val
    },
    appin() {
      var num = this.url.length
      var arr = []
      for (var i = 0; i < num; i++) {
        arr.push('<li style="width:100%; height:100%;"><img width="100%" height="100%" src="' + this.url[i] + '"></li>')
      }
      // arr.sort(function() { return 0.5 - Math.random() })
      arr.push('<li style="width:100%; height:100%;"><img width="100%" height="100%" src="' + this.url[0] + '"></li>')
      $('.machines-main ul').append(arr)
    },
    stop() {
      var srcc = ''
      var altt = ''
      this.btnpng = false
      $('ul li img').each((index, el) => {
        // console.log($(el).attr('alt'))
        if ($(el).attr('alt') === '1' || $(el).attr('alt') === 1) {
          // console.log($(el).attr('alt'), $(el).attr('src'))
          srcc = $(el).attr('src')
          altt = $(el).attr('alt')
        }
      })
      $('.machines-warp ul').empty()
      $('ul').css({ 'top': 0 })
      $('.machines-warp ul').append('<li><img src=' + srcc + ' alt=' + altt + ' width=100% height=100% /></li>')
      clearInterval(this.timer)
      clearInterval(this.timer2)
      var arrnum = []
      for (var k = 0; k < (this.amount + '').length; k++) {
        arrnum.push((this.amount + '')[k])
      }
      if (arrnum.length === 3) {
        this.m1 = arrnum[0]
        this.m2 = arrnum[1]
        this.m3 = arrnum[2]
      } else if (arrnum.length === 2) {
        this.m1 = 0
        this.m2 = arrnum[0]
        this.m3 = arrnum[1]
      } else if (arrnum.length === 1) {
        this.m1 = 0
        this.m2 = 0
        this.m3 = arrnum[0]
      }
    },
    run() {
      this.num++
      this.nc++
      if (this.num > $('.machines-main ul li').size()) {
        this.num = 0
      }
      $('ul').css({ 'top': -this.num * $('ul').height() })
      if (this.nc >= 20) {
        this.trun()
      }
    },
    run2() {
      this.m1 = Math.round(Math.random() * 9)
      this.m2 = Math.round(Math.random() * 9)
      this.m3 = Math.round(Math.random() * 9)
    },
    trun() {
      this.stop()
      // this.running = false
      this.num = 0
      this.btn = false
      this.$refs.bgs.style.background = 'url("/static/ui/images/bgss.png") no-repeat center rgba(0, 0, 0, .8) '
      this.$refs.bgs.style.backgroundSize = 'cover'
    },
    trun2() {
      this.show = false
      this.btn = true
      this.imgbtn = true
    },
    srandom() {
      var jg = confirm('抽奖一次消耗50积分')
      if (jg) {
        if (localStorage.getItem('access_token') === undefined || localStorage.getItem('access_token') === null) {
          alert('未登录，请先登陆')
          this.$router.push('/login')
        }
        var self = this
        self.btnpng = true
        self.imgbtn = false
        axios.post(self.$store.state.uri + 'game/wheel/lottery?access_token=' + localStorage.getItem('access_token'), {
          'access_token': localStorage.getItem('access_token')
        }, false)
          .then((res) => {
          	var endTimer = setTimeout(() => {
          		clearTimeout(endTimer)
          		self.imgbtn = true
          	}, 9000)
          	
            if (res.data.err_code !== 0 && res.data.err_code !== 82003) {
              console.log(res.data.err_msg)
            }
            if (res.data.err_code === 82003) {
              alert(res.data.err_msg)
              // 新增
              self.trun2()
            }
            self.amount = res.data.result.amount // 中奖数量
            self.chip_pics = res.data.result.chip_pics // 奖品图片
            self.prize_name = res.data.result.prize_name // 奖品名称
            self.type = res.data.result.type // 奖品类型
            self.wheel_id = res.data.result.wheel_id // 奖品编号
            self.$store.dispatch('get_pics', self.chip_pics)
            self.$store.dispatch('get_name', self.prize_name)
            self.$store.dispatch('get_type', self.type)
            if (self.type === 5) {
              self.show5 = false
              tou(self, self.wheel_id)
            } else {
              self.show5 = true
              tou(self, self.wheel_id)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    srandom2() {
      var self = this
      axios.post(self.$store.state.uri + 'game/wheel/lottery?access_token=' + localStorage.getItem('access_token'), {
        'access_token': localStorage.getItem('access_token')
      }, false)
        .then((res) => {
          if (res.data.err_code !== 0 && res.data.err_code !== 82003) {
            alert(res.data.err_msg)
          }
          if (res.data.err_code === 82003) {
            alert(res.data.err_msg)
            self.trun2()
          }
        })
    }
  },
  computed: {
  },
  watch: {
    show(val) {
      if (val) {
        this.nc = 0
        this.timer = setInterval(this.run, 100)
        this.timer2 = setInterval(this.run2, 100)
      } else {
        clearInterval(this.timer)
        clearInterval(this.timer2)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  touch-action: none
}

.game-warp {
  position: relative;
  overflow: hidden;
  height: 100vh
}

.game-whell {
  width: 5.2rem; // margin: 0.84rem auto 0rem;
  position: relative;
  z-index: 100
}

.game-whell {
  width: 6.6rem;
  height: 6.6rem; // margin: 0.84rem auto 0rem;
  position: relative;
  z-index: 100;
  background: url('/static/ui/zp.png') no-repeat center;
  background-size: contain
}

.bg {
  width: 6.6rem;
  height: 6.6rem;
  margin-top: -.1rem;
  left: 50%;
  margin-left: -3.3rem;
  position: absolute;
  z-index: 1; // background: url('/static/ui/zp.png') no-repeat center;
  background-size: contain;
}




/* 大转盘样式 */

.content {
  display: block;
  width: 100%;
  /*居中显示*/
  margin: 0 auto;
  margin-top: 1px
  /*转盘的背景*/
  //background: url('../../../static/ui/zp.png') no-repeat center;
  //background-size: contain;
}

.content .wheel {
  display: block;
  width: 100%;
  position: relative;
  /*转盘的背景*/
  //background: url('../../../static/ui/zp.png') no-repeat center;
  //background-size: contain;
}

.content .wheel canvas.item {
  width: 100%;
}

.content .wheel img.pointer {
  position: absolute; //width: 31.5%;
  height: 40%;
  left: 32%;
  top: 23%;
}

.tips {
  text-align: center;
  margin: 20px 0;
  color: red;
  font: normal 24px 'MicroSoft YaHei';
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  display: none
}




/*提示和列表*/

.game-btn-two {
  margin-top: .26rem;
  margin-bottom: .24rem;
  overflow: hidden;
  font-size: .36rem
}

.game-btn {
  width: 1.66rem;
  height: .57rem;
  background-color: #FEC401;
  line-height: .57rem;
  font-size: .32rem;
  text-align: center;
  color: #9A5100;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

.btn1 {
  float: left;
  background: url('/static/ui/btn1.png') no-repeat center;
  background-size: contain
}

.btn2 {
  float: right;
  background: url('/static/ui/btn2.png') no-repeat center;
  background-size: contain
}

.reward-text {
  width: 1.92rem;
  height: .46rem;
  background: url('/static/ui/title.png') no-repeat center;
  background-size: contain;
  font-size: .3rem;
  line-height: .46rem;
  text-align: center;
  color: #fff;
  margin: 1.2rem auto;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

.reward-box {
  width: 6.8rem;
  height: 4.8rem;
  background-color: #fff;
  margin: .1rem auto;
  background-color: rgba(255, 255, 255, .1);
  border: 1px solid rgba(255, 255, 255, .2);
  margin-top: -1.2rem;
  overflow: hidden; // -webkit-overflow-scrolling: touch;
  position: relative;
  section {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1000
  }
  ol {
    width: 100%;
    padding: 0rem .08rem;
    position: absolute;
    z-index: 800
  }
  li {
    width: 100%;
    overflow: hidden;
    font-size: .24rem;
    line-height: .36rem;
    text-align: center;
    color: #fff;
    margin-top: .3rem;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    span {
      float: left;
      width: 12%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }
    span:first-child {
      width: 12%;
      color: #222
    }
    .name {
      width: 36%
    }
    span:last-child {
      width: 40%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }
  }
}




/*gai2*/

.game-whell {
  width: 100%;
  height: 8rem
}

.content {
  width: 76%;
  position: absolute;
  top: 50%;
  left: 50%
}

.content .wheel {
  width: 100%;
  height: 100%
}

.game-btn-two {
  margin-bottom: 0
}

// media

/*4 4s*/

@media only screen and (device-height :480px) and (-webkit-device-pixel-ratio:2) {
  .game-whell {
    height: 6rem
  }
  .reward-box {
    height: 2.8rem
  }
  .content {
    width: 74%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: 0.3rem
  }
}

@media only screen and (max-device-width :480px) {
  .game-whell {
    height: 6rem
  }
  .reward-box {
    height: 3rem
  }
  .content {
    width: 66%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: 0.3rem
  }
}

@media only screen and (min-device-width :481px) {
  .game-whell {
    height: 6rem
  }
  .reward-box {
    height: 3rem
  }
  .content {
    width: 74%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: 0.3rem
  }
}




/*5*/

@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2) {
  /* 兼容iphone5 */
  .game-whell {
    height: 6rem
  }
  .reward-box {
    height: 3rem
  }
  .content {
    width: 74%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: 0.3rem
  }
}




/*6*/

@media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
  .game-whell {
    height: 7rem
  }
  .reward-box {
    height: 3.2rem
  }
  .content {
    width: 74%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: 0.3rem
  }
}




/*6+*/

@media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
  .game-whell {
    height: 8rem
  }
  .reward-box {
    height: 3.6rem
  }
  .content {
    width: 76%
  }
  .content .wheel canvas.item {
    width: 82%;
    margin: 0 9%;
    width: 100%;
    margin: 0
  }
  .content .wheel img.pointer {
    top: 26%;
    left: 33.5%
  }
  .reward-text {
    margin-top: .3rem
  }
}





/*
it
*/

.machines {
  width: 100%;
  height: 6rem;
  min-width: 100vw;
  min-height: 100vh;
  position: fixed;
  z-index: 1000;
  background-color: rgba(0, 0, 0, .8);
  top: 0
}

.machines-main {
  width: 4.66rem;
  height: 6.4rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -4rem 0rem 0rem -2.33rem;
  background: url('/static/ui/images/titles.png') no-repeat top center;
  overflow: hidden;
  .machines-warp {
    position: relative;
    width: 100%;
    height: 3.6rem;
    overflow: hidden;
    margin-top: .36rem
  }
  .machines-font {
    text-align: center;
    color: #fff;
    font-size: .32rem;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    font-weight: 600;
    margin-top: 1.6rem
  }
  ul,
  li {
    width: 100%;
    height: 100%;
    display: block
  }
  ul {
    position: absolute;
    height: 100%; // background: url('/static/ui/images/中奖弹窗_03.png')
  }
  li {
    // position: absolute;
    font-size: 1rem;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif; //margin: 0 auto
    img {
      width: 100%;
      height: 100%;
      display: block;
      margin: 0 auto
    }
  }
}

.machines-btn {
  width: 3rem;
  height: .6rem;
  background: url('/static/ui/images/btns.png') no-repeat center;
  background-size: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 2.4rem;
  margin-left: -1.5rem;
  text-align: center;
  line-height: .6rem;
  font-size: .36rem;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #fff
}

.machines-jf {
  height: 4.32rem;
  height: 1.94rem;
  margin: 0 auto;
  line-height: 1.94rem;
  color: #222;
  font-size: 1rem;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  text-align: center;
  background: url('/static/ui/images/jf.png') no-repeat center;
  background-size: cover;
  display: flex;
  align-items: space-around;
  justify-content: space-around;
  align-content: space-between;
  span {
    flex: auto
  }
}

.machines-no {
  height: 4.32rem;
  height: 1.94rem;
  margin: 0 auto;
  line-height: 1.94rem;
  color: #222;
  font-size: 1rem;
  text-align: center;
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}

.btngs {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 880;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .01)
}
</style>