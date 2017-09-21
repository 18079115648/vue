<template>
    <div class="qrcode-warp">
        <h2>{{title}}</h2>
        <!--<img src="/static/ui/qr/h.png" class="h2">-->
        <h3>{{tip}}</h3>
        <!--<h4>关注公众号抽奖赢好礼</h4>-->
        <img src="/static/ui/qr/t.png" class="h4">
        <div class="qr-line">
            <!--<img src="123" class="qrcode">-->
            <img src="/static/ui/qr/qrcode.png" class="qrbg">
        </div>
        <p>(长按二维码可关注“松泽电器”)</p>
    </div>
</template>

<script>
import { Autho, GetQueryString, GetQueryStringOther } from '../../../static/js/app.js'
import axios from 'axios'
export default {
    components: {
    },
    data() {
        return {
            title: '',
            tip: ''
        }
    },
    props: {
    },
    beforeCreate() {
        Autho(this)
    },
    created() {
        localStorage.setItem('qrcode', GetQueryStringOther('code'))
        localStorage.setItem('qrcodepage', window.location.pathname)
        var qs = require('qs')
        // this.$store.state.uri + 'qrcode/exchange?access_token=' + localStorage.getItem('access_token')
        axios.post(this.$store.state.uri + 'qrcode/exchange?access_token=' + localStorage.getItem('access_token'), qs.stringify({
            access_token: localStorage.getItem('access_token'),
            code: localStorage.getItem('qrcode')
        }))
            .then((res) => {
                // console.log(res.data)
                if (res.data.err_code === 60004) {
                    var jg = confirm('请先绑定地区信息')
                    if (jg) {
                        localStorage.setItem('url', window.location.pathname + window.location.search)
                        this.$router.push('/login')
                    }
                } else if (res.data.err_code !== 0) {
                    this.tip = res.data.err_msg
                    this.title = '抱歉!'
                    // alert(localStorage.getItem('access_token'))
                } else {
                    this.title = '恭喜您!'
                    this.tip = '获得' + res.data.result + '积分'
                }
            })
            .catch((err) => {
                console.log(err)
            })
    },
    mounted() {
    },
    methods: {},
    computed: {
    }
}
</script>

<style lang="scss" scoped>
.qrcode-warp {
    width: 100vw;
    height: 100vh;
    background: url('/static/ui/qr/bg.png') no-repeat center;
    background-size: cover;
    color: #fff;
    font-family: "PingFang SC", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    overflow: hidden;
    text-align: center;
    position: relative
}

.qr-line {
    // width: 4.88rem;
    // height: 3.67rem;
    // background: url('/static/ui/qr/qr.png') no-repeat center;
    // background-size: cover;
    // margin: 0 auto;
    position: relative
}

.qrcode {
    width: 2.8rem;
    height: 2.8rem;
    background-color: pink;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -1.2rem;
    margin-left: -0.8rem
}

.qrbg {
    width: 3.44rem;
    height: auto;
}

h2,
.h2 {
    margin-top: 2.2rem;
    font-size: .9rem;
    font-family: "方正黑体简体";
    border: 800
}

.h2 {
    width: 3.44rem;
    height: auto
}

h3 {
    font-size: .45rem;
    margin-top: .42rem;
    span {
        font-size: .7rem
    }
}

h4,
.h4 {
    font-size: .36rem;
    margin-top: 2.46rem
}

.h4 {
    width: 4.33rem;
    height: auto
}

p {
    width: 100%;
    font-size: .26rem;
    color: #222;
    position: absolute;
    bottom: .92rem
}



/*4 4s*/

@media only screen and (device-height :480px) and (-webkit-device-pixel-ratio:2) {
    .h2 {
        margin-top: 1.2rem;
    }
    .h4 {
        margin-top: 1rem
    }
    .qrbg {
        width: 5rem;
        height: auto;
        margin-top: .2rem
    }
    p {
        bottom: .2rem
    }
    .qrcode {
        width: 1.88rem;
        height: 1.88rem;
        margin-top: -.98rem;
        margin-left: -0.42rem
    }
}

@media only screen and (max-device-width :480px) {}

@media only screen and (min-device-width :481px) {}



/*5*/

@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2) {
    .h4 {
        margin-top: 1.6rem
    }
    .qrbg {
        width: 5rem;
        height: auto;
        margin-top: .2rem
    }
    p {
        bottom: .3rem
    }
    .qrcode {
        width: 2rem;
        height: 2rem;
        margin-top: -1.03rem;
        margin-left: -0.49rem
    }
}

@media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
    .qrbg {
        width: 6rem;
        height: auto;
        margin-top: .2rem
    }
    p {
        bottom: .3rem
    }
    .qrcode {
        width: 2.4rem;
        height: 2.4rem;
        margin-top: -1.24rem;
        margin-left: -0.58rem
    }
}



/*6+*/

@media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
    .qrbg {
        width: 7.2rem;
        height: auto;
    }
    p {
        bottom: .3rem
    }
    .qrcode {
        width: 2.8rem;
        height: 2.8rem;
        margin-top: -1.46rem;
        margin-left: -0.64rem
    }
}
</style>