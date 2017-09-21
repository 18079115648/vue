<template>
	<section>
		<top title="修理案例" :backStatus="false"></top>
		<section class="search">
			<div class="search-input" @click="toSearch">搜索案例</div>
		</section>
		<div class="repair-content">
			<scroller 
				ref="scroller">
				<section class="repair-banner">
					<mt-swipe :auto="0">
					  <mt-swipe-item>
					  	<div class="repair-kind">
					  		<router-link :to="'/repairList/'+ item.id" class="repair-kind-item" v-for="(item, index) in cateList.slice(0,8)" :key="index">
					  			<div class="repair-kind-img">
					  				<img :src="item.icon" class="fullEle"  />
					  			</div>
			        			<p style="font-size: 0.24rem;">{{item.name}}</p>
					  		</router-link>
					  	</div>
					  </mt-swipe-item>
					  <mt-swipe-item v-if="cateList.length>8">
					  	<div class="repair-kind">
					  		<router-link :to="'/repairList/'+ item.id" class="repair-kind-item" v-for="(item, index) in cateList.slice(8)" :key="index">
					  			<div class="repair-kind-img">
					  				<img :src="item.icon" class="fullEle"  />
					  			</div>
			        			<p style="font-size: 0.24rem;">{{item.name}}</p>
					  		</router-link>	
					  	</div>
					  </mt-swipe-item>
					</mt-swipe>
				</section>
				<section class="pop-product">
		        	<div class="pop-product-tit">
		        		<div class="tit"><span class="pop-icon"></span>精品推荐</div>
		        	</div>
		        	<div class="pop-product-list">
		        		<div class="pop-product-item"  v-for="(item, index) in hotData" :key="index">
		        			<div style="margin-bottom: 0.2rem;" @click="goRepairDetail(item)">
			        			<div class="pop-product-message">
			        				<div class="pop-product-img" v-if="item.type == 2">
			        					<img :src="item.imgs[0]" class="fullEle"  />
			        				</div>
				        			<div class="pop-product-desc">
				        				<p class="pop-product-name">{{item.title}}</p>
				        				<div class="pop-product-pay">
				        					<p v-if="item.price>0" class="pop-product-price"><i></i>{{item.price}}</p>
				        					<p v-else class="pop-product-price"><i></i>免费</p>
				        					<span v-if="item.flag == 1">已支付积分</span>
				        				</div>
				        				
				        			</div>
			        			</div>
			        			<div class="video-img" style=" margin-top: 0.4rem;" v-if="item.type == 3">
							      <img class="fullAuto" :src="item.imgs[0]"  />
							      <span class="video-time" v-if="item.type == 3">{{markTime(item.videoTime)}}</span>
							      <div class="video-stop" v-if="item.type == 3">
							      	  <img class="fullEle" src="../../../static/image/video-stop.png"  />
							      </div>
							      
							    </div>
			        			<div class="pop-product-text" v-text="item.description">
			        			</div>
			        		</div>
		        			<div class="pop-product-amount">
		        				<span>{{item.readNum}} 阅读</span>
		        				<span class="user"><i><img :src="item.avatar" class="fullEle" /></i>{{item.userName}}</span>
		        				<div class="assess-operate">
		        					<!--<span class="comment">评价</span>-->
		        					<span class="up" :class="item.praise ? 'active' : ''" @click="thumbUp(item)">点赞({{item.praiseCount}})</span>
		        				</div>
		        			</div>
		        		</div>
		        		
		        	</div>
		        </section>
		    </scroller>
		</div>
		
        <confirm-modal 
			:show="show" 
			@cancel_modal="cancel_modal" 
			@confirm_modal="confirm_modal" 
			@closeModal="show = false" 
			cancel_text="取消"
			confirm_text="确认"
			has_icon="success"
			:message="messageText">
		</confirm-modal>
		<confirm-modal 
			:show="err_show" 
			@cancel_modal="err_cancel_modal" 
			@confirm_modal="err_confirm_modal" 
			@closeModal="err_show = false" 
			confirm_text="充值换积分"
			has_icon="warn"
			message="积分余额不足 !">
		</confirm-modal>
	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { MessageBox } from 'mint-ui'
	import {SecondAutho, storageGet, markTime } from '../../../static/js/app.js'
	import confirmModal from '../parts/confirmModal'
	import api from '@/fetch/api'
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top,
			confirmModal
		},
		data() {
			return {
				cateList: [],
				hotData:[],
				access_token: '',
				
				messageText: '',
				show: false,
				currRepairId: undefined,
				currRepair: {},
				err_show: false,
				markTime: undefined,
				
				scrollTop: 0
			}
		},
		created() {
			this.markTime = markTime
			this.access_token = storageGet('access_token')
//			this.initData()
		},
		mounted() {

		},
		methods: {
			initData() {
				this.$store.commit('setLoadingStatus', true)
				api.repairIndex({
		        	params:{
					    access_token: this.access_token
					}
			    }).then((res) => {
			       this.$store.commit('setLoadingStatus', false)
	               this.cateList = res.data.result.cateList
	               this.hotData = res.data.result.hot
	               this.$nextTick(() => {
	                	this.$refs.scroller.resize()
					})
	            }).catch((err) => {
	                this.$store.commit('setLoadingStatus', false)
	            })
			},
			goRepairDetail(item) {
				if(!SecondAutho()) {
					return
				}
				if(item.flag == 1) {
					this.$router.push('/repairDetail/'+item.id)
				}else {
					this.currRepair = item
					this.currRepairId = item.id
					this.messageText = '确定支付 '+ item.price + ' 积分查看案例 ?'
					this.show = true
				}
			},
			cancel_modal() {
		  		console.log('取消')
		  	},
		  	confirm_modal() {
		  		this.buyRepairCase()
		  	},
		  	err_cancel_modal() {
		  		console.log('取消')
		  	},
		  	err_confirm_modal() {
		  		this.$router.push('/recharge')
		  	},
			toSearch() {
		  		this.$router.push('/repairSearch')
		    },
		    buyRepairCase() {
		    	api.repairBuy(this.access_token, qs.stringify({
					id: this.currRepairId,
					access_token: this.access_token
	    		})).then((res) => {
	    			if(res.data.err_code == 0) {
	    				this.currRepair.flag = 1
	    				Toast({
							message: '购买成功',
							position: 'middle',
							iconClass: 'toast-icon icon-success',
							duration: 1300
						})
						var timer = setTimeout(() => {
							clearTimeout(timer)
							this.$router.push('/repairDetail/'+this.currRepairId)
						}, 1000)
	    			}else if(res.data.err_code == 40014) {
	    				this.err_show = true
	    			}
	            }).catch((err) => {
	                console.log(err)
	            })
		    },
		    thumbUp(item) {
		    	if(!SecondAutho()) {
					return
				}
		    	api.praiseRepair({
		        	params:{
		        		id: item.id,
					    access_token: this.access_token
					}
			    }).then((res) => {
			    	if(!res.data.result.praise) {
			    		Toast({
						  message: '取消点赞',
						  position: 'bottom',
						  duration: 600
						});
			    	}
			    	item.praiseCount = res.data.result.count
			    	item.praise = res.data.result.praise
	            }).catch((err) => {

	            })	
		    }
		},
		activated() {
	    	this.$refs.scroller.resize()
	    	this.$refs.scroller.scrollTo(0,this.scrollTop,false)
	    },
		beforeRouteEnter (to, from, next) {
	    	if(/repairDetail/g.test(from.fullPath) || /repairList/g.test(from.fullPath) || /repairSearch/g.test(from.fullPath) || /recharge/g.test(from.fullPath)) {
	    		next(vm=>{
	    			if(vm.cateList.length<1) {
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
			if(this.show || this.err_show) {
				this.show = false
				this.err_show = false
				next(false)
				return
			}
			this.scrollTop = this.$refs.scroller.getPosition().top
			next()
		}
	}
</script>

<style scoped>
	.repair-content{
		position: absolute;
		width: 100%;
		left: 0;
		top: 1.8rem;
		right: 0;
		bottom: 0;
	}
	.search {
		position: fixed;
		left: 0;
		top: 0.9rem;
		width: 100%;
		height: 0.9rem;
		background: #F5F5F9;
		padding: 0.2rem 0.3rem;
		line-height: 0.5rem;
		z-index: 20;
	}
	
	.search-input {
		border-radius: 0.06rem;
		background: #fff;
		color: #999;
		padding-left: 0.7rem;
		position: relative;
	}
	.search-input:before{
		position: absolute;
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		left: 0.1rem;
		top: 0;
		background: url(../../../static/image/search-icon.png) no-repeat center;
		background-size: 60%;
	}
	.repair-banner{
		height: 3.9rem;
	}
	.repair-kind{
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		padding-top: 0.25rem;
		align-content:flex-start;
	}
	.repair-kind-item{
		width: 25%;
		height: 1.5rem;
		text-align: center;
		margin-bottom: 0.2rem;
	}
	.repair-kind-img{
		display: inline-block;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 0.1rem;
	}
	.pop-product-tit{
		height: 0.8rem;
		background: #f5f5f9;
		line-height: 0.8rem;
		text-align: center;
	}
	.pop-product-tit .tit{
		display: inline-block;
		height: 100%;
		color: #8fc31f;
		font-size: 0.3rem;
		position: relative;
		padding-left: 0.5rem;
	}
	.pop-product-tit .tit:after{
		content: '';
		width: 0.5rem;
		height: 0;
		border-bottom: 1px solid #8fc31f;
		position: absolute;
		right: -0.8rem;
		top: 48%;
	}
	.pop-product-tit .tit:before{
		content: '';
		width: 0.5rem;
		height: 0;
		border-bottom: 1px solid #8fc31f;
		position: absolute;
		left: -0.8rem;
		top: 48%;
	}
	.pop-icon{
		position: absolute;
		width:0.36rem;
		height: 0.36rem;
		background: url(../../../static/image/well-icon.png) no-repeat center;
		background-size: 100%;
		left: 0;
		top: 50%;
		margin-top: -0.18rem;
	}
	.pop-product-item{
		
		padding: 0.3rem;
		border-bottom: 0.2rem solid #F5F5F9;
	}
	.pop-product-message{
		display: flex;
	}
	.pop-product-img{
		height: 1.7rem;
		width: 1.7rem;
		margin-right: 0.3rem;
	}
	.pop-product-desc{
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.pop-product-name{
		flex: 1;
		width: 100%;
		font-size: 0.3rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
		line-height: 1.4;
		max-height: 0.8rem;
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.pop-product-price{
		border: 1px solid #39b382;
		border-radius: 0.1rem;
		padding: 0.12rem 0.3rem;
		width: auto;
		color: #39b382;
		vertical-align: bottom;
		line-height: 0.36rem;
		
	}
	.pop-product-price i{
		display: inline-block;
		width: 0.36rem;
		height: 0.36rem;
		background: url(../../../static/image/money-icon.png) no-repeat center;
		background-size: 100%;
		vertical-align: bottom;
		margin-right: 0.15rem;
	}
	.pop-product-pay{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.pop-product-pay>span{
		color: #f26200;
	}
	.pop-product-amount{
		height: 0.6rem;
		color: #bbb;
		line-height: 0.6rem;
		display: flex;
		position: relative;
	}
	.assess-operate{
		position: absolute;
		right: 0;
		top: 0;
		height: 0.6rem;
		line-height: 0.6rem;
	}
	.assess-operate>span{
		display: inline-block;
		height: 0.6rem;
		line-height: 0.6rem;
		margin-left: 0.34rem;
		padding-left: 0.46rem;
		position: relative;
		color: #666;
		vertical-align: middle;
	}
	.assess-operate>span:before{
		content: '';
		position: absolute;
		width: 0.4rem;
		height: 0.4rem;
		left: 0;
		top: 0.05rem;
		background-position: center;
		background-size: 80%;
		background-repeat: no-repeat;
	}
	.assess-operate>span.comment:before{
		background-image: url(../../../static/image/comment-icon.png);
	}
	.assess-operate>span.up:before{
		background-image: url(../../../static/image/up-icon.png);
	}
	.assess-operate>span.up.active:before{
		background-image: url(../../../static/image/uped-icon.png);
	}
	.pop-product-amount .user{
		margin-left: 0.4rem;
		position: relative;
		padding-left: 0.5rem;
	}
	.pop-product-amount .user>i{
		position: absolute;
		width: 0.4rem;
		height: 0.4rem;
		left: 0;
		top: 0.1rem;
		border-radius: 50%;
		overflow: hidden;
	}
	.pop-product-amount .user img{
		display: inline-block;
		height: 100%;
		width: auto;
	}
	.pop-product-text{
		line-height: 1.5;
	}
	.pop-product-text, .video-group{
		color: #555;
		padding-top: 0.4rem;
		
	}
	.video-img{
		position: relative;
	}
	.video-time{
		position: absolute;
		right: 0.2rem;
		bottom: 0.1rem;
		color: #fff;
	}
	.video-stop{
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0.8rem;
		height: 0.8rem;
		margin-left: -0.4rem;
		margin-top: -0.3rem;
	}
</style>