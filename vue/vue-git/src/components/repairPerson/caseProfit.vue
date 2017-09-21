<template>
	<section class="fullDiv" style="padding-top: 0.9rem;">
		<top title="收入明细"></top>
		<section class="myIntegral-total">
			<div class="integral-num">
				<p class="integral"><i></i>{{totalPrice}}</p>
				<p class="tip">单价：{{price}} 积分</p>
			</div>
		</section>
		<div class="myIntegral-content">
			<scroller :on-infinite="infinite" ref="scroller">
				<section class="myIntegral-list" style="min-height: 1px;">
					<div class="myIntegral-list-item" v-for="(item, index) in repairIncomeList">
						<div class="integral-info">
							<p class="integral-tit">{{item.name}}</p>
							<p class="integral-time">{{item.createTime}}</p>
						</div>
						<div class="exchange-num">
							+{{price}}
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
	import {Autho, storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	export default {
		components: {
			top
		},
		data() {
			return {
				access_token: '',
				repairIncomeList: [],
				price: undefined,
				totalPrice: undefined,
				
				page: 1,
				page_size: 12
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.case_id = window.location.hash.split('/')[2]
			api.repairIncome({
	        	params:{
	        		id: this.case_id,
				    access_token: this.access_token,
				    page: this.page,
				    page_size: this.page_size
				}
		    }).then(res => {   
		    	this.page++
		    	this.repairIncomeList = res.data.result.data.log
		    	this.price = res.data.result.data.price
	            this.totalPrice = res.data.result.data.totalPrice
	            this.$nextTick(() => {
                	this.$refs.scroller.resize()
                	this.$refs.scroller.finishInfinite();
				})
	        }, err => {
	
	        })
		},
		mounted() {

		},
		methods: {
			infinite(){
		   		setTimeout(() => {
		   			api.repairIncome({
			        	params:{
			        		id: this.case_id,
						    access_token: this.access_token,
						    page: this.page,
						    page_size: this.page_size
						}
				    }).then(res => {   
	   					if(res.data.result.data.log.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller.finishInfinite(true)
							})	
							return
				        }
		            	this.repairIncomeList = this.repairIncomeList.concat(res.data.result.data.log)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	}
		}
	}
</script>

<style scoped>
	.myIntegral-total{
		width: 100%;
		height: 2.9rem;
		position: relative;
		background-image: url(../../../static/image/bg-1.png);
		background-size: 100%;
		color: #fff;
	}
	.integral-num{
		position: absolute;
		width: 6.5rem;
		left: 0.5rem;
		top: 0.8rem;
		text-align: center;
	}
	.integral-num .integral{
		font-size: 1rem;
		padding-bottom: 0.3rem;
		position: relative;
	}
	.integral-num .integral i{
		display: inline-block;
		width: 0.3rem;
		height: 0.4rem;
		margin-right: 0.15rem;
		vertical-align: bottom;
		background: url(../../../static/image/interge-icon.png) no-repeat center;
		background-size: 100%;
		position: relative;
		bottom: 0.04rem;
	}
	.integral-num .tip{
		font-size: 0.28rem;
		color: #fefefe;
	}
	.charge-btn{
		position: absolute;
		background: #fff;
		color: #f39800;
		padding: 0.2rem 0.4rem;
		border-radius: 0.06rem;
		right: 0.7rem;
		bottom: 0.6rem;
	}
	.myIntegral-content{
		position: absolute;
		width: 100%;
		left: 0;
		top: 3.8rem;
		right: 0;
		bottom: 0;
	}
	.myIntegral-list-item{
		background: #fff;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.integral-info>p{
		line-height: 2;
	}
	.integral-info>p.integral-time{
		color: #bbb;
	}
	.exchange-num{
		font-size: 0.32rem;
		color: #f26200;
	}
</style>