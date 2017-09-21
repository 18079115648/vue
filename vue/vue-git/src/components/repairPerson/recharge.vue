<template>
	<section class="join-content">
		<top title="积分充值"></top>
		<section class="repair-user-content">
			<div class="repair-center-top">
				<div class="module-tit">
					充值账号
				</div>
				<div class="user-info">
					<img :src="headImg"  />
					<div class="user-message">
						<p >{{nickName}}</p>
						<p class="mess">{{mobile_phone}}</p>
					</div>
				</div>
				
				
			</div>
			<div class="repair-center-mid">
				<div class="module-tit">
					充值积分数量
				</div>
				<div class="recharge-num-select">
					<div class="recharge-num-item" :class="index == defaultSelect ? 'active' : ''" @click="selectAmount(item, index)" v-for="(item, index) in rechargeSelect" :key="index">{{item.point}}积分</div>
					<!--<div class="recharge-num-item" :class="6 == defaultSelect ? 'active' : ''" @click="selectOtherAmount">
						<input class="other-amount" maxlength="3" autocomplete="off" @input="editRechargeNum" type="tel" v-model="otherRechargeNum" placeholder="其他金额"  />
					</div>-->
				</div>
				<div class="pay-money">应付：&yen;{{Number(rechargeNum).toFixed(2)}}</div>
			</div>
			
			<div class="join-confirm-btn btn-hover" @click="wxPay" v-show="!disabledBtn">微信支付</div>
			<div class="join-confirm-btn btn-hover disabled" v-show="disabledBtn">微信支付</div>
			
		</section>
		
	</section>

</template>

<script>
	import top from '../parts/header'
	import {storageSet, storageGet, Autho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import qs from 'qs'
	export default {
		components: {
			top
		},
		data() {
			return {
//				otherRechargeNum: null,
				rechargeNum: undefined,
				defaultSelect: 0,
				rechargeId: undefined,
				rechargeSelect:[],
				
				headImg: '',
				nickName: '',
				mobile_phone: '',
				
				disabledBtn: false
			}
		},
		beforeCreate() {
	        Autho(this)
	    },
	    created() {
	    	this.access_token = storageGet('access_token')
	    	api.userCenter({
	        	params:{
				    access_token: this.access_token
				}
		    }).then((res) => {
                this.headImg = res.data.result.avatar
                this.nickName = res.data.result.nickname
                this.mobile_phone = res.data.result.mobile
            })
            .catch((error) => {
            })
            api.rechargeList({
	        	params:{
				    access_token: this.access_token
				}
		    }).then((res) => {
                this.rechargeSelect = res.data.result
                this.rechargeNum = res.data.result[0].money
                this.rechargeId = res.data.result[0].id
            })
            .catch((error) => {
            	
            })
	    },
		mounted() {

		},
		methods: {
			selectAmount(item, index) {
				this.rechargeNum = item.money
				this.defaultSelect = index
				this.rechargeId = item.id
//				this.otherRechargeNum = null
			},
			wxPay() {
				this.disabledBtn = true
				api.rechargeOrder(this.access_token, qs.stringify({
					'id': this.rechargeId,
					'access_token': this.access_token
	    	    })).then(res => {   
					this.wechatPay(res.data.result)
		        }, err => {
					this.disabledBtn = false
		        })
			},
			wechatPay(orderSn) {
				var self = this
				api.wechatPay(this.access_token, qs.stringify({
					orderSn: orderSn,
					openId: storageGet('openid')
	    	    })).then(res => {  
	    	    	this.disabledBtn = false
					WeixinJSBridge.invoke(
				        'getBrandWCPayRequest', {
				           "appId": res.data.result.appId,     //公众号名称，由商户传入     
				           "timeStamp": res.data.result.timeStamp,       //时间戳，自1970年以来的秒数     
				           "nonceStr": res.data.result.nonceStr,  //随机串     
				           "package": res.data.result.prepayId,      
				           "signType":res.data.result.signType,         //微信签名方式：     
				           "paySign": res.data.result.paySign //微信签名 
				        },
				        function(res){     
				           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				           		self.$router.go(-1)
				           }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
				        }
					)
		        }, err => {
					this.disabledBtn = false
		        })
			}
//			selectOtherAmount() {
//				this.defaultSelect = 6
//				this.rechargeNum = this.otherRechargeNum
//			},
//			editRechargeNum() {
//				if (!/^[1-9]\d*$/.test(this.otherRechargeNum)) {				
//	                this.otherRechargeNum = this.otherRechargeNum.replace(/^0|\D+/g,'')            
//	            }
//				this.rechargeNum = this.otherRechargeNum
//			}
		}
	}
</script>

<style scoped>
	.join-content{
		position: absolute;
		width: 100%;
		height: 100%;
		background: #F5F5F9;
		left: 0;
		top: 0;
		padding-top: 0.9rem;
	}
	.module-tit{
		padding: 0.2rem 0.3rem;
		font-size: 0.30rem;
	}
	.repair-center-top .user-info{
		background: #fff;
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.3rem;
	}
	.user-info img{
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		margin-right: 0.3rem;
	}
	.user-message{
		flex: 1;
	}
	.user-message p{
		line-height: 1.5;
	}
	.user-message p.mess{
		padding-top: 0.14rem;
	}
	.recharge-num-select{
		display: flex;
		flex-wrap: wrap;
		background: #fff;
		padding: 0.15rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	.recharge-num-item{
		height: 0.8rem;
		width: 2rem;
		margin: 0.2rem;
		text-align: center;
		color: #999;
		border: 1px solid #999;
		border-radius: 0.06rem;
		line-height: 0.8rem;
		position: relative;
		overflow: hidden;
		background: #fff;
	}
	.recharge-num-item:active{
		opacity: 0.7;
	}
	.recharge-num-item.active{
		border-color: #39b382;
		color: #39b382;
	}
	.join-confirm-btn{
		width: 6.9rem;
		margin: 1rem auto 0;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
	}
	.pay-money{
		background: #fff;
		padding: 0.3rem;
		font-size: 0.3rem;
	}
	.other-amount{
		position: absolute;
		left: 0;
		top: -1px;
		width: 2rem;
		line-height: 1;
		border: 0;
		outline: none;
		text-align: center;
		height: 0.8rem;
		vertical-align: middle;
		color: #39B382;
	}
	.join-confirm-btn.disabled{
		background: #e1e1e1;
		color: #bbb;
	}
</style>