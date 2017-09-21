<template>
    <section class="info-warp">
        <form class="info-form">
            <p>
                <label for="info-form-name">收货人</label>
                <input id="info-form-name" type="text" placeholder="请输入收货人姓名" v-model.trim="name" />
            </p>
            <p>
                <label for="info-form-mobile">手机号</label>
                <input id="info-form-mobile" type="text" placeholder="请输入收货人手机号" v-model.trim="mobile" />
            </p>
            <p>
                <label for="info-form-sf">所在地区</label>
                <!--<input type="text" id="info-form-sf" placeholder="请选择省市区" v-model="sf" />-->
                <span class="warp">
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
                </span>
            </p>
            <p>
                <label for="info-form-address">详细地址</label>
                <input type="text" id="info-form-address" placeholder="请输入收货人详细地址" v-model.trim="address" />
            </p>
        </form>
        <div class="info-form-btn" v-if="check.btn" @touchend="runto">立即兑换</div>
        <div class="info-form-btn dis" v-if="!check.btn">立即兑换</div>
    </section>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import { Toast } from 'mint-ui'
// import { getCookie } from '../../../static/js/app.js'
export default {
    components: {
    },
    data() {
        return {
            name: '',
            mobile: '',
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
            check: {
                nameCheck: false,
                mobileCheck: false,
                sfCheck: false,
                sqCheck: false,
                qyCheck: false,
                addressCheck: false,
                btn: false
            }
        }
    },
    props: {
    },
    created() {
//      document.title = '碎片兑换'
        axios.get(this.$store.state.uri + 'areas/provinces')
        .then((res) => {
            this.sf = res.data.result
        })
        .catch((err) => {
            console.log(err)
        })
    },
    mounted() {
    },
    methods: {
        checkName(str) {
            var re = /^[\u4E00-\u9FA5]{2,6}$/
            var m = true
            if (re.test(str)) {
                m = true
            } else {
                m = false
            }
            return m
        },
        checkAddress(str) {
            // var re = /^[\u4E00-\u9FA5]{3,100}$/
            var m = true
            if (str !== '' && str !== null && str !== undefined && str.length > 1) {
                m = true
            } else {
                m = false
            }
            return m
        },
        checkMobile(str) {
            // /^1\d{10}$/
            var re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/
            var m = true
            if (re.test(str)) {
                m = true
            } else {
                m = false
            }
            return m
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
        },
        runto() {
            if (this.checkName(this.name) && this.checkAddress(this.address) && this.checkMobile(this.mobile) && this.checkspack(this.sfid) && this.checkspack(this.sqid) && this.checkspack(this.qyid)) {
                this.check.btn = true
                var qs = require('qs')
                axios.post(this.$store.state.uri + 'game/wheel/chips/' + localStorage.getItem('chip_id') + '/exchange?access_token=' + localStorage.getItem('access_token'), qs.stringify({
                    'access_token': localStorage.getItem('access_token'), // 访问凭证
                    'chip_id': localStorage.getItem('chip_id'), // 碎片id
                    'city_id':  this.sqid, // 城市编号
                    'consignee': this.name, // 收货人
                    'district_id': this.qyid, // 区编号
                    'mobile': this.mobile, // 手机号码
                    'province_id': this.sfid, // 省编号
                    'street': this.address // 街道地址
                }))
                .then((res) => {
                    // console.log(res.data.err_code)
                    console.log(res.data.err_msg)
                    // localStorage.removeItem('username')
                    this.$store.dispatch('get_username', this.name)
                    this.$store.dispatch('get_userphone', this.mobile)
                    this.$store.dispatch('get_useraddress', this.sfname + this.sqname + this.qyname + this.address)
                    this.$store.dispatch('get_ifor', true)
                    localStorage.setItem('username', this.name)
                    localStorage.setItem('userphone', this.mobile)
                    localStorage.setItem('useraddress', this.sfname + this.sqname + this.qyname + this.address)
//                  window.location.href = '/user/puzzle'
					Toast({
					  message: '兑换成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 800
					})
                    this.$router.go(-1)
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
                alert('请正确填写相关信息')
                this.check.btn = false
                return
            }
        }
    },
    computed: {
    },
    watch: {
        name(val) {
            if (this.checkName(val)) {
                this.check.nameCheck = true
            }
        },
        mobile(val) {
            if (this.checkMobile(val)) {
                this.check.mobileCheck = true
            }
        },
        sf(val) {
            if (val !== '') {
                this.check.sfCheck = true
            }
        },
        sq(val) {
            if (val !== '') {
                this.check.sqCheck = true
            }
        },
        qy(val) {
            if (val !== '') {
                this.check.qyCheck = true
            }
        },
        address(val) {
            if (this.checkAddress(val)) {
                this.check.addressCheck = true
            }
        },
        check: {
            handler: (val, oldVal) => {
                if (val.nameCheck && val.mobileCheck && val.sfCheck && val.sqCheck && val.qyCheck && val.addressCheck) {
                    val.btn = true
                }
            },
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    touch-action: none;
}

.info-warp {
    width: 100%;
    height: 100vh;
    background-color: #F5F5F9;
    font-size: .3rem;
    overflow: hidden;
}

.info-form {
    margin-top: .4rem;
    p {
        margin: 0;
        background-color: #fff;
        margin-bottom: 2px;
        height: .88rem;
        line-height: .88rem;
        padding: 0rem .34rem;
        color: #222;
        label {
            width: 28%;
            display: inline-block
        }
        input,
        .warp {
            width: 70%; // margin-left: 4%;
            color: #222;
            font-size: .3rem;
            outline: none;
            border: none;
            display: inline-block
        }
    }
}

.info-form-btn {
    width: 6.9rem;
    height: .8rem;
    border-radius: .08rem;
    background-color: #39B382;
    text-align: center;
    line-height: .8rem;
    color: #fff;
    margin: .98rem auto 0rem
}

.info-form-btn:hover {
    background-color: green
}

.dis {
    background-color: #ccc
}

.dis:hover {
    background-color: #ccc
}

@media screen and ( min-width: 420px) {
    .info-form {
        p {
            label {
                width: 36%;
            }
            input,
            .warp {
                width: 60%;
            }
        }
    }
}

@media screen and ( min-width: 639px) {
    .info-form {
        p {
            label {
                width: 22%;
            }
            input,
            .warp {
                width: 72%;
            }
        }
    }
}

.warp {
    width: 100%;
    height: 100%;
    font-size: .3rem;
    display: flex;
    align-items: space-around;
    justify-content: space-around;
    align-content: space-between;
    background-color: #fff
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