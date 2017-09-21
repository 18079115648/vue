<template>
	<transition name="move">
		<section class="fullDiv move-right">
			<top title="订单详情"></top>
			<section class="order-detail">
	        	<div class="order-status">
	        		<span class="status" v-if="orderDetail.flag == 1">待发货</span>
	    			<span class="status" v-if="orderDetail.flag == 2">已发货</span>
	    			<span class="status" v-if="orderDetail.flag == 3">已确认收货</span>
	        	</div>
	        	<div class="order-addr-info">
	        		<div v-if="orderDetail.flag != 1" class="addr-info-item express">
	        			<p>{{orderDetail.expressName}}</p>
	        			<p>快递号：{{orderDetail.expressNo}}</p>
	        		</div>
	        		<div class="addr-info-item address">
	        			<p>
	        				<span style="margin-right: 0.2rem;">收货人：{{addressInfo.consignee}}</span>
	        				<span>{{addressInfo.mobile}}</span>
	        			</p>
	        			<p>{{addressInfo.provinceName}}{{addressInfo.cityName}}{{addressInfo.districtName}}{{addressInfo.street}}</p>
	        		</div>
	        	</div>
	        	<div class="order-info">
	    			<img :src="orderDetail.img"  />
	    			<div class="order-info-text">
	    				<p class="order-product-name">{{orderDetail.name}}</p>
	    				<p class="order-product-price">
	    					<span>{{orderDetail.price}} 积分</span>
	    					<span>x{{orderDetail.num}}</span>
	    				</p>
	    			</div>
	    		</div>
	    		<div class="order-time-process">
	    			<p>订单号：{{orderDetail.orderSn}}</p>
	    			<p>订单金额：{{orderDetail.totalprice}} 积分</p>
	    			<p>下单时间：{{orderDetail.createTime}}</p>
	    			<div class="order-operate" v-if="orderDetail.flag == 2">
	        			<span @click="confirmOrder(orderDetail.orderSn)">确认收货</span>
	        		</div>
	    		</div>
	        </section>
		</section>
	</transition>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			'top': top
		},
		data() {
			return {
				access_token: '',
				orderDetail: {},
				addressInfo:{}
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.orderSn = window.location.hash.split('/')[2]
			api.orderDetail({
	        	params:{
				    access_token: this.access_token,
				    orderSn: this.orderSn
				}
		    }).then(res => {   
	            this.orderDetail = res.data.result
	            this.addressInfo = res.data.result.productOrderAddress
	        }, err => {
	
	        })
		},
		mounted() {

		},
		methods: {
			confirmOrder(orderSn) {
				this.$store.commit('setLoadingStatus', true)
				api.confirmOrderReceipt(this.access_token, qs.stringify({
					orderSn: orderSn
	    		})).then(res => {   
	    			this.$store.commit('setLoadingStatus', false)
					this.orderDetail.flag = 3
					Toast({
					  message: '收货成功',
					  position: 'bottom',
					  duration: 1000
					});
		        }, err => {
					this.$store.commit('setLoadingStatus', false)
		        })
			}
		}
	}
</script>

<style scoped>
	.order-detail{
		padding-top: 0.9rem;
	}
	.order-status{
		height: 2rem;
		padding-left: 1rem;
		line-height: 2rem;
		color: #fff;
		background: #39b382;
		font-size: 0.32rem;
	}
	.order-status span{
		font-size: 0.32rem;
	}
	.order-addr-info{
		background: #fff;
		margin-bottom: 0.2rem;
	}
	.addr-info-item{
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.2rem 0.3rem 0.2rem 1rem;
		position: relative;
	}
	.addr-info-item:before{
		content: '';
		position: absolute;
		left: 0.3rem;
		top: 50%;
		width: 0.4rem;
		height: 0.6rem;
		margin-top: -0.3rem;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100%;
	}
	.addr-info-item.address:before{
		background-image: url(../../../static/image/address.png);
	}
	.addr-info-item.express:before{
		background-image: url(../../../static/image/express.png);
	}
	.addr-info-item p{
		padding: 0.15rem 0;
		display: flex;
		/*justify-content: space-between;*/
	}
	.order-info{
		background: #fff;
		padding: 0.3rem;
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		margin-bottom: 0.2rem;
	}
	.order-info img{
		display: block;
		width: 1.5rem;
	    height: 1.5rem;
	    margin-right: 0.3rem;
	}
	.order-info-text{
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.1rem 0;
	}
	.order-product-name{
		flex: 1;
		font-size: 0.3rem;
	}
	.order-product-price{
		color: #999;
		display: flex;
		justify-content: space-between;
	}
	.order-time-process{
		background: #fff;
		padding: 0.2rem 0.3rem;
	}
	.order-time-process p{
		padding: 0.15rem 0;
		color: #999;
	}
	.order-operate{
		padding: 0.15rem 0.3rem;
		display: flex;
		justify-content: flex-end;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 top;
		background-size: auto 1px;
		padding-bottom: 0;
		margin-top: 0.2rem;
	}
	.order-operate span{
		display: block;
		padding: 0.15rem 0.25rem;
		color: #39B382;
		border: 1px solid #39B382;
		border-radius: 0.08rem;
	}
</style>