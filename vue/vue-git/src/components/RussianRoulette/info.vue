<template>
<div class="info">
    <div class="info-none" v-if="total <= 0">
        <img src="/static/ui/none.png">
        <p>暂无中奖记录</p>
    </div>
    <div class="info-warp">
        <div class="info-card" v-for="data in list_data">
                <div class="info-card-img">
                    <img :src="data.prize_pic">
                </div>
                <div class="info-card-list items">
                    <p>奖&nbsp;&nbsp;品:&nbsp;&nbsp;{{data.prize_name}}</p>
                    <p>已&nbsp;&nbsp;获:&nbsp;&nbsp;{{data.amount}}</p>
                    <p>获奖时间:&nbsp;&nbsp;{{data.create_time}}</p>
                    <p>{{data.remark}}</p>
                </div>
        </div>
    </div>
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" loadingText="加载更多..." />
</div>
</template>

<script>
// import $ from 'jquery'
// simport { getCookie } from '../../../static/js/app.js'
import axios from 'axios'
export default {
  data () {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push('item' + (i + 1))
    }
    return {
      list,
      num: 10,
      loading: false,
      scroller: null,
      total: 0, // 总条数
      total_pages: 0, // 总页数
      page_size: 15, // 每页记录数
      page: 1, // 页数
      list_data: '' // 数据
    }
  },
  created () {
//  document.title = '中奖记录'
    axios.get(this.$store.state.uri + 'game/wheel/records?access_token=' + localStorage.getItem('access_token'), {
        'access_token': localStorage.getItem('access_token'),
        'page': 1,
        'page_size': 15
    })
    .then((res) => {
        // console.log(res.data.result)
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
  },
  methods: {
    loadMore () {
        this.page ++
        this.loading = true
        setTimeout(() => {
            if (this.page <= this.total_pages) {
                axios.get(this.$store.state.uri + 'game/wheel/records?access_token=' + localStorage.getItem('access_token'), {
                    params: {
                        'access_token': localStorage.getItem('access_token'),
                        'page': this.page,
                        'page_size': this.page_size
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
  }
}
</script>

<style lang="scss" scoped>
.info {
        width: 100%;
        min-height: 100vh;
        height: 100vh;
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
        // height: 100vh;
        // overflow: auto;
        // -webkit-overflow-scrolling: touch;
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
        // padding-top: .1rem
    }
    .info-card-img {
        width: 2rem;
        height: 100%;
        float: left;
        padding: .1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 100%;
            // height: 100%
        }
    }
    .info-card-list {
        height: 100%;
        font-size: .3rem;
        color: #222;
        overflow: hidden;
        padding-left: .24rem;
        p {
            height: 25%;
            margin: 0;
            line-height: .6rem;
            // margin-top: .16rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap
        }
        p:last-child {
            color: #39b382
        }
    }
    .mu-infinite-scroll {
        text-align: center;
        color: #ccc;
        font-size: .24rem;
        bottom: 0px
    }
</style>