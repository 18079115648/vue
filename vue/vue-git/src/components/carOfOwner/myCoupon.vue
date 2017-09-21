<template>
	<section class="fullDiv" style="padding-top: 0.9rem;">
		<top title="我的优惠券"></top>
		<mt-navbar class="case-page-part" v-model="selected">
	      <mt-tab-item id="1" @click.native.prevent="getCouponList('1')">未使用</mt-tab-item>
	      <mt-tab-item id="2" @click.native.prevent="getCouponList('2')">已使用</mt-tab-item>
	    </mt-navbar>
	    <mt-tab-container v-model="selected" class="spipe-tab-content">
	      <mt-tab-container-item id="1">
	      	<scroller :on-infinite="infinite1" ref="scroller1">
		        <div class="pop-product-list" v-if="useful_coupon_list.length>0">
	        		<div class="coupon-item" v-for="(item, index) in useful_coupon_list" :key="index" v-if="item.status == 0" @click="useCouponConfirm(item.id, index)">
						<div class="profit-amount">
							<div class="num active">{{item.price}}<span>元</span>
								<span class="require">满{{item.priceLevel}}元使用</span>
							</div>
						</div>
						<div class="profit-info">
							<p class="profit-shop">{{item.name}}</p>
							<div class="profit-info-item">
								满减
							</div>
							<div class="profit-info-item">
								{{item.startTime}}~{{item.endTime}}
							</div>
							
						</div>
						<div class="coupon-status active">
							立即使用
						</div>
					</div>
					<div class="coupon-item" v-for="(item, index) in useful_coupon_list" :key="index" v-if="item.status == 1">
						<div class="profit-amount">
							<div class="num">{{item.price}}<span>元</span>
								<span class="require">满{{item.priceLevel}}元使用</span>
							</div>
						</div>
						<div class="profit-info">
							<p class="profit-shop">{{item.name}}</p>
							<div class="profit-info-item">
								满减
							</div>
							<div class="profit-info-item">
								{{item.startTime}}~{{item.endTime}}
							</div>
							
						</div>
						<div class="coupon-status">
							已过期
						</div>
					</div>
					
	        	</div>
	        	<div class="none-list" v-else>没有更多数据</div>
	        </scroller>
	      </mt-tab-container-item>
	      <mt-tab-container-item id="2">
	        <scroller :on-infinite="infinite2" ref="scroller2">
		        <div class="pop-product-list" v-if="useless_coupon_list.length>0">
	        		<div class="coupon-item" v-for="item in useless_coupon_list">
						<div class="profit-amount">
							<div class="num">{{item.price}}<span>元</span>
								<span class="require">满{{item.priceLevel}}元使用</span>
							</div>
						</div>
						<div class="profit-info">
							<p class="profit-shop">{{item.name}}</p>
							<div class="profit-info-item">
								满减
							</div>
							<div class="profit-info-item">
								{{item.startTime}}~{{item.endTime}}
							</div>
							
						</div>
						<div class="coupon-status">
							已使用
						</div>
					</div>
	        	</div>
	        	<div class="none-list" v-else>没有更多数据</div>
	        </scroller>
	      </mt-tab-container-item>
	      
	    </mt-tab-container>
	    <confirm-modal 
			:show="show" 
			@cancel_modal="cancel_modal" 
			@confirm_modal="confirm_modal" 
			@closeModal="show = false" 
			cancel_text="取消"
			confirm_text="确认"
			has_icon="success"
			message="确定要使用该优惠券 ?">
		</confirm-modal>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import confirmModal from '../parts/confirmModal'
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top,
			confirmModal
		},
		data() {
			return {
				show: false,
				currCouponId: undefined,
				currCouponindex: undefined,
				
				selected: '1',
				access_token: '',
				coupon_status: 1,
				useful_coupon_list: [],
				useless_coupon_list: [],
				
				page: 1,
				page_size: 12,
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.getCouponList()
		},
		mounted() {
			
		},
		methods: {
			getCouponList(status) {
				this.page = 1
				if(status) {
					if(status == this.coupon_status) {
						return
					}else {
						this.coupon_status = Number(status)
					}
				}
				api.myCoupon({
		        	params:{
		        		flag: this.coupon_status,
					    access_token: this.access_token,
					    page: this.page,
				    	page_size: this.page_size
					}
			    }).then(res => { 
			    	this.page++
			    	if(this.coupon_status == 1) {
			    		this.useful_coupon_list = res.data.result.data
			    		this.$nextTick(() => {
			    			this.$refs.scroller1.resize()
			    			this.$refs.scroller1.finishInfinite();
						})
			    	}else if(this.coupon_status == 2) {
			    		this.useless_coupon_list = res.data.result.data
			    		this.$nextTick(() => {
			    			this.$refs.scroller2.resize()
			    			this.$refs.scroller2.finishInfinite();
						})
			    	}
		        }, err => {
		
		        })
			},
			infinite1() {
		   		setTimeout(() => {
		   			api.myCoupon({
			        	params:{
			        		flag: this.coupon_status,
						    access_token: this.access_token,
						    page: this.page,
					    	page_size: this.page_size
						}
				    }).then(res => { 
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller1.finishInfinite(true)
							})	
							return
				        }
				    	this.useful_coupon_list = this.useful_coupon_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller1.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller1.finishInfinite(true)
			        })  
		        }, 400)
		 	},
		 	infinite2() {
		   		setTimeout(() => {
		   			api.myCoupon({
			        	params:{
			        		flag: this.coupon_status,
						    access_token: this.access_token,
						    page: this.page,
					    	page_size: this.page_size
						}
				    }).then(res => { 
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller2.finishInfinite(true)
							})	
							return
				        }
				    	this.useless_coupon_list = this.useless_coupon_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller2.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller2.finishInfinite(true)
			        })  
		        }, 400)
		 	},
			useCouponConfirm(id, index) {
				this.currCouponId = id
				this.currCouponindex = index
				this.show = true
				
			},
			cancel_modal() {
		  		console.log('取消')
		  	},
		  	confirm_modal() {
		  		this.useCoupon()
		  	},
		  	useCoupon() {
		  		this.$store.commit('setLoadingStatus', true)
		  		api.useCoupon(this.access_token,qs.stringify({
					id: this.currCouponId
				})).then((res) => {
					Toast({
					  message: '使用成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 1000
					})
					this.getCouponList('2')
					setTimeout(() => {
						this.selected = '2'
						this.$store.commit('setLoadingStatus', false)
					},800)
	            })
	            .catch((error) => {
	               this.$store.commit('setLoadingStatus', false)
	            })
		    }
		}
	}
</script>

<style scoped>
	.case-page-part{
		height: 0.8rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	.case-page-part .mint-tab-item{
		padding: 0;
		font-size: 0.30rem;
		position: relative;
		height: 0.8rem;
		text-align: center;
	}
	.pop-product-list{
		padding: 0.3rem;
	}
	.coupon-item{
		display: flex;
		border-radius: 0.1rem;
		overflow: hidden;
		background: #fff;
		width: 6.9rem;
		margin-bottom: 0.3rem;
	}
	.profit-amount{
		width: 1.8rem;
		text-align: center;
		border-right: 1px dashed #ddd;
		padding: 0.2rem 0;
		position: relative;
	}
	.profit-amount:before{
		content: '';
		position: absolute;
		width: 0.3rem;
	    height: 0.3rem;
	    border-radius: 50%;
	    background: #F5F5F9;
	    top: -0.15rem;
	    right: -0.15rem;
	    
	}
	.profit-amount:after{
		content: '';
		position: absolute;
		width: 0.3rem;
	    height: 0.3rem;
	    border-radius: 50%;
	    background: #F5F5F9;
	    bottom: -0.15rem;
	    right: -0.15rem;
	    
	}
	.profit-amount .num{
		font-size: 0.5rem;
		color: #555;
		line-height: 1.6rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		position: relative;
	}
	.profit-amount .num.active{
		color: #f39800;
	}
	.profit-amount .num span{
		margin-left: 0.06rem;
		position: relative;
		top: -0.06rem;
	}
	.profit-amount .num span.require{
		position: absolute;
		left: 0;
		top: 1.2rem;
		line-height: 1;
		width: 100%;
		margin: 0;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 0.24rem;
	}
	.profit-info{
		width: 4.1rem;
		padding: 0.2rem 0.1rem;
		
	}
	.profit-shop{
		font-size: 0.32rem;
		padding-top: 0.1rem;
		padding-bottom: 0.2rem;
		padding-left: 0.08rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.profit-info-item{
		color: #999;
		padding: 0.1rem 0 0.1rem 0.2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		position: relative;
		font-size: 0.28rem;
	}
	.profit-info-item:before{
		content: '';
		position: absolute;
		width: 2px;
		height: 2px;
		background: #ddd;
		left: 0.08rem;
		top: 50%;
		margin-top: -1px;
	}
	.coupon-status{
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
		flex-direction: column;
		align-content: center;
		justify-content: center;
		text-align: center;
		line-height: 1.2;
	}
	.coupon-status.active{
		background-image: url(../../../static/image/bg-4.png);
	}
	.none-list{
		position: absolute;
		width: 100%;
		text-align: center;
		padding: 0.6rem 0;
		top: 0;
		left: 0;
		color: #aaa;
	}
</style>