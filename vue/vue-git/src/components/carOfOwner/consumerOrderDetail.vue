<template>
	<section class="fullDiv">
		<top title="消费详情"></top>
		<section class="consumer-orders-content">
			<div class="order-detail-top">
				<p class="amount">&yen;{{Number(orderDetail.amount).toFixed(2)}}</p>
				<p class="tit">付款金额</p>
			</div>
			<div class="order-detail-mid">
				<div class="order-price-item" v-if="orderDetail.pointPrice>0">
					<span>积分抵扣</span>
					<span>{{orderDetail.point}} 积分</span>
					<span>-&yen;{{Number(orderDetail.pointPrice).toFixed(2)}}</span>
				</div>
				<div class="order-price-item" v-if="orderDetail.couponPrice>0">
					<span>优惠券</span>
					<!--<span>300积分</span>-->
					<span>-&yen;{{Number(orderDetail.couponPrice).toFixed(2)}}</span>
				</div>
				<div class="order-price-item">
					<span>消费金额</span>
					<span class="total">&yen;{{Number(orderDetail.originalAmount).toFixed(2)}}</span>
				</div>
			</div>
			<div class="order-detail-bottom">
				<div class="order-info-item">
					<span>商家信息</span>
					<span>{{orderDetail.name}}</span>
				</div>
				<div class="order-info-item">
					<span>消费时间</span>
					<span>{{orderDetail.createTime}}</span>
				</div>
				<div class="order-info-item">
					<span>赠送积分</span>
					<span><i>{{orderDetail.getPoint}}</i> 积分</span>
				</div>
				<p class="comment-operate" v-if="orderDetail.status == 0"><span @click="goComment">立即评价</span></p>
			</div>
		</section>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	export default {
		components: {
			top
		},
		data() {
			return {
				orderDetail: {}
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.orderId = window.location.hash.split('/')[2]
			this.$store.commit('setLoadingStatus', true)
			api.consumerOrderDetail({
	        	params:{
				    access_token: this.access_token,
				    id: this.orderId
				}
		    }).then(res => {   
		    	this.$store.commit('setLoadingStatus', false)
	            this.orderDetail = res.data.result
	        }, err => {
				this.$store.commit('setLoadingStatus', false)
	        })
		},
		mounted() {

		},
		methods: {
			goComment() {
		 		this.$router.push('/orderComment/' + this.orderDetail.id)
		 	}
		}
	}
</script>

<style scoped>
	.consumer-orders-content{
		padding-top: 0.9rem;
	}
	.order-detail-top{
		padding: 0.8rem 0;
		background: #fff;
		text-align: center;
	}
	.order-detail-top .amount{
		font-size: 0.58rem;
		letter-spacing: 1px;
		padding-bottom: 0.2rem;
	}
	.order-detail-top .tit{
		color: #666;
	}
	.order-detail-mid{
		background: #fff;
		margin-bottom: 0.2rem;
		margin-top: 0.2rem;
	}
	.order-price-item{
		height: 1rem;
		line-height: 1rem;
		display: flex;
		padding: 0 0.3rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	.order-price-item>span{
		flex: 1;
	}
	.order-price-item>span:nth-of-type(2){
		text-align: center;
	}
	.order-price-item>span:last-child{
		text-align: right;
	}
	.order-price-item>span.total{
		color: #39B382;
		font-size: 0.4rem;
		letter-spacing: 1px;
	}
	.order-detail-bottom{
		background: #fff;
		padding: 0.2rem 0.3rem;
	}
	.order-info-item{
		height: 0.6rem;
		line-height: 0.6rem;
		display: flex;
		justify-content: space-between;
	}
	.order-info-item span{
		color: #666;
	}
	.order-info-item span i{
		font-style: normal;
		color: #39B382;
	}
	.comment-operate{
		padding-top: 0.2rem;
		text-align: right;
	}
	.comment-operate span{
		display: inline-block;
		padding: 0.15rem 0.25rem;
	    color: #39B382;
	    border: 1px solid #39B382;
	    border-radius: 0.08rem;
	}
</style>