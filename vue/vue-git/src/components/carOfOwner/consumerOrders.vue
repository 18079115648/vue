<template>
	<section class="fullDiv">
		<top title="消费订单"></top>
		<section class="consumer-orders-content">
			<scroller :on-infinite="infinite" ref="scroller">
				<div style="min-height: 1px;">
					<div class="consumer-orders-item" style="padding-bottom: 0.3rem;" v-for="(item, index) in consumerOrderList" :key="index">
						<p class="consumer-orders-year">{{item.year}}</p>
						<div class="orders-item-detail" v-for="(obj, key) in item.agentOrderDtoList" :key="key">
							<router-link :to="'/consumerOrderDetail/' + obj.id" class="orders-item-detail-link" >
								<img class="avatar" :src="obj.img"  />
								<div class="orders-item-info">
									<p class="name">{{obj.name}}</p>
									<p class="time">{{obj.createTime}}</p>
								</div>
								<span class="consumer-amount">&yen;{{Number(obj.amount).toFixed(2)}}</span>
							</router-link>
							<p class="comment-operate" v-if="obj.status == 0"><span @click="goComment(obj.id)">立即评价</span></p>
						</div>
						
					</div>
				</div>	
			</scroller>
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
				access_token: '',
				consumerOrderList: [],
				
				page: 1,
				page_size: 18
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.$store.commit('setLoadingStatus', true)
			api.consumerOrderList({
	        	params:{
				    access_token: this.access_token,
				    page: this.page,
				    page_size: this.page_size
				}
		    }).then(res => {  
		    	this.$store.commit('setLoadingStatus', false)
		    	this.page++
	            this.consumerOrderList = res.data.result.data
	            this.$nextTick(() => {
                	this.$refs.scroller.resize()
                	this.$refs.scroller.finishInfinite();
				})
	        }, err => {
				this.$store.commit('setLoadingStatus', false)
	        })
		},
		mounted() {

		},
		methods: {
			infinite(){
		   		setTimeout(() => {
		   			api.consumerOrderList({
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
	   					if(res.data.result.data[0].year == this.consumerOrderList[this.consumerOrderList.length-1].year) {
	   						this.consumerOrderList[this.consumerOrderList.length-1].agentOrderDtoList = this.consumerOrderList[this.consumerOrderList.length-1].agentOrderDtoList.concat(res.data.result.data[0].agentOrderDtoList)
	   						this.consumerOrderList = this.consumerOrderList.concat(res.data.result.data.slice(1))
	   					}else {
	   						this.consumerOrderList = this.consumerOrderList.concat(res.data.result.data)
	   					}
		            	
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	},
		 	goComment(id) {
		 		this.$router.push('/orderComment/' + id)
		 	}
		}
	}
</script>

<style scoped>
	.consumer-orders-content{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
	}
	.consumer-orders-year{
		height: 0.7rem;
		line-height: 0.7rem;
		padding-left: 0.3rem;
	}
	.orders-item-detail{
		background: #fff;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.2rem 0.3rem;
		
	}
	.orders-item-detail-link{
		display: flex;
		align-items: center;
	}
	.orders-item-detail .avatar{
		width: 1rem;
		height: 1rem;
		border-radius: 0.1rem;
		margin-right: 0.2rem;
	}
	.orders-item-info{
		width: 4rem;
		height: 1rem;
		display: flex;
		flex-direction: column;
		padding: 0.1rem 0;
	}
	.orders-item-info .name{
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 1.4;
	}
	.orders-item-info .time{
		color: #999;
	}
	.consumer-amount{
		flex: 1;
		text-align: right;
		color: #555;
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