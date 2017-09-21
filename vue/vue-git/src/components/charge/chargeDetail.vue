<template>
	<section>
		<div class="back" @click="back"></div>
		<section class="product-banner">
			<mt-swipe :auto="0">
				<mt-swipe-item v-for="(item, index) in product_imgs" :key="index">
					<img class="fullEle" :src="item" />
				</mt-swipe-item>
			</mt-swipe>
		</section>
		<section class="product-desc">
			<p class="product-name">{{detail_data.name}}</p>
			<p class="pop-product-price">
				<span class="amount">{{detail_data.point}} 积分<span style="color: #999; margin-left: 0.3rem;">参考价： &yen;{{Number(detail_data.price).toFixed(2)}}</span></span>

				<span style="color: #333;">库存：{{detail_data.stock}}</span>
			</p>
		</section>
		<section class="product-detail-content">
			<p class="product-detail-tit">产品详情</p>
			<div class="product-desc-content content-html" v-html="detail_data.description"></div>
		</section>
		<div class="operate-content">
			<span class="share-wx" @click="show = true">微信分享</span>
			<span class="join-btn btn-hover" @click="aouthConfirm">我要兑换</span>
		</div>
		<share-tip v-show="show" @shareCancel="show = false"></share-tip>
		<mt-popup v-model="showCharge" class="charge-detail" position="bottom">
			<div class="charge-info">
				<img :src="product_imgs[0]" />
				<p class="price">{{Number(detail_data.point)}}积分
					<span style="display: block; color: #333; padding-top: 0.2rem;">库存：{{detail_data.stock}}</span>
				</p>
				<span class="close" @click="showCharge = false"></span>
			</div>
			<div class="charge-num">
				<span>数量</span>
				<div class="num-btn">
					<span @click="minusCharge">-</span>
					<span>{{chargeNum}}</span>
					<span @click="plusCharge">+</span>
				</div>
			</div>
			<div class="charge-confirm-btn btn-hover" @click="confirmCharge">确定兑换</div>
		</mt-popup>
		<confirm-modal :show="showConfirm" @cancel_modal="cancel_modal" @confirm_modal="confirm_modal" @closeModal="showConfirm = false" has_icon="integral" :message="messageText">
		</confirm-modal>
	</section>
</template>

<script>
	import shareTip from '../parts/shareTip'
	import {
		Popup
	} from 'mint-ui';
	import {
		MessageBox
	} from 'mint-ui'
	import axios from 'axios'
	import api from '@/fetch/api'
	import wx from 'weixin-js-sdk'
	import confirmModal from '../parts/confirmModal'
	import {
		SecondAutho,
		storageGet,
		loadJssdk
	} from '../../../static/js/app.js'
	import {
		Toast
	} from 'mint-ui'
	export default {
		components: {
			shareTip,
			confirmModal
		},
		data() {
			return {
				showConfirm: false,
				messageText: '',
				show: false,
				showCharge: false,
				detail_data: {},
				product_id: undefined,
				chargeNum: 1,
				product_imgs: [],

				access_token: ''
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.product_id = window.location.hash.split('/')[2]
			api.productDetail({
				params: {
					id: this.product_id
				}
			}).then((res) => {
				this.detail_data = res.data.result
				this.product_imgs = res.data.result.imgs
				var lineLink = window.location.href
				var imgUrl = this.product_imgs[0]
				var shareTitle = this.detail_data.name
				var descContent = '松泽商城' + this.detail_data.name + '商品'
				this.wxShare(lineLink, imgUrl, shareTitle, descContent)
			}).catch((err) => {
				console.log(err)
			})
		},
		mounted() {

		},
		methods: {
			wxShare(lineLink, imgUrl, shareTitle, descContent) {
				api.wechatSign({
					params: {
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
					wx.ready(function() {
						loadJssdk(lineLink, imgUrl, shareTitle, descContent)
					})
				}).catch((err) => {
					console.log(err)
				})
			},
			back() {
				if(window.history.length > 1) {
					this.$router.go(-1)
				} else {
					this.$router.push('/chargeList')
				}
			},
			minusCharge() {
				this.chargeNum > 1 ? this.chargeNum-- : this.chargeNum = 1
			},
			plusCharge() {
				this.chargeNum < this.detail_data.stock ? this.chargeNum++ : this.chargeNum = this.detail_data.stock
			},
			confirmCharge() {
				this.messageText = '确定支付' + Math.floor(this.chargeNum * this.detail_data.point) + '积分兑换商品 ?'
				this.showConfirm = true

			},
			cancel_modal() {
				this.showCharge = false
			},
			confirm_modal() {
				this.showCharge = false
				this.showConfirm = false
				this.$router.push('/addressInput/' + this.product_id + '/' + this.chargeNum)
			},
			aouthConfirm() {
				if(!SecondAutho()) {
					return
				}
				if(this.detail_data.stock < 1) {
					Toast({
						message: '库存不足',
						position: 'bottom',
						duration: 1500
					});
					return
				}
				this.showCharge = true
			}

		},
		beforeRouteLeave(to, from, next) {
			if(this.show || this.showConfirm || this.showCharge) {
				this.show = false
				this.showConfirm = false
				this.showCharge = false
				next(false)
				return
			}
			next()
		}
	}
</script>

<style scoped>
	.back {
		width: 0.6rem;
		height: 0.6rem;
		background: rgba(0, 0, 0, 0.4) url(../../../static/image/white-arror.png) no-repeat center;
		background-size: 30%;
		border-radius: 50%;
		position: fixed;
		left: 0.2rem;
		top: 0.2rem;
		z-index: 20;
	}
	
	.product-banner {
		height: 4rem;
	}
	
	.product-desc {
		padding: 0.3rem;
		border-bottom: 0.2rem solid #F5F5F9;
	}
	
	.product-name {
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.pop-product-price {
		display: flex;
		justify-content: space-between;
		color: #bbb;
		padding-top: 0.4rem;
	}
	
	.pop-product-price .amount {
		color: #f26200;
		font-size: 0.32rem;
	}
	
	.product-detail-tit {
		padding: 0.3rem;
	}
	
	.operate-content {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		height: 1rem;
		display: flex;
		border-top: 1px solid #F5F5F9;
	}
	
	.share-wx {
		position: relative;
		width: 1.8rem;
		text-align: center;
		line-height: 1.44rem;
		font-size: 0.24rem;
	}
	
	.share-wx:after {
		content: '';
		position: absolute;
		width: 0.46rem;
		height: 0.46rem;
		background: url(../../../static/image/wx-icon.png) no-repeat center;
		background-size: 100%;
		left: 50%;
		margin-left: -0.3rem;
		top: 0.1rem;
	}
	
	.join-btn {
		flex: 1;
		background: #39b382;
		color: #fff;
		line-height: 1rem;
		text-align: center;
		font-size: 0.32rem;
	}
	
	.charge-detail {
		width: 100%;
	}
	
	.charge-info {
		padding: 0.3rem;
		display: flex;
		position: relative;
	}
	
	.charge-info .close {
		position: absolute;
		width: 0.6rem;
		height: 0.6rem;
		right: 0.2rem;
		top: 0.2rem;
		background: url(../../../static/image/close-icon.png) no-repeat center;
		background-size: 60%;
	}
	
	.charge-info img {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 0.4rem;
	}
	
	.charge-info .price {
		flex: 1;
		padding-left: 0.3rem;
		padding-top: 0.15rem;
		color: #f26200;
		font-size: 0.32rem;
	}
	
	.charge-num {
		display: flex;
		padding: 0.2rem 0.3rem 0.4rem;
		justify-content: space-between;
		align-items: center;
	}
	
	.charge-num .num-btn {
		display: flex;
	}
	
	.charge-num .num-btn span {
		width: 0.6rem;
		height: 0.6rem;
		background: #efefef;
		margin: 0 0.05rem;
		border-radius: 0.06rem;
		text-align: center;
		line-height: 0.6rem;
	}
	
	.charge-confirm-btn {
		height: 1rem;
		width: 100%;
		line-height: 1rem;
		text-align: center;
		background: #39b382;
		color: #fff;
		font-size: 0.32rem;
	}
	
	.product-desc-content {
		padding: 0.1rem 0.3rem;
	}
</style>