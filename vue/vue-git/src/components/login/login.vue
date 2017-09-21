<template>
    <section class="about-warp">
        <h1></h1>
        <div class="input">
            <label for="phone">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shouji"></use>
                </svg>
            </label>
            <input type="text" id="phone" placeholder="请输入手机号" v-model.trim="phone" />
        </div>
        <div class="input">
            <label for="vir">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-lock"></use>
                </svg>
            </label>
            <input id="vir" type="text" placeholder="请输入验证码" v-model.trim="vir" />
            <input class="vircode" value="| 获取验证码" :disabled="dis" @touchend="getcode2" type="button" />
        </div>
        <div class="input">
            <label class="warpicon">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-weizhi"></use>
                </svg>
            </label>
            <div class="warp" v-if="check">
            	<select v-model="sfid" @change="change1">
                    <option v-for="item in sf" :value="item.id">{{item.name}}</option>
                </select>
                <select v-model="sqid" @change="change2">
                    <option v-for="item in sq" :value="item.id">{{item.name}}</option>
                </select>
                <select v-model="qyid">
                    <option v-for="item in qy" :value="item.id">{{item.name}}</option>
                </select>
            </div>
            <p v-if="!check">{{sfname}} {{sqname}} {{qyname}}</p>
        </div>
        <div class="input" v-show="user_kind == 1">
            <label for="address">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-icon"></use>
                </svg>
            </label>
            <input type="text" id="address" placeholder="店名" v-model.trim="address" v-if="check" />
            <input type="text" id="address" :placeholder="holderAddress" v-model.trim="address" v-if="!check" />
        </div>
        <div class="user-kind-select">
        	<mt-radio
			  v-model="user_kind"
			  :options="options">
			</mt-radio>
        </div>
        <div class="input-bnt" v-if="btn" @touchend="login">提交</div>
        <div class="input-bnt" style="background: #ccc" v-if="!btn">提交</div>
    </section>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import { MP } from '../../../static/js/map.js'
import { checkCode, checkMobile, Autho } from '../../../static/js/app.js'
import { Toast } from 'mint-ui'
export default {
    components: {
    },
    data() {
        return {
            ass: true,
            asw: false,
            phone: '',
            vir: '',
            shin: true,
            counts: '| 获取验证码',
            btn: true,
            name: '',
            id: '',
            headimgurl: '',
            sf: '',
            sfname: '省份',
            defaultSf: '省份',
            sfid: '',
            sq: '',
            sqname: '城市',
            defaultSq: '城市',
            sqid: '',
            qy: '',
            qyname: '县区',
            qyid: '',
            address: '',
            holderAddress: '',
            check: true,
            dis: false,
            ss: '',
            Latitude: '', // 纬度
            Longitude: '', // 经度
            options: [
			  {
			    label: '车主',
			    value: '2'
			  },
			  {
			    label: '维修工',
			    value: '1'
			  }
			],
			user_kind: '2'
        }
    },
    props: {
    },
    beforeCreate() {
        Autho(this)
    },
    created() {
       
    },
    mounted() {
        var self = this
        MP('c8ViDxq9FA8W3TEGrRcEbiLL').then(BMap => {
            var geolocation = new BMap.Geolocation()
            geolocation.getCurrentPosition((r) => {
                self.Latitude = r.point.lat
                self.Longitude = r.point.lng
                self.showPosition()
            })
        })
    },
    methods: {
        init() {
//          document.title = '登录'
        },
        getcode() {
            if (checkMobile(this.phone)) {
                if (this.dis) {
                    return
                }
                var self = this
                self.shin = false
                self.counts = 60
                self.dis = true
                self.ss = 'S'
                clearInterval(timera)
                var timera = setInterval(function () {
                    if (self.counts > 0) {
                        self.counts--
                    } else {
                        self.shin = true
                        self.dis = false
                        self.ss = ''
                        self.counts = '| 获取验证码'
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
        getcode2() {
            // var i = 0
            if (checkMobile(this.phone)) {
                if (this.dis) {
                    return
                }
                var self = this
                
                // jq
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
                            self.shin = false
			                self.counts = 60
			                self.dis = true
			                self.ss = 'S'
			                clearInterval(this.timeras)
			                this.timeras = setInterval(function () {
			                    if (self.counts > 0) {
			                        self.counts--
			                    } else {
			                        self.shin = true
			                        self.dis = false
			                        self.ss = ''
			                        self.counts = '| 获取验证码'
			                    }
			                }, 1000)
			                // jq
			                var value = 60
			                clearInterval(this.timera)
			                this.timera = setInterval(function () {
			                    if (value > 0) {
			                        value--
			                        $('.vircode').val(value)
			                    } else {
			                        self.shin = true
			                        self.dis = false
			                        self.ss = ''
			                        self.counts = '| 获取验证码'
			                        $('.vircode').val('| 获取验证码')
			                    }
			                }, 1000)
                        }else if(res.data.err_code == 40004) {
                        	Toast({
							  message: '手机号码已注册',
							  position: 'bottom',
							  duration: 1500
							});
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
        	var self = this
            var qs = require('qs')
            var status = true
            if (checkCode(this.vir) && checkMobile(this.phone) && this.checkspack(this.sfid) && this.checkspack(this.sqid) && this.checkspack(this.qyid)) {
            	if(this.user_kind == 1) {
            		if(!this.checkspack(this.address)) {
            			status = false
            			Toast({
						  message: '请输入店名',
						  position: 'bottom',
						  duration: 1000
						});
            		}
            	}else {
            		this.address = ''
            	}
            	if(!status) {
            		return
            	}
                axios.post(this.$store.state.uri + 'members/bind/mobile?access_token=' + localStorage.getItem('access_token'), qs.stringify({
                    access_token: localStorage.getItem('access_token'),
                    captcha: this.vir,
                    mobile: this.phone,
                    openid: localStorage.getItem('openid'),
                    'city_id': this.sqid, // 城市编号
                    'district_id': this.qyid, // 区编号
                    'province_id': this.sfid, // 省编号
                    'store_address': this.address, // 街道地址,
                    'member_type': this.user_kind
                }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    })
                    .then((res) => {
                        if (res.data.err_code === 0) {
                        	clearInterval(this.timeras)
                        	clearInterval(this.timera)
                        	Toast({
							  message: '注册成功',
							  position: 'middle',
							  iconClass: 'toast-icon icon-success',
							  duration: 1000
							})
							setTimeout(() => {
								window.location.href = self.$store.state.back_uri + localStorage.getItem('url')
							},800)
                        }else if(res.data.err_code == 40004) {
                        	Toast({
							  message: '手机号码已注册',
							  position: 'bottom',
							  duration: 1500
							});
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
        change1() {
            var self = this
//          self.ass = false
//          self.defaultSq = '市区'
//          this.sfid = ele.target.value
//          this.sfname = $(ele.target).find('option:selected').text()
            // console.log(this.sfid)
            var id1 = 0
            var id2 = 0
            this.$axios.get(self.$store.state.uri + 'areas/provinces/' + this.sfid + '/cities')
            .then((res) => {
                self.sq = res.data.result
                self.sqid = res.data.result[0].id
                this.change2()
            })
        },
        change2() {
        	var self = this
			this.$axios.get(self.$store.state.uri + 'areas/cities/' + self.sqid + '/counties')
            .then((res2) => {
                self.qy = res2.data.result
                self.qyid = res2.data.result[0].id
            })
        },
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.showPosition)
            } else {
                alert('无法获取位置信息')
            }
        },
        showPosition() {
            var self = this
            this.$axios.get(this.$store.state.uri + '/location/geocoder/city?latitude=' + this.Latitude + '&longitude=' + this.Longitude)
                .then((msg) => {
                    
                    this.defaultSf = msg.data.province.name
                    
                    this.defaultSq = msg.data.city.name
                    this.$axios.get(this.$store.state.uri + 'areas/provinces')
                        .then((res) => {
                            self.sf = res.data.result
                            this.sfid = msg.data.province.id
                        })
                    this.$axios.get(self.$store.state.uri + '/areas/provinces/' + msg.data.province.id + '/cities')
                    .then((res) => {
                        self.sq = res.data.result
                        this.sqid = msg.data.city.id
                    })
                    this.$axios.get(self.$store.state.uri + 'areas/cities/' + msg.data.city.id + '/counties')
                    .then((res) => {
                        self.qy = res.data.result
                        self.qyid = res.data.result[0].id
                    })
                    
                })
        }
    },
    computed: {
    },
    beforeRouteLeave(to, from, next) {
		clearInterval(this.timeras)
        clearInterval(this.timera)
		next()
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
    .input>.vircode {
        width: 30%;
        background-color: #fff;
        color: #39B382;
    }
    .icon {
        margin-right: .2rem;
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
        margin-top: .6rem
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
    // flex: auto;
    background-color: #fff
}

.warp select option {
    font-size: .1rem;
    line-height: .46rem;
    text-align: center;
    background-color: #fff
}
.user-kind-select{
	padding-top: 0.3rem;
}
.user-kind-select .mint-radiolist{
	display: flex;
}

</style>