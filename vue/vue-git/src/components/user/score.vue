<template>
<dl class="demo-infinite-container score-warp">
    <dt>
        <h2>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-jifen"></use>
            </svg>
            {{total_points}}
        </h2>
    </dt>
  <mu-list>
    <div class="info-none" v-if="total <= 0">
        <img src="/static/ui/none.png">
        <p>暂无积分记录</p>
    </div>
    <dd v-for="data in list_data">
        <div class="score-content">
            <p class="score-instructions">{{data.remark}}</p>
            <p class="score-time">{{data.create_time}}</p>
        </div>
        <div class="score-count" v-if="data.points >= 0">{{data.points}}</div>
        <div class="score-count2" v-if="data.points < 0">{{data.points}}</div>
    </dd>
  </mu-list>
  <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" loadingText="加载更多..."/>
</dl>
</template>

<script>
import axios from 'axios'
// import { getCookie } from '../../../static/js/app.js'
import $ from 'jquery'
export default {
  components :{
  },
  data () {
    return {
      loading: false,
      scroller: null,
      total_points: 0,
      total: 0, // 总条数
      total_pages: 0, // 总页数
      page_size: 6, // 每页记录数
      page: 1, // 页数
      list_data: '' // 数据
    }
  },
  props: {
  },
  created () {
      this.init()
      axios.get(this.$store.state.uri + 'points/logs?access_token=' + localStorage.getItem('access_token'), {
          params: {
              access_token: localStorage.getItem('access_token'),
              page: 1,
              page_size: 6
          }
      })
      .then((res) => {
          // console.log(res.data)
          this.total_points = res.data.total_points
          this.total = res.data.result.total
          this.total_pages = res.data.result.total_pages
          this.page_size = res.data.result.page_size
          this.page = res.data.result.page
          this.list_data = res.data.result.data
      })
      .catch((err) => {
          console.log(err)
      })
  },
  mounted () {
      this.scroller = this.$el
      var h = $('.score-warp').height() - $('.score-warp dt').height()
      $('.mu-list').css({
          'height': h + 'px'
      })
  },
  methods: {
      init() {
//        document.title = '我的积分'
      },
      loadMore () {
        this.page ++
        this.loading = true
        setTimeout(() => {
            if (this.page <= this.total_pages) {
                axios.get(this.$store.state.uri + 'points/logs?access_token=' + localStorage.getItem('access_token'), {
                    params: {
                        access_token: localStorage.getItem('access_token'),
                        page: this.page,
                        page_size: this.page_size
                    }
                })
                .then((res) => {
                    // console.log(res.data.result.data)
                    this.list_data = this.list_data.concat(res.data.result.data)
                    console.log(res.data.result.page)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            this.loading = false
        }, 1000)
     }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
    .score-warp {
        height: 100vh;
        margin: 0;
        background-color: #F5F5F9;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        dt {
            width: 100%;
            height: 3.2rem;
            background: url('../../../static/ui/213.png') no-repeat center;
            background-size: cover;
            overflow: hidden;
            h2 {
                color: #fff;
                margin: .4rem auto 0rem;
                overflow: hidden;
                text-align: center;
                font-size: 1.5rem
            }
            .icon {
                font-size: .38rem;
                margin-top: 1.4rem
            }
        }
        dd {
            width: 100%;
            height: 1.4rem;
            background-color: #fff;
            margin: 2px 0 0 0;
            padding: 0rem .4rem 0rem .3rem;
            .score-content {
                float: left;
                p {
                    margin: 0;
                    margin-top: .26rem
                }
            }
            .score-instructions {
                font-size: .3rem;
                line-height: .3rem;
                color: #222
            }
            .score-time {
                font-size: .26rem;
                line-height: .26rem;
                color: #969696
            }
            .score-count {
                float: right;
                font-size: .36rem;
                color: #39b382;
                line-height: 1.4rem
            }
            .score-count2 {
                float: right;
                font-size: .36rem;
                color: #969696;
                line-height: 1.4rem
            }
        }
    }
    .mu-infinite-scroll {
        text-align: center;
        color: #ccc;
        font-size: .24rem;
        bottom: 0px
    }

    .info-none {
        width: 100%;
        min-height: 100vh;
        img {
            width: 2.09rem;
            height: 2.07rem;
            display: block;
            margin: 1.82rem auto 0
        }
        p {
            font-size: .3rem;
            color: #666;
            margin: .44rem 0rem 0rem;
            text-align: center
        }
    }
</style>