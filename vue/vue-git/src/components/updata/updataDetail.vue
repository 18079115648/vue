<template>
	<section>
		<top title="案例详情"></top>
		<div class="share" @click="show = true"></div>
		
		<section class="repair-case-detail">
			<div class="repair-case-text">
				<p class="case-name">{{repairCaseDetail.title}}</p>
				<div class="case-num-total">
					<img :src="repairCaseDetail.avatar"  />
					<div class="case-total-right">
						<p>
							<span class="nick-name">{{repairCaseDetail.userName}}</span>
							<span class="price" v-if="repairCaseDetail.price == 0">免费</span>
							<span class="price"v-if="repairCaseDetail.price > 0">{{repairCaseDetail.price}}</span>
						</p>
						<p class="small"><span>{{repairCaseDetail.createTime}}</span><span>{{repairCaseDetail.readNum}} 阅读</span></p>
					</div>
				</div>
			</div>
			<div class="video-group" v-if="repairCaseDetail.type == 3">
				<video 
			      	:poster="repairCaseDetail.imgs[0]"
			      	class="video fullAuto" 
			      	:src="repairCaseDetail.video" 
			      	controls="controls" 
			      	webkit-playsinline="true" 
			      	x-webkit-airplay="true"  
			      	playsinline="true" >
			    </video>
		    </div>
		    <div class="video-group" v-if="repairCaseDetail.type == 2">
		      <img v-for="(item, index) in repairCaseDetail.imgs" :key="index" :src="item"   />
		    </div>
		    <div class="pop-product-text" v-text="repairCaseDetail.description" style="margin-bottom: 0.3rem;"></div>
		    
        </section>
        <div class="join-confirm-btn">上传成功，等待审核</div>
        <share-tip v-show="show" @shareCancel="show = false"></share-tip>
        <confirm-modal 
			:show="buyShow" 
			@cancel_modal="cancel_modal" 
			@confirm_modal="confirm_modal" 
			@closeModal="buyShow = false" 
			cancel_text="取消"
			confirm_text="购买案例"
			has_icon="integral"
			:message="'未购买该案例(<span>'+ this.repairCaseDetail.price +'</span>积分)!'">
		</confirm-modal>
		<confirm-modal 
			:show="err_show" 
			@cancel_modal="err_cancel_modal" 
			@confirm_modal="err_confirm_modal" 
			@closeModal="err_show = false" 
			confirm_text="充值换积分"
			has_icon="warn"
			message="积分余额不足 !">
		</confirm-modal>
	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import shareTip from '../parts/shareTip'
	import {Autho, storageGet,loadJssdk } from '../../../static/js/app.js'
	import { Toast } from 'mint-ui'
	import api from '@/fetch/api'
	import wx from 'weixin-js-sdk'
	import confirmModal from '../parts/confirmModal'
	import qs from 'qs'
	export default {
		
		components: {
			top,
			shareTip,
			confirmModal
		},
		data() {
			return {
				show: false,
				buyShow: false,
				err_show: false,
				repairCaseDetail:{},
				access_token:'',
				case_id: undefined
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.case_id = window.location.hash.split('/')[2]
			this.initData()
		},
		beforeCreate() {
	        Autho(this)
	    },
		mounted() {
			
		},
		methods: {
			initData() {
				api.repairDetail({
		        	params:{
					    id: this.case_id,
					    access_token: this.access_token
					}
			    }).then((res) => {
	              	this.repairCaseDetail = res.data.result
	              	this.commentList = res.data.result.commentList
	              	var lineLink = window.location.href
				    var imgUrl = res.data.result.imgs[0]
					var shareTitle = res.data.result.title
					var descContent = '松泽商城' + res.data.result.title + '案例'
					this.wxShare(lineLink, imgUrl, shareTitle, descContent)
	              	if(res.data.result.flag == 2) {
	              		this.buyShow =true
	              	}
	            }).catch((err) => {
	                console.log(err)
	            })
			},
			wxShare(lineLink, imgUrl, shareTitle, descContent) {
				api.wechatSign({
		        	params:{
					    url: window.location.href.split('#')[0]
					}
			    }).then((res) => {
					wx.config({
		                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                appId: res.data.result.appId, // 必填，公众号的唯一标识
		                timestamp: parseInt(res.data.result.timestamp), // 必填，生成签名的时间戳
		                nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
		                signature: res.data.result.signature, // 必填，签名，见附录1
		                jsApiList: ['uploadImage', 'getLocation', 'chooseImage', 'previewImage', 'uploadImage', 'scanQRCode', 'chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		            })
					wx.ready(function () {
						loadJssdk(lineLink, imgUrl, shareTitle, descContent)
					})
					
		        }).catch((err) => {
		            console.log(err)
		        })
			},
			cancel_modal() {
		  		console.log('取消')
		  	},
		  	confirm_modal() {
				this.buyRepairCase()
		  	},
		  	buyRepairCase() {
	            api.repairBuy(this.access_token, qs.stringify({
					id: this.case_id,
					access_token: this.access_token
	    		})).then((res) => {
	                if(res.data.err_code == 0) {
	                	Toast({
							message: '购买成功',
							position: 'middle',
							iconClass: 'toast-icon icon-success',
							duration: 800
						})
						var timer = setTimeout(() => {
							clearTimeout(timer)
							this.initData()
						}, 500)
	    			}else if(res.data.err_code == 40014) {
	    				this.err_show = true
	    			}
	            }).catch((err) => {
	                console.log(err)
	            })
		    },
		    err_cancel_modal() {
		  		console.log('取消')
		  	},
		  	err_confirm_modal() {
		  		this.$router.push('/recharge')
		  	},
		},
		beforeRouteLeave(to, from, next) {
			if(this.show || this.buyShow || this.err_show) {
				next(false)
				this.show = false
				this.buyShow = false
				this.err_show = false
				return
			}
			next()
		}
	}
</script>

<style scoped>
    .share{
    	position: fixed;
    	width: 0.9rem;
    	height: 0.9rem;
    	background: url(../../../static/image/share-icon.png) no-repeat center;
    	background-size: 45%;
    	right: 0;
    	top: 0;
    	z-index: 60;
    }
    .join-confirm-btn{
    	width: 6.9rem;
		margin: 1.2rem auto 0.5rem;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
    }
	.repair-case-detail{
		padding: 0.4rem 0.3rem;
		padding-top: 1.3rem;
		background: #fff;
	}
	.case-name{
		font-size: 0.30rem;
		font-weight: 600;
	}
	.case-num-total{
		padding: 0.4rem 0;
		display: flex;
	}
	.case-num-total img{
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
	}
	.case-total-right{
		flex: 1;
		padding-left: 0.3rem;
	}
	.case-total-right p{
		display: flex;
		padding: 0.06rem 0;
		justify-content: space-between;
		color: #bbb;
	}
	.case-total-right p .price{
		color: #39B382;
		position: relative;
		padding-left: 0.4rem;
	}
	.case-total-right p .price:before{
		content: '';
		position: absolute;
		width: 0.32rem;
		height: 0.32rem;
		background: url(../../../static/image/money-icon.png) no-repeat center;
		background-size: 100%;
		left: 0;
		top: 50%;
		margin-top: -0.16rem;
	}
	.case-total-right p.small span{
		/*font-size: 0.24rem;*/
	}
	.case-total-right p .nick-name{
		color: #333;
	}
	.video-group{
		margin-bottom: 0.4rem;
	}
	.video-group img{
		display: block;
		border: 1px solid #eee;
		/*max-width: 100%;
		max-height: 4rem;
		margin: 0 auto;*/
		width: 100%;
		margin-bottom: 0.2rem;
	}
	.pop-product-text{
		color: #555;
		line-height: 1.5;
	}
	.video{
		max-height: 100%;
		margin: 0 auto;
		display: block;
		width: 100%;
		max-height: 4rem;
	}
</style>