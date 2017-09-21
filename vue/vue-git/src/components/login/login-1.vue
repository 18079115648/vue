<template>
    <section class="about-warp">
        <h1></h1>
        <div class="input">
            <label for="phone">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shouji"></use>
                </svg>
            </label>
            <input type="text" id="phone" placeholder="请输入手机号" v-model="phone" />
        </div>
        <div class="input">
            <label for="vir">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                </svg>
            </label>
            <input id="vir" type="text" placeholder="请输入验证码" v-model="vir" />
            <span>
                <span @touchend="getcode" v-show="shin">| 获取验证码</span>
                <span v-show="!shin">{{num}}S</span>
            </span>
        </div>
        <div class="input">
            <label class="warpicon">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-weizhi"></use>
                </svg>
            </label>
            <div class="warp" v-if="check">
                <select @change="change1">
                    <option>省份</option>
                    <option v-for="data in sf" :value="data.id">{{data.name}}</option>
                </select>
                <select @change="change2">
                    <option>城市</option>
                    <option v-for="data in sq" :value="data.id">{{data.name}}</option>
                </select>
                <select @change="change3">
                    <option>县区</option>
                    <option v-for="data in qy" :value="data.id">{{data.name}}</option>
                </select>
                &gt;
            </div>
            <p v-if="!check">{{sfname}}省{{sqname}}市{{qyname}}区</p>
        </div>
        <div class="input">
            <label for="address">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon"></use>
                </svg>
            </label>
            <input type="text" id="address" placeholder="店名(选填)" v-model="address" />
        </div>
        <div class="input-bnt" v-if="btn" @touchend="login">提交</div>
        <div class="input-bnt" style="background: #ccc" v-if="!btn">提交</div>
    </section>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import { checkCode, checkMobile, Autho } from '../../../static/js/app.js'
export default {
    components: {
    },
    data() {
        return {
            phone: '',
            vir: '',
            shin: true,
            num: 60,
            btn: true,
            name: '',
            id: '',
            headimgurl: '',
            sf: '',
            sfname: '省份',
            sfid: '',
            sq: '',
            sqname: '城市',
            sqid: '',
            qy: '',
            qyname: '县区',
            qyid: '',
            address: '',
            check: true
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
    created() {
        this.init()
        axios.get(this.$store.state.uri + 'areas/provinces')
            .then((res) => {
                this.sf = res.data.result
            })
            .catch((err) => {
                console.log(err)
            })
        axios.get(this.$store.state.uri + '/members?access_token=' + localStorage.getItem('access_token'))
            .then((res) => {
                this.sfname = res.data.result.province
                this.sfid = res.data.result.province_id
                this.sqname = res.data.result.city
                this.sqid = res.data.result.city_id
                this.qyname = res.data.result.district
                this.qyid = res.data.result.district_id
                this.address = res.data.result.store_address
                if (this.sfid !== null && this.sfid !== undefined && this.sqid !== null && this.sqid !== undefined && this.qyid !== null && this.qyid !== undefined) {
                    this.check = false
                }
            })
            .catch((err) => {
                console.log(err)
            })
    },
    mounted() {
    },
    methods: {
        init() {
            document.title = '登录'
        },
        getcode() {
            if (checkMobile(this.phone)) {
                var self = this
                self.shin = false
                clearInterval(timera)
                var timera = setInterval(function () {
                    if (self.num > 0) {
                        self.num--
                    } else {
                        self.shin = true
                        self.num = 60
                    }
                }, 1000)
                var qs = require('qs')
                axios.post(this.$store.state.uri + 'members/bind/mobile/captcha?access_token=' + localStorage.getItem('access_token'), qs.stringify({
                    access_token: localStorage.getItem('access_token'),
                    mobile: this.phone
                }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then((res) => {
                        if (res.data.err_code === 0) {
                            console.log(1)
                        } else {
                            alert(res.data.err_msg)
                        }
                    })
                    .catch((errorn) => {
                        alert(errorn.data.err_msg)
                    })
            } else {
                alert('请填写正确的手机号')
            }
        },
        login() {
            var qs = require('qs')
            if (checkCode(this.vir) && checkMobile(this.phone) && this.checkspack(this.sfid) && this.checkspack(this.sqid) && this.checkspack(this.qyid)) {
                axios.post(this.$store.state.uri + 'members/bind/mobile?access_token=' + localStorage.getItem('access_token'), qs.stringify({
                    access_token: localStorage.getItem('access_token'),
                    captcha: this.vir,
                    mobile: this.phone,
                    openid: localStorage.getItem('openid'),
                    'city_id': this.sqid, // 城市编号
                    'district_id': this.qyid, // 区编号
                    'province_id': this.sfid, // 省编号
                    'street': this.address // 街道地址
                }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then((res) => {
                        if (res.data.err_code === 0) {
                            window.location.href = '/roulette'
                        } else {
                            alert(res.data.err_msg)
                        }
                    })
                    .catch((errorn) => {
                        alert(errorn.data.err_msg)
                    })
            } else {
                alert('请正确填写相关信息')
            }
            this.btn = false
            clearTimeout(oneTimer)
            var oneTimer = setTimeout(() => {
                this.btn = true
            }, 2000)
        },
        checkspack(str) {
            if (str === '' || str === null || str === undefined) {
                return false
            } else {
                return true
            }
        },
        change1(ele) {
            this.sfid = ele.target.value
            this.sfname = $(ele.target).find('option:selected').text()
            // console.log(this.sfid)
            axios.get(this.$store.state.uri + '/areas/provinces/' + ele.target.value + '/cities')
                .then((res) => {
                    this.sq = res.data.result
                    // console.log(this.sq)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        change2(ele) {
            this.sqid = ele.target.value
            this.sqname = $(ele.target).find('option:selected').text()
            // console.log(this.sqid)
            axios.get(this.$store.state.uri + 'areas/cities/' + ele.target.value + '/counties')
                .then((res) => {
                    this.qy = res.data.result
                    // console.log(res.data.result)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        change3(ele) {
            this.qyid = ele.target.value
            this.qyname = $(ele.target).find('option:selected').text()
            // console.log(this.qyid)
        }
    },
    computed: {
    }
}
</script>

<style lang="scss" scoped>
* {
    touch-action: none
}

.about-warp {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    font-size: .24rem;
    color: #222;
    overflow: hidden;
    padding: 0rem .46rem;
    h1 {
        width: 2.96rem;
        height: 1.75rem;
        margin: 1rem auto;
        background: url('/static/ui/logo.png') no-repeat center;
        background-size: cover
    }
    .input {
        width: 100%;
        height: 1rem;
        font-size: .3rem; // color: #ccc;
        line-height: 1rem;
        border-bottom: 1px solid #ccc;
        span {
            color: #ccc
        }
    }
    .input>label {
        width: 10%
    }
    .input>input,
    .input>p {
        width: 54%
    }
    .input>span {
        width: 36%
    }
    .icon {
        margin-right: .2rem
    }
    .input-bnt {
        width: 100%;
        height: .8rem;
        background-color: #39B382;
        border-radius: .08rem;
        text-align: center;
        line-height: .8rem;
        font-size: .34rem;
        font-weight: 600;
        color: #fff;
        margin-top: .94rem
    }
}

.warp {
    width: 87%;
    height: 100%;
    font-size: .3rem;
    float: left;
    display: flex;
    align-items: space-around;
    justify-content: space-around;
    align-content: space-between;
    background-color: #fff
}

.warpicon {
    float: left
}

.warp select {
    width: 30%;
    border: solid 0px #ccc;
    appearance: none;
    font-size: .3rem;
    line-height: .46rem;
    text-align: center; // padding: 0rem 10%;
    flex: auto;
    background-color: #fff
}

.warp select option {
    font-size: .1rem;
    line-height: .46rem;
    text-align: center;
    background-color: #fff
}
</style>