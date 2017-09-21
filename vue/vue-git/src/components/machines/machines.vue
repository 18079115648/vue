<template>
    <div class="machines" v-if="show2">
        <div class="machines-main">
            <p class="machines-font">获得</p>
            <div ref="bgs" class="machines-warp">
                <ul>
                    <li v-for='data in url'><img :src='data.pic' /></li>
                </ul>
            </div>
        </div>
        <div class="machines-btn" v-if="btn" @touchend="trun"></div>
        <div class="machines-btn" v-if="!btn" @touchend="trun2"></div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
  components :{
  },
  data () {
    return {
        show2: this.show,
        running: this.show,
        num: 0,
        timer: '',
        btn: true,
        url: this.pics
    }
  },
  props: {
      show: Boolean,
      default: false,
      pics: [String, Array, Object]
  },
  created () {
      // var self = this
      this.$nextTick(() => {
         // this.stop()
         // console.log(self.url, self.pics)
         this.timer = setInterval(this.run, 100)
      })
  },
  mounted () {
      // this.appin()
  },
  methods: {
      appin() {
          var num = this.url.length
          var arr = []
          for (var i = 0; i < num; i++) {
            arr.push('<li style="width:100%; height:100%;"><img width="100%" height="100%" src="' + this.url[i] + '"></li>')
          }
          arr.sort(function() { return 0.5 - Math.random() })
          $('.machines-main ul').append(arr)
      },
      stop() {
        clearInterval(this.timer)
      },
      run() {
        this.num++
        if (this.num >= $('.machines-main ul li').size()) {
            this.num = 0
        }
        $('ul').css({ 'top' : -this.num * $('ul').height() })
      },
      trun() {
        this.stop()
        this.running = false
        this.num = 0
        this.btn = false
        this.$refs.bgs.style.background = 'url("/static/ui/images/bgss.png") no-repeat center'
        this.$refs.bgs.style.backgroundSize = 'cover'
      },
      trun2() {
        this.show2 = false
        this.btn = true
      }
  },
  computed: {
  },
  watch: {
      show(val) {
          this.show2 = val
      },
      show2(val) {
          this.$emit('show-game', val)
      },
      running(val) {
        if (val) {
            this.timer = setInterval(this.run, 100)
          } else {
              clearInterval(this.timer)
          }
      }
  }
}
</script>

<style lang="scss" scoped>
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
        }
        .machines-font {
            text-align: center;
            color:#fff;
            font-size: .32rem;
            font-weight: 600;
            margin-top: 1rem
        }
        ul,li {
            width: 100%;
            height: 100%;
            display: block
        }
        ul {
           position: absolute;
           height: 100%;
           // background: url('/static/ui/images/中奖弹窗_03.png')
        }
        li {
            // position: absolute;
            font-size: 1rem;
            //margin: 0 auto
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
        margin-top: 1.2rem;
        margin-left: -1.5rem;
        text-align: center;
        line-height: .6rem;
        font-size: .36rem;
        color: #fff
    }
</style>