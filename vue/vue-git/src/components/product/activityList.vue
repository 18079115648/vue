<template>
	<section>
		<top title="特色活动" :backStatus="false"></top>
		<div class="activity-list">
			<scroller :on-infinite="infinite" ref="scroller">
				<div style="min-height: 1px;">
					<div  class="activity-item" v-for="(item, index) in activity_list" :key="index">
						<div class="activity-item-img" @click="goDetail(item.id)">
							<img :src="item.imgs[0]" class="fullEle"  />
						</div>
						<div class="activity-item-desc">
							<p class="activity-name">{{item.title}}</p>
							<p class="activity-time">活动时间：{{item.startTime}} 至 {{item.endTime}}</p>
							<p class="activity-addr">
								<span style="width: 1.5rem;">活动地点：</span>
								<span style="flex: 1; line-height: 1.4;">{{item.address}}</span>
								<router-link class="address-map-icon" :to="'/baiduMap/' + item.latitude +'/' + item.longitude"></router-link>
							</p>
						</div>
						<div class="activity-status" v-show="item.flag == 1">已结束</div>
						<div class="activity-status" v-show="item.flag == 2">即将开始</div>
						<div class="activity-status" style="color: #39B382;" v-show="item.flag == 3">进行中</div>
					</div>
				</div>
			</scroller>
		</div>
	</section>
</template>

<script>
	import top from '../parts/header'
	import axios from 'axios'
	import api from '@/fetch/api'
	import {SecondAutho, storageGet } from '../../../static/js/app.js'
	export default {
		components: {
			top
		},
		data() {
			return {
				activity_list:[],
				
				page: 1,
				page_size: 12,
				savePage: 1,
				
				scrollTop: 0
			}
		},
		mounted() {

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
	    	if(/activityDetail/g.test(from.fullPath) || /baiduMap/g.test(from.fullPath)) {
	    		next(vm=>{
	    			if(vm.page<2) {
	    				vm.initData()
	    				vm.$refs.scroller.scrollTo(0,0,false)
	    			}
	        	})
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
				api.activityList({
		        	params:{
					    page: this.page,
					    page_size: this.page_size,
					    access_token: this.access_token
					}
			    }).then((res) => {
			    	this.$store.commit('setLoadingStatus', false)
	            	this.page++
	                this.activity_list = res.data.result.data
	                this.$nextTick(() => {
	                	this.$refs.scroller.resize()
	                	this.$refs.scroller.finishInfinite();
					})
	            }).catch((err) => {
	                this.$store.commit('setLoadingStatus', false)
	            })
			},
			infinite(){
		   		setTimeout(() => {
		   			api.activityList({
			        	params:{
						    page: this.page,
						    page_size: this.page_size
						}
				    }).then((res) => {
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller.finishInfinite(true)
							})	
							return
				        }
		            	this.activity_list = this.activity_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	},
		 	goDetail(id) {
		 		this.$router.push('/activityDetail/'+ id)
		 	}
		}
	}
</script>

<style scoped>
	.activity-list{
		position: absolute;
		left: 0;
		top: 0.9rem;
		bottom: 0;
		right: 0;
	}
    .activity-item{
    	display: block;
    	position: relative;
    	border-bottom: 0.3rem solid #F5F5F9;
    }
	.activity-item-img{
		height: 4rem;
	}
	.activity-item-desc{
		padding: 0.3rem;
	}
	.activity-name{
		color: #333;
		font-size: 0.3rem;
		font-weight: 600;
		line-height: 1.5;
		overflow:hidden; 
	    text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2; 
		margin-bottom: 0.2rem;
	}
	.activity-time{
		padding-bottom: 0.2rem;
	}
	.activity-status{
		position: absolute;
		left: 0;
		top: 0.3rem;
		padding: 0 0.4rem 0 0.3rem;
		height: 0.5rem;
		line-height: 0.5rem;
		border-radius: 0 0.25rem 0.25rem 0;
		color: #fff;
		background: rgba(0,0,0,0.3);
		z-index: 50;
	}
	.activity-addr{
		position: relative;
		padding-right: 1rem;
		display: flex;
	}
	.address-map-icon{
		position: absolute;
		right: 0;
		top: 50%;
		width: 0.8rem;
		height: 0.8rem;
		margin-top: -0.4rem;
		background: url(../../../static/image/navi.png) no-repeat center;
		background-size: 60%;
	}
</style>