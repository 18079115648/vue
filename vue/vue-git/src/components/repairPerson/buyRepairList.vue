<template>
	<section>
		<top title="已购案例"></top>
		<section class="pop-product">
			<scroller :on-infinite="infinite" ref="scroller">
	        	<div class="pop-product-list" style="min-height: 1px;">
	        		<div class="pop-product-item"  v-for="(item, index) in rapair_list" :key="index">
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
        	</scroller>
        </section>

	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { Autho, storageGet , markTime} from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top
		},
		data() {
			return {
				rapair_list: [],
				access_token: '',
				
				page: 1,
				page_size: 12,
				
				savePage: 1,
				scrollTop: 0
			}
		},
		beforeCreate() {
	        Autho(this)
	    },
		created() {
			this.markTime = markTime
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
	    	if(/repairDetail/g.test(from.fullPath)) {
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
		mounted() {

		},
		methods: {
			initData() {
				this.access_token = storageGet('access_token')
				this.$store.commit('setLoadingStatus', true)
				this.page = 1
				api.buyRepairList({
		        	params:{
					    access_token: this.access_token,
					    page: this.page,
					    page_size: this.page_size
					}
			    }).then(res => {  
			    	this.$store.commit('setLoadingStatus', false)
			    	this.page++
		            this.rapair_list = res.data.result.data
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
		   			api.buyRepairList({
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
		            	this.rapair_list = this.rapair_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	},
		 	goRepairDetail(item) {
		 		this.$router.push('/repairDetail/'+item.id)
		 	},
		 	thumbUp(item) {
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
	                console.log(err)
	            })
		    }
		}
		
	}
</script>

<style scoped>
	.pop-product{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
	}
	.repair-case-select{
		height: 0.9rem;
		display: flex;
		padding: 0.2rem 0;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;

	}
	.repair-case-select span{
		flex: 1;
		text-align: center;
		line-height: 0.5rem;
		border-right: 1px solid #eee;
		position: relative;
		right: -1px;
		
	}
	.repair-case-select span i{
		display: inline-block;
		width: 0;
	    height: 0;
	    border-left: 0.12rem solid transparent;
	    border-right: 0.12rem solid transparent;
	    border-top: 0.16rem solid #666;
	    margin-left: 0.2rem;
	    position: relative;
	    top: -1px;
	}
	
	.pop-product-item{
		display: block;
		padding: 0.3rem;
		border-bottom: 0.2rem solid #F5F5F9;
	}
	.pop-product-message{
		display: flex;
	}
	.pop-product-img{
		height: 1.6rem;
		width: 1.6rem;
		background: #ddd;
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
		line-height: 1.5;
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
	.pop-product-text{
		color: #555;
		padding-top: 0.4rem;
		line-height: 1.5;
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