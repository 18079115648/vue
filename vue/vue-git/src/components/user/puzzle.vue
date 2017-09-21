<template>
    <section class="puzzle-warp">
        <div class="info-none" v-if="total <= 0">
            <img src="/static/ui/none.png">
            <p>暂无奖品记录</p>
        </div>
        <div class="puzzle-card" v-for="(data, index) in list_data">
          <div class="puzzle-title">
              <h4>{{data.name}}</h4>
              <div>
                  <p class="puzzle-title-item1">已获得碎片: {{data.amount}}</p>
                  <p class="puzzle-title-item2" v-if="data.target > data.amount">兑换还需: {{data.target - data.amount}}</p>
                  <p class="puzzle-title-item2" v-if="data.target <= data.amount">兑换还需: 0</p>
              </div>
          </div>  
          <div class="puzzle-info" v-if="data.status === 2">
              <div class="puzzle-info-address">
                <p class="puzzle-info-name">{{data.address.consignee}}&nbsp;&nbsp;<span>{{data.address.mobile}}</span></p>
                <div class="puzzle-info-address-main">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-weizhi"></use>
                    </svg>
                    <p>{{data.address.province_name}}省{{data.address.city_name}}市{{data.address.district_name}}{{data.address.street}}</p>
                </div>
              </div>
          </div>
          <div class="puzzle-state">
              <p class="puzzle-state-font1" v-if="data.status !== 4">状态: {{data.status_name}}</p>
              <p class="puzzle-state-font1 tip" v-if="data.status === 4">状态: {{data.status_name}}</p>
              <p class="puzzle-state-font2" v-if="data.status == 1 && data.target > data.amount">碎片未达到指定条件</p>
              <span class="puzzle-state-btn" v-if="(data.target <= data.amount) && data.status == 1 "  @touchend="chip(data.chip_id)">我要兑换</span>
              <span class="puzzle-state-btn" v-if="data.status == 3 "  @touchend="receiveGoods(data, index)">确认收货</span>
              <!--v-if="data.target - data.amount === 0"-->
          </div>
        </div>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" loadingText="加载更多..."/>
    </section>
</template>

<script>
import axios from 'axios'
import api from '@/fetch/api'
import { storageGet } from '../../../static/js/app.js'
import { Toast } from 'mint-ui'
// import { addCookie } from '../../../static/js/app.js'
export default {
  components :{
  },
  data () {
    return {
      loading: false,
      scroller: null,
      total: 0, // 总条数
      total_pages: 0, // 总页数
      page_size: 15, // 每页记录数
      page: 1, // 页数
      list_data: '', // 数据
      ifor: false,
      username: this.$store.state.username,
      userphone: this.$store.state.userphone,
      useraddress: this.$store.state.useraddress,
      access_token: ''
    }
  },
  props: {
  },
  created () {
//    document.title = '中奖记录'
      this.access_token = storageGet('access_token')
	  this.$store.commit('setLoadingStatus', true)
      axios.get(this.$store.state.uri + 'game/wheel/chips?access_token=' + localStorage.getItem('access_token'), {
          params: {
              access_token: localStorage.getItem('access_token'),
              page: 1,
              page_size: 15
          }
      })
      .then((res) => {
          this.$store.commit('setLoadingStatus', false)
          this.total_points = res.data.total_points
          this.total = res.data.result.total
          this.total_pages = res.data.result.total_pages
          this.page_size = res.data.result.page_size
          this.page = res.data.result.page
          this.list_data = res.data.result.data
      })
      .catch((err) => {
          this.$store.commit('setLoadingStatus', false)
      })
  },
  mounted () {
      this.scroller = this.$el
      this.ifor = this.$store.state.ifor
      // this.username = this.$store.state.username
      // this.userphone = this.$store.state.userphone
      // this.useraddress = this.$store.state.useraddress
  },
  methods: {
      init() {
//        document.title = '我的碎片'
      },
      chip(data) {
          // this.$store.dispatch('get_chip_id', data)
          localStorage.setItem('chip_id', data)
          // console.log(this.$store.state.chip_id)
//        window.location.href = '/user/puzzle/userinfo'
          this.$router.push('/user/puzzle/userinfo')
      },
      receiveGoods(data, index) {
      	  api.receiveGoods(this.access_token, data.chip_id).then((res) => {
            	Toast({
					message: '收货成功',
					position: 'middle',
					iconClass: 'toast-icon icon-success',
					duration: 800
				})
//          	this.$router.go(0)
				window.location.reload()
	        }).catch((err) => {
	            console.log(err)
	        })
      },
      loadMore () {
        this.page ++
        this.loading = true
        setTimeout(() => {
            if (this.page <= this.total_pages) {
                axios.get(this.$store.state.uri + 'game/wheel/chips?access_token=' + localStorage.getItem('access_token'), {
                    params: {
                        access_token: localStorage.getItem('access_token'),
                        page: this.page,
                        page_size: 15
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
    .puzzle-warp {
        width: 100%;
        height: 100vh;
        // height: auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background-color: #F5F5F9;
        color: #222
    }
    .puzzle-card {
        margin-top: .4rem
    }
    .puzzle-title {
        height: 1.4rem;
        padding: 0rem .34rem;
        background: #fff;
        overflow: hidden;
        margin-bottom: 2px;
        h4 {
            font-size: .3rem;
            line-height: .3rem;
            margin: .26rem 0rem .1rem
        }
        div {
            overflow: hidden;
            font-size: .24rem;
            line-height: .36rem;
            margin-bottom: .22rem
        }
        .puzzle-title-item1 {
            float: left
        }
        .puzzle-title-item2 {
            float: right
        }
    }
    .puzzle-info {
        height: 1.78rem;
        padding: 0rem .34rem;
        background: #fff;
        overflow: hidden;
        font-size: .24rem;
        .icon {
            float: left;
            margin-right: .24rem;
            // margin-top: 1.12rem;
            color: #666;
            height: .6rem
        }
        .puzzle-info-address {
            float: left
        }
        .puzzle-info-name {
            font-weight: 600;
            margin: .4rem 0.5rem .3rem;
            span {
                font-weight: normal
            }
        }
        .puzzle-info-address-main {
            color: #666;
            overflow: hidden;
            p {
                word-break:break-word;
                margin: 0;
                line-height: 1.4;
            }
        }
    }
    .puzzle-state {
        height: .84rem;
        padding: 0rem .34rem;
        background: #fff;
        overflow: hidden;
        font-size: .24rem;
        color: #666;
        margin-top: 2px;
        p {
            margin: 0;
            line-height: .84rem
        }
        .puzzle-state-font1 {
            color: #39b382;
            float: left
        }
        .tip {
            color: #222
        }
        .puzzle-state-font2 {
            color: #39b382;
            float: right
        }
        .puzzle-state-btn {
            width: 1.6rem;
            height: .54rem;
            border-radius: .08rem;
            float: right;
            background-color: #39B382;
            color: #fff;
            text-align: center;
            line-height: .54rem;
            margin-top: .15rem;
            text-decoration: none
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