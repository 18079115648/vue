<template>
	<section class="fullDiv move-right">
		<top title="我的积分"></top>
		<div class="myIntegral-content">
			<section class="myIntegral-total">
				<div class="integral-num">
					<p class="integral">{{total_point}}</p>
					<p class="tip">公测已结束，积分截止10月9日之前有效</p>
				</div>
				<div class="charge-btn" @click="goRecharge">积分充值</div>
			</section>
			<section class="myIntegral-list">
				<scroller :on-infinite="infinite" ref="scroller">
					<div style="min-height: 1px;">
						<div class="myIntegral-list-item" v-for="(item, index) in point_list" :key="index">
							<div class="integral-info">
								<p class="integral-tit">{{item.remark}}</p>
								<p class="integral-time">{{item.create_time}}</p>
							</div>
							<div class="exchange-num">
								{{item.points}}
							</div>
						</div>
					</div>
				</scroller>
			</section>
		</div>
		
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
				total_point: undefined,
				point_list: [],
				
				page: 1,
				page_size: 12
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.$store.commit('setLoadingStatus', true)
			api.myIntegral({
	        	params:{
				    access_token: this.access_token,
				    page: this.page,
				    page_size: this.page_size
				}
		    }).then(res => { 
		    	this.$store.commit('setLoadingStatus', false)
		    	this.page++
		    	this.total_point = res.data.total_points
	            this.point_list = res.data.result.data
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
			goRecharge() {
//				this.$router.push('/recharge')
				window.location.href = this.$store.state.back_uri + '/#/recharge'
			},
			infinite(){
		   		setTimeout(() => {
		   			api.myIntegral({
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
		            	this.point_list = this.point_list.concat(res.data.result.data)
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
	.myIntegral-content{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
	}
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
		width: 3.8rem;
		left: 0.8rem;
		top: 0.9rem;
		
	}
	.integral-num .integral{
		padding-left: 0.45rem;
		font-size: 0.9rem;
		padding-bottom: 0.24rem;
		position: relative;
	}
	.integral-num .integral:before{
		content: '';
		position: absolute;
		width: 0.34rem;
		height: 0.5rem;
		left: 0;
		bottom: 0.3rem;
		background: url(../../../static/image/interge-icon.png) no-repeat center;
		background-size: 100%;
	}
	.integral-num .tip{
		/*font-size: 0.24rem;*/
		color: #fefefe;
	}
	.charge-btn{
		position: absolute;
		background: #fff;
		color: #f39800;
		padding: 0.2rem 0.4rem;
		border-radius: 0.06rem;
		right: 0.7rem;
		bottom: 0.56rem;
		/*font-size: 0.32rem;*/
	}
	.charge-btn:active{
		opacity: 0.7;
	}
	.myIntegral-list{
		position: absolute;
		left: 0;
		width: 100%;
		top: 2.9rem;
		bottom: 0;
		right: 0;
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
		margin-top: 0.1rem;
	}
	.exchange-num{
		font-size: 0.32rem;
		color: #f26200;
	}
	.none-list{
		text-align: center;
    	padding: 0.5rem;
    	color: #888;
	}
</style>