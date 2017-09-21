<template>
	<section class="fullDiv">
		<top title="商品订单"></top>
		<div class="orders-content">
			<scroller :on-infinite="infinite" ref="scroller">
				<section class="order-list">
		        	<div class="order-item" v-for="(item, index) in orderList" :key="index">
		        		<router-link :to="'/orderDetail/'+ item.orderSn">
		        			<p class="order-status">
			        			<span>订单号：{{item.orderSn}}</span>
			        			<span class="status" v-if="item.flag == 1">待发货</span>
			        			<span class="status" v-if="item.flag == 2">待确认收货</span>
			        			<span class="status" v-if="item.flag == 3">已完成</span>
			        		</p>
			        		<div class="order-info">
			        			<img :src="item.img"  />
			        			<div class="order-info-text">
			        				<p class="order-product-name">{{item.name}}</p>
			        				<p class="order-product-price">
			        					<span>{{item.price}} 积分</span>
			        					<span>x{{item.num}}</span>
			        				</p>
			        			</div>
			        		</div>
		        		</router-link>
		        		
		        		<div class="order-operate" v-if="item.flag == 2">
		        			<span @click="confirmOrder(item)">确认收货</span>
		        		</div>
		        	</div>
		        </section>
	        </scroller>
		</div>
		
	</section>

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
				orderList:[],
				
				page: 1,
				page_size: 12,
				savePage: 1,
				
				scrollTop: 0
			}
		},
		created() {
//			this.initData()
		},
		deactivated(){
	    	this.savePage=this.page
	    	this.page=100000
	    },
		activated() {
			this.page=this.savePage
	    	this.$refs.scroller.resize()
	    	this.$refs.scroller.scrollTo(0,this.scrollTop,false)
	    },
	    beforeRouteEnter (to, from, next) {
	    	if(/orderDetail/g.test(from.fullPath)) {
	    		next()
	    	}else {
	    		next(vm=>{
	    			vm.initData()
	    			vm.$refs.scroller.scrollTo(0,0,false)
	        	})
	    	}
		},
		beforeRouteLeave(to, from, next) {
			this.scrollTop = this.$refs.scroller.getPosition().top
			next()
		},
		methods: {
			initData() {
				this.access_token = storageGet('access_token')
				this.$store.commit('setLoadingStatus', true)
				this.page = 1
				api.orderList({
		        	params:{
					    access_token: this.access_token,
					    page: this.page,
					    page_size: this.page_size
					}
			    }).then(res => {   
			    	this.$store.commit('setLoadingStatus', false)
		            this.orderList = res.data.result.data
		            this.page++
		            this.$nextTick(() => {
	                	this.$refs.scroller.resize()
	                	this.$refs.scroller.finishInfinite();
					})
		        }, err => {
					this.$store.commit('setLoadingStatus', false)
		        })
			},
			infinite(){
		   		setTimeout(() => {
		   			api.orderList({
			        	params:{
						    access_token: this.access_token,
						    page: this.page,
						    page_size: this.page_size
						}
				    }).then(res => {   
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller.finishInfinite(true)
							})	
							return
				        }
		            	this.orderList = this.orderList.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })  
		        }, 400)
		 	},
		 	confirmOrder(item) {
		 		this.$store.commit('setLoadingStatus', true)
				api.confirmOrderReceipt(this.access_token, qs.stringify({
					orderSn: item.orderSn
	    		})).then(res => {   
	    			this.$store.commit('setLoadingStatus', false)
					item.flag = 3
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
	.orders-content{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
	}
	.order-list{
		padding-top: 0.4rem;
	}
	.order-item{
		background: #fff;
		margin-bottom: 0.4rem;
	}
	.order-status{
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.2rem 0.3rem;
		display: flex;
		justify-content: space-between;
	}
	.order-status .status{
		color: #f26200;
	}
	.order-info{
		padding: 0.3rem;
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
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
	.order-operate{
		padding: 0.15rem 0.3rem;
		display: flex;
		justify-content: flex-end;
	}
	.order-operate span{
		display: block;
		padding: 0.15rem 0.25rem;
		color: #39B382;
		border: 1px solid #39B382;
		border-radius: 0.08rem;
	}
</style>