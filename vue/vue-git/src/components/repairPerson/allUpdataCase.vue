<template>
	<section style="padding-top: 0.9rem;">
		<top title="我的案例"></top>
		<mt-navbar class="case-page-part" v-model="selected">
	      <mt-tab-item id="1" @click.native.prevent="getRepairList('1')">待审核</mt-tab-item>
	      <mt-tab-item id="2" @click.native.prevent="getRepairList('2')">已审核</mt-tab-item>
	      <mt-tab-item id="3" @click.native.prevent="getRepairList('3')">未通过</mt-tab-item>
	    </mt-navbar>
	    <mt-tab-container class="spipe-tab-content allRepair" v-model="selected">
	      <mt-tab-container-item id="1">
	      	<scroller :on-infinite="infinite1" ref="scroller1">
	      		<div style="height: 1000px;" v-show="scroller_show[0]"></div>
		        <div class="pop-product-list" v-if="wait_repair_list.length>0">
	        		<div class="pop-product-item" v-for="(item, index) in wait_repair_list" :key="index" v-if="wait_repair_list.length>0">
	        			<div class="pop-product-message">
	        				<div class="pop-product-img" v-if="item.type == 2">
		        					<img :src="item.imgs[0]" class="fullEle"  />
		        				</div>
		        			<div class="pop-product-desc">
		        				<p class="pop-product-name">{{item.title}}</p>
		        				<div class="pop-product-pay">
		        					<p v-if="item.price>0" class="pop-product-price"><i></i>{{item.price}}</p>
		        					<p v-else class="pop-product-price"><i></i>免费</p>
		        					<!--<span v-if="item.flag == 1">已支付积分</span>-->
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
	        			<div class="updata-case-operate">
	        				<span class="edit" @click="goEditRepair(item.id)">编辑</span>
	        				<span class="delete" @click="deleteRepair(item.id, index)">删除</span>
	        			</div>
	        		</div>
	        		<div class="none-list" v-if="wait_repair_list.length == 0">暂无案例</div>
	        	</div>
	        	<div class="none-list" v-else>没有更多数据</div>
        	</scroller>
	      </mt-tab-container-item>
	      <mt-tab-container-item id="2">
	      	<scroller :on-infinite="infinite2" ref="scroller2">
	      		<div style="height: 1000px;" v-show="scroller_show[1]"></div>
		        <div class="pop-product-list" v-if="end_repair_list.length>0">
	        		<div class="pop-product-item" v-for="(item, index) in end_repair_list" :key="index" >
	        			<div class="pop-product-message">
	        				<div class="pop-product-img" v-if="item.type == 2">
	        					<img :src="item.imgs[0]" class="fullEle"  />
	        				</div>
		        			<div class="pop-product-desc">
		        				<p class="pop-product-name">{{item.title}}</p>
		        				<div class="pop-product-pay">
		        					<p v-if="item.price>0" class="pop-product-price"><i></i>{{item.price}}</p>
		        					<p v-else class="pop-product-price"><i></i>免费</p>
		        					<!--<span v-if="item.flag == 1">已支付积分</span>-->
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
	        			<div class="pop-product-amount">
	        				<span>{{item.readNum}} 阅读</span>
	        				<div @click="goCaseProfit(item.id)" class="profit-btn">查看明细</div>
	        			</div>
	        		</div>
	        	</div>
	        	<div class="none-list" v-else>没有更多数据</div>
        	</scroller>
	      </mt-tab-container-item>
	      <mt-tab-container-item id="3">
	      	<scroller :on-infinite="infinite3" ref="scroller3">
	      		<div style="height: 1000px;" v-show="scroller_show[2]"></div>
		        <div class="pop-product-list" v-if="err_repair_list.length>0">
	        		<div class="pop-product-item" v-for="(item, index) in err_repair_list" :key="index" >
	        			<div class="pop-product-message">
	        				<div class="pop-product-img" v-if="item.type == 2">
	        					<img :src="item.imgs[0]" class="fullEle"  />
	        				</div>
		        			<div class="pop-product-desc">
		        				<p class="pop-product-name">{{item.title}}</p>
		        				<div class="pop-product-pay">
		        					<p v-if="item.price>0" class="pop-product-price"><i></i>{{item.price}}</p>
		        					<p v-else class="pop-product-price"><i></i>免费</p>
		        					<!--<span v-if="item.flag == 1">已支付积分</span>-->
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
	        			<div class="failing-reason">{{item.remark}}</div>
	        			<div class="updata-case-operate">
	        				<span class="edit" @click="goEditRepair(item.id)">编辑</span>
	        				<span class="delete">删除</span>
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
			message="确定要删除该案例 ?">
		</confirm-modal>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import {Autho, storageSet, storageGet, markTime } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import confirmModal from '../parts/confirmModal'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top,
			confirmModal
		},
		data() {
			return {
				show: false,
				currDeleteId: undefined,
				currDeleteindex: undefined,
				
				selected: '1',
				case_status: -1,
				wait_repair_list: [],
				end_repair_list: [],
				err_repair_list: [],
				
				page: 1,
				page_size: 12,
				scrollerObj: [],
				scroller_show: [true, true, true],
				scrollerPage:[1,1,1]
			}
		},
		beforeCreate() {
	        Autho(this)
	    },
		created() {
			if(storageGet('repairStatus')) {
				this.selected = String(storageGet('repairStatus'))
			}
			this.markTime = markTime
			this.access_token = storageGet('access_token')
			this.getRepairList(this.selected)
		},
		mounted() {
			this.scrollerObj[0] = this.$refs.scroller1
			this.scrollerObj[1] = this.$refs.scroller2
			this.scrollerObj[2] = this.$refs.scroller3
		},
		methods: {
			getRepairList(status) {
				if(status) {
					if(status == this.case_status) {
						return
					}else {
						this.case_status = Number(status)
					}
				}
				this.scrollerPage[parseInt(this.case_status) - 1] = 1
				api.UpdataRepairList({
		        	params:{
		        		status: this.case_status,
					    access_token: this.access_token,
					    page: this.scrollerPage[parseInt(this.case_status) - 1],
				    	page_size: this.page_size
					}
			   }).then(res => { 
			    	this.scroller_show=[true, true, true]
			    	this.scrollerPage[parseInt(this.case_status) - 1]++
			    	if(this.case_status == 1) {
			    		this.scroller_show[0] = false
			    		this.wait_repair_list = res.data.result.data
			    	}else if(this.case_status == 2) {
			    		this.scroller_show[1] = false
			    		this.end_repair_list = res.data.result.data
			    	}else if(this.case_status == 3) {
			    		this.scroller_show[2] = false
			    		this.err_repair_list = res.data.result.data
			    	}
		    		this.$nextTick(() => {
		    			this.scrollerObj[this.case_status-1].scrollTo(0,0,false)
	                	this.scrollerObj[this.case_status-1].resize()
	                	this.scrollerObj[this.case_status-1].finishInfinite();
					})
		       }, err => {
		        })
			},
			infinite1() {
				console.log('1')
		   		setTimeout(() => {
		   			api.UpdataRepairList({
			        	params:{
			        		status: 1,
						    access_token: this.access_token,
						    page: this.scrollerPage[0],
					    	page_size: this.page_size
						}
				    }).then(res => { 		    			
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller1.finishInfinite(true)
							})	
							return
				        }
				    	this.wait_repair_list = this.wait_repair_list.concat(res.data.result.data)
		            	this.scrollerPage[0]++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller1.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller1.finishInfinite(true)
			        })  
		        }, 400)
		 	},
		 	infinite2() {
		 		console.log('2')
		   		setTimeout(() => {
		   			api.UpdataRepairList({
			        	params:{
			        		status: 2,
						    access_token: this.access_token,
						    page: this.scrollerPage[1],
					    	page_size: this.page_size
						}
				    }).then(res => { 
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller2.finishInfinite(true)
							})	
							return
				        }
				    	this.end_repair_list = this.end_repair_list.concat(res.data.result.data)
		            	this.scrollerPage[1]++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller2.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller2.finishInfinite(true)
			        })  
		        }, 400)
		 	},
		 	infinite3() {
		 		console.log('3')
		   		setTimeout(() => {
		   			api.UpdataRepairList({
			        	params:{
			        		status: 3,
						    access_token: this.access_token,
						    page: this.scrollerPage[2],
					    	page_size: this.page_size
						}
				    }).then(res => { 
	   					if(res.data.result.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller3.finishInfinite(true)
							})	
							return
				        }
				    	this.err_repair_list = this.err_repair_list.concat(res.data.result.data)
		            	this.scrollerPage[2]++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller3.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller3.finishInfinite(true)
			        })  
		        }, 400)
		 	},
			deleteRepair(id, index) {
				this.currDeleteId = id
				this.currDeleteindex = index
				this.show = true
			},
			cancel_modal() {
		  		console.log('取消')
		  	},
		  	confirm_modal() {
		  		this.deleteRepairCase()
		  	},
		  	deleteRepairCase() {
	            api.deleteRepair({
		        	params:{
					    id: this.currDeleteId,
					    access_token: this.access_token
					}
			    }).then((res) => {
	                if(this.case_status == 1) {
			    		this.wait_repair_list.splice(this.currDeleteindex, 1)
			    		
			    	}else if(this.case_status == 3) {
			    		this.err_repair_list.splice(this.currDeleteindex, 1)
			    	}
			    	Toast({
					  message: '删除成功',
					  position: 'bottom',
					  duration: 1000
					});
	            }).catch((err) => {
	                console.log(err)
	            })
		    },
		    goEditRepair(id) {
		    	storageSet('repairStatus', this.selected)
		    	this.$router.push('/editUpdataStep1/'+ id)
		    },
		    goCaseProfit(id) {
		    	storageSet('repairStatus', '2')
		    	this.$router.push('/caseProfit/'+ id)
		    }
		},
		beforeRouteLeave(to, from, next) {
			if(this.show) {
				next(false)
				this.show = false
				return
			}
			next()
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
	.pop-product-item{
		
		padding: 0.3rem;
		border-bottom: 0.2rem solid #F5F5F9;
		background: #fff;
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
	.pop-product-amount{
		height: 1.4rem;
		display: flex;
		align-items: center;
		color: #bbb;
		justify-content: space-between;
	}
	.pop-product-amount .profit-btn{
		display: block;
		color: #666;
		border-radius: 0.06rem;
		border: 1px solid #666;
		padding: 0.12rem 0.25rem;
	}
	.updata-case-operate{
		height: 1rem;
		display: flex;
		line-height: 1rem;
		color: #999;
		justify-content: flex-end;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 top;
		background-size: auto 1px;
		margin: 0.4rem -0.3rem 0;
		padding: 0 0.3rem;
	}
	.updata-case-operate span{
		margin-left: 0.5rem;
		position: relative;
		padding-left: 0.46rem;
		vertical-align: middle;
	}
	.updata-case-operate span:before{
		content: '';
		position: absolute;
		width: 0.36rem;
		height: 0.36rem;
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
		left: 0;
		top: 50%;
		margin-top: -0.18rem;
	}
	.updata-case-operate span.edit:before{
		background-image: url(../../../static/image/share-1.png);
	}
	.updata-case-operate span.delete:before{
		background-image: url(../../../static/image/delete-2.png);
	}
	.failing-reason{
		color: #d30010;
		padding-top: 0.4rem;
		padding-left: 0.46rem;
		position: relative;
	}
	.failing-reason:before{
		content: '';
		position: absolute;
		width: 0.36rem;
		height: 0.36rem;
		background: url(../../../static/image/error.png) no-repeat center;
		background-size: 90%;
		left: 0;
		bottom: -0.04rem;
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