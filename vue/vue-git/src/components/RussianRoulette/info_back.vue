<template>
    <div class="info">
        <div class="info-none" v-if="total <= 0">
            <img src="/static/ui/none.png">
            <p>暂无中奖记录</p>
        </div>
        <div class="info-warp">
            <div ref="list" class="info-list">
                <div class="info-card" v-for="data in list_data">
                    <div class="info-card-img">
                        <img :src="123">
                    </div>
                    <div class="info-card-list">
                        <p>奖&nbsp;&nbsp;品:&nbsp;&nbsp;{{data.prize_name}}</p>
                        <p>已&nbsp;&nbsp;获:&nbsp;&nbsp;{{data.amount}}</p>
                        <p>获奖时间:&nbsp;&nbsp;{{data.create_time}}</p>
                        <p>{{data.remark}}</p>
                    </div>
                </div>
            </div>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        </div>
    </div>
</template>

<script>
// import { getCookie } from '../../../static/js/app.js'
import axios from 'axios'
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
        list_data: '' // 数据
    }
  },
  props: {
  },
  created () {
      axios.get(this.$store.state.uri + 'game/wheel/records?access_token=' + localStorage.getItem('access_token'), {
          'access_token': localStorage.getItem('access_token'),
          'page': 1,
          'page_size': 15
      })
      .then((res) => {
          console.log(res.data.result)
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
      // console.log(this.scroller)
  },
  methods: {
    loadMore() {
        this.page ++
        this.loading = true
        setTimeout(() => {
            axios.get(this.$store.state.uri + 'game/wheel/records?access_token=' + localStorage.getItem('access_token'), {
            'access_token': localStorage.getItem('access_token'),
            'page': this.page,
            'page_size': this.page_size
            })
            .then((res) => {
                console.log(res.data.result)
            })
            .catch((err) => {
                console.log(err)
            })
            this.loading = false
        }, 1000)
    }
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
    .info {
        width: 100%;
        min-height: 100vh;
        height: auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background-color: #F5F5F9
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
    .info-warp {
        width: 100%;
        height: 100vh;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .info-list,.mu-list {
        width: 100%;
        height: auto
    }
    .info-card {
        width: 100%;
        height: 2.4rem;
        margin-top: .4rem;
        background-color: #fff;
        padding-top: .1rem
    }
    .info-card-img {
        width: 2rem;
        height: 100%;
        float: left;
        img {
            width: 2rem;
            height: auto
        }
    }
    .info-card-list {
        font-size: .3rem;
        color: #222;
        overflow: hidden;
        p {
            margin: 0;
            margin-top: .16rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap
        }
        p:last-child {
            color: #BDE6D5
        }
    }
</style>