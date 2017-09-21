<template>
	<section class="fullDiv">
		<div class="back" @click="back"></div>
		<section class="product-banner">
			<mt-swipe :auto="0">
				<mt-swipe-item v-for="(item, index) in shopDetail.imgs" :key="index">
					<img :src="item" class="fullEle" />
				</mt-swipe-item>

			</mt-swipe>
		</section>
		<div class="repair-shop-info">
			<p class="name">{{shopDetail.name}}</p>
			<p class="level">
				<span class="active" v-for="n in star"></span>
				<span v-for="i in 5-star"></span>
			</p>
			<p class="profit-num" v-if="shopDetail.couponNum>0">优惠券：{{shopDetail.couponNum}}</p>
			<p class="distance">营业时间：{{shopDetail.business}}</p>
		</div>
		<div class="repair-shop-connect">
			<router-link :to="'/baiduMap/'+ shopDetail.latitude +'/' + shopDetail.longitude" class="repair-shop-link has-right-arror addr">
				{{shopDetail.street}}
			</router-link>
			<div class="repair-shop-link has-right-arror tel">
				<a :href="'tel:'+shopDetail.phone">{{shopDetail.phone}}</a>
			</div>
			<router-link :to="'/repairShopComment/'+ shopDetail.id" class="repair-shop-link has-right-arror addr">
				店铺评价({{shopDetail.commentNum}})
			</router-link>
		</div>
		<div class="coupon-content" v-if="couponList.length>0">
			<p class="coupon-tit">优惠券</p>
			<div v-for="(item, index) in couponList" :key="index">
				<div class="coupon-item" v-if="item.flag == 0" @click="getCoupon(item)">
					<div class="profit-amount">
						<div class="num">{{item.price}}<span>元</span></div>
					</div>
					<div class="profit-info">
						<p class="profit-shop">{{shopDetail.name}}</p>
						<div class="profit-info-item">
							满减
						</div>
						<div class="profit-info-item">
							{{item.startTime}}~{{item.endTime}}
						</div>

					</div>
					<div class="coupon-status active">
						领优惠
					</div>
				</div>
				<div class="coupon-item" v-if="item.flag == 1">
					<div class="profit-amount">
						<div class="num">{{item.price}}<span>元</span></div>
					</div>
					<div class="profit-info">
						<p class="profit-shop">{{shopDetail.name}}</p>
						<div class="profit-info-item">
							满减
						</div>
						<div class="profit-info-item">
							{{item.startTime}}~{{item.endTime}}
						</div>

					</div>
					<div class="coupon-status ">
						已领取
					</div>
				</div>
			</div>

		</div>

	</section>
</template>

<script>
	import axios from 'axios'
	import {
		SecondAutho,
		storageGet
	} from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import qs from 'qs'
	import {
		Toast
	} from 'mint-ui'
	export default {
		data() {
				return {
					access_token: '',
					shopDetail: {},
					couponList: [],
					star: 0
				}
			},
			mounted() {

			},
			created() {
				this.$store.commit('setLoadingStatus', true)
				this.access_token = storageGet('access_token')
				this.shopId = window.location.hash.split('/')[2]
				api.repairShopDetail({
					params: {
						access_token: this.access_token,
						id: this.shopId
					}
				}).then(res => {
					this.$store.commit('setLoadingStatus', false)
					this.shopDetail = res.data.result.agent
					this.star = res.data.result.agent.star
					this.couponList = res.data.result.Coupon
				}, err => {
					this.$store.commit('setLoadingStatus', false)
				})
			},
			methods: {
				back() {
					this.$router.go(-1)
				},
				getCoupon(item) {
					this.$store.commit('setLoadingStatus', true)
					if(!SecondAutho()) {
						return
					}
					api.getCoupon(this.access_token, qs.stringify({
							id: item.id
						})).then((res) => {
							this.$store.commit('setLoadingStatus', false)
							Toast({
								message: '领取成功',
								position: 'middle',
								iconClass: 'toast-icon icon-success',
								duration: 800
							})
							item.flag = 1

						})
						.catch((error) => {
							this.$store.commit('setLoadingStatus', false)
							console.log(error)
						})
				}
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
		height: 5rem;
		background: #fff;
	}
	
	.repair-shop-info {
		padding: 0.3rem;
		background: #fff;
		margin-bottom: 0.4rem;
	}
	
	.repair-shop-info p {
		padding: 0.08rem 0;
	}
	
	.repair-shop-info p.name {
		font-size: 0.3rem;
	}
	
	.repair-shop-info p.level {
		display: flex;
	}
	
	.repair-shop-info p.level span {
		width: 0.32rem;
		height: 0.32rem;
		margin-right: 0.06rem;
		background: url(../../../static/image/no-levle.png) no-repeat center;
		background-size: 100%;
	}
	
	.repair-shop-info p.level span.active {
		background-image: url(../../../static/image/has-levle.png);
	}
	
	.profit-num {
		color: #f39800;
	}
	
	.distance {
		color: #999;
	}
	
	.repair-shop-connect {
		background: #fff;
	}
	
	.repair-shop-link {
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		display: flex;
		height: 0.9rem;
		line-height: 0.9rem;
		padding-left: 0.8rem;
		padding-right: 0.3rem;
		position: relative;
	}
	
	.repair-shop-link:before {
		position: absolute;
		content: '';
		width: 0.34rem;
		height: 0.5rem;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		left: 0.3rem;
		top: 50%;
		margin-top: -0.25rem;
	}
	
	.repair-shop-link.addr:before {
		background-image: url(../../../static/image/address.png);
	}
	
	.repair-shop-link.tel:before {
		background-image: url(../../../static/image/tel-1.png);
	}
	
	.repair-shop-link a {
		color: #000;
		width: 100%;
	}
	
	.coupon-content {
		padding: 0 0.3rem;
	}
	
	.coupon-tit {
		font-size: 0.32rem;
		padding: 0.5rem 0;
		text-align: center;
	}
	
	.coupon-item {
		display: flex;
		border-radius: 0.1rem;
		overflow: hidden;
		background: #fff;
		width: 6.9rem;
		margin-bottom: 0.3rem;
	}
	
	.profit-amount {
		width: 1.8rem;
		text-align: center;
		border-right: 1px dashed #ddd;
		padding: 0.2rem 0;
		position: relative;
	}
	
	.profit-amount:before {
		content: '';
		position: absolute;
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: #F5F5F9;
		top: -0.15rem;
		right: -0.15rem;
	}
	
	.profit-amount:after {
		content: '';
		position: absolute;
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		background: #F5F5F9;
		bottom: -0.15rem;
		right: -0.15rem;
	}
	
	.profit-amount .num {
		font-size: 0.5rem;
		color: #f39800;
		line-height: 1.6rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.profit-amount .num span {
		margin-left: 0.06rem;
		position: relative;
		top: -0.06rem;
	}
	
	.profit-info {
		width: 4.1rem;
		padding: 0.2rem 0.1rem;
	}
	
	.profit-shop {
		font-size: 0.32rem;
		padding-top: 0.1rem;
		padding-bottom: 0.2rem;
		padding-left: 0.08rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.profit-info-item {
		color: #999;
		padding: 0.1rem 0 0.1rem 0.2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		position: relative;
		font-size: 0.28rem;
	}
	
	.profit-info-item:before {
		content: '';
		position: absolute;
		width: 2px;
		height: 2px;
		background: #ddd;
		left: 0.08rem;
		top: 50%;
		margin-top: -1px;
	}
	
	.coupon-status {
		width: 1rem;
		font-size: 0.32rem;
		color: #fff;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url(../../../static/image/bg-3.png);
		display: flex;
		align-items: center;
		padding: 0 0.3rem;
		text-align: center;
	}
	
	.coupon-status.active {
		background-image: url(../../../static/image/bg-4.png);
	}
</style>