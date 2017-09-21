<template>
	<section class="product-index">
		<header>
			<div class="back" @click="back"></div>
			<div class="search-input">
				<form action="#" onsubmit="return false">
					<input type="search" ref="Input" v-model.trim="key_word" @input="search_status = false" @keyup.enter="searchProduct" placeholder="案例关键字" />
				</form>
				
			</div>
			<div class="more-icon" @click="searchProduct">搜索</div>
		</header>
		<section class="search-history" v-show="!search_status && history_word.length>0">
			<div class="search-history-tit">
				<span class="tit">最近搜索</span>
				<span class="delete-icon" @click="delete_history"></span>
			</div>
			<div class="search-history-list">
				<span class="search-history-item" @click="searchHistory(value)" v-for="(value, index) in history_word" :key="index">
					{{value}}
				</span>
			</div>
		</section>
		<section class="data-none" v-show="!search_status && history_word.length<1">
			<img src="../../../static/image/none.png" class="fullEle" />
		</section>
		<section class="pop-product" v-show="search_status && rapair_list.length>0">
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
	        				<span class="user"><i><img :src="item.avatar" class="fullDiv" /></i>{{item.userName}}</span>
	        				<div class="assess-operate">
	        					<!--<span class="comment">评价</span>-->
	        					<span class="up" :class="item.praise ? 'active' : ''" @click="thumbUp(item)">点赞({{item.praiseCount}})</span>
	        				</div>
	        			</div>
	        		</div>
	        	</div>
        	</scroller>
        </section>
		<section class="data-none" v-show="search_status && rapair_list.length<1 ">
			<p style="margin: 0 -2rem 0.8rem; text-align: center; color: #999;">没有搜索到你想要的案例！</p>
			<img src="../../../static/image/none.png" class="fullEle" />
		</section>
		<confirm-modal 
			:show="showModal" 
			@cancel_modal="cancel_modal_second" 
			@confirm_modal="confirm_modal_second" 
			@closeModal="showModal = false" 
			cancel_text="取消"
			confirm_text="确认"
			has_icon="success"
			:message="messageText">
		</confirm-modal>
		<confirm-modal :show="show" @cancel_modal="cancel_modal" @confirm_modal="confirm_modal" @closeModal="show = false" message="确定删除历史记录?"></confirm-modal>
	</section>
</template>

<script>
	import axios from 'axios'
	import {SecondAutho, storageSet, storageGet, storageRemove, markTime } from '../../../static/js/app.js'
	import confirmModal from '../parts/confirmModal'
	import { Toast } from 'mint-ui'
	import api from '@/fetch/api'
	import qs from 'qs'
	export default {
		components: {
			confirmModal
		},
		data() {
			return {
				show: false,
				showModal: false,
				messageText: '',
				currRepairId: undefined,
				currRepair: {},
				key_word: '',
				search_status: false,
				rapair_list:[],
				history_word:[],
				access_token: '',
				
				page: 1,
				page_size: 12,
				savePage: 1
			}
		},
		methods: {
			searchProduct() {
				
				if(!this.key_word) {
					Toast({
					  message: '请输入要搜索的内容',
					  position: 'bottom',
					  duration: 1500
					});
					return
				}
				this.page = 1
				document.activeElement.blur();
				api.repairSearch({
		        	params:{
					    keyword: this.key_word,
					    page: this.page,
				    	page_size: this.page_size,
				    	access_token: this.access_token
					}
			    }).then((res) => {
			    	this.page++
			    	var flag = true
			    	this.history_word.forEach((value) => {
			    		console.log(value.trim())
			    		if(value == this.key_word.trim()) {
			    			flag = false
			    			return
			    		}
			    	})
			    	if(flag) {
			    		this.history_word.push(this.key_word)
			    		storageSet('repair_history_word',JSON.stringify(this.history_word))
			    	}
			    	this.search_status = true
		            this.rapair_list = res.data.result.data
		            this.$nextTick(() => {
	                	this.$refs.scroller.resize()
	                	this.$refs.scroller.finishInfinite();
					})
		        }).catch((err) => {
		            console.log(err)
		        })
			},
			infinite(){
		   		setTimeout(() => {
		   			api.repairSearch({
			        	params:{
						    keyword: this.key_word,
						    page: this.page,
					    	page_size: this.page_size,
					    	access_token: this.access_token
						}
				    }).then((res) => {
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
	                console.log(err)
	            })
		    },
			searchHistory(value) {
				this.key_word = value
				this.searchProduct()
			},
			delete_history() {
				this.show = true

			},
			back() {
				this.$router.go(-1)
			},
			cancel_modal() {
				this.show = false
			},
			confirm_modal() {
				this.history_word = []
				storageRemove('repair_history_word')
				Toast({
				  message: '删除成功',
				  position: 'bottom',
				  duration: 1000
				});
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
					this.showModal = true
				}
			},
			cancel_modal_second() {
		  		console.log('取消')
		  	},
		  	confirm_modal_second() {
		  		this.buyRepairCase()
		  	},
		    buyRepairCase() {
	            api.repairBuy(this.access_token, qs.stringify({
					id: this.currRepairId
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
		    initData() {
		    	var history_word = storageGet('repair_history_word')
				if(history_word == null || history_word == '') {
					return
				}
				this.history_word = JSON.parse(storageGet('repair_history_word'))
		    }
		},
		
		created() {
			this.markTime = markTime
			this.access_token = storageGet('access_token')
//			this.initData()
		},
		mounted() {
			
			this.$refs.Input.focus()
		},
		deactivated(){
	    	this.savePage=this.page
	    	this.page=100000
	    },
		activated() {
			this.page = this.savePage
	    	this.$refs.scroller.resize()
	    },
	    beforeRouteEnter (to, from, next) {
	    	if(/repairDetail/g.test(from.fullPath)) {
	    		next()
	    	}else {
	    		next(vm=>{
	    			vm.initData()
	    			vm.key_word = ''
	    			vm.$refs.Input.focus()
	            	vm.search_status = false
	        	})
	    	}
	    	
	    	
		},
		beforeRouteLeave(to, from, next) {
			if(this.show || this.showModal) {
				this.show = false
				next(false)
				return
			}
			next()
		}
	}
</script>

<style scoped>
	.product-index {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.product-index-content {
		position: absolute;
		left: 0;
		right: 0;
		top: 0.9rem;
		bottom: 0;
		overflow-y: auto;
	}
	
	header {
		height: 0.9rem;
		/*background: #333;*/
		display: flex;
		padding: 0.2rem 0.3rem;
		line-height: 0.5rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	
	.back {
		position: relative;
		left: -0.06rem;
		width: 0.5rem;
		height: 0.5rem;
		background: url(../../../static/image/left-arror.png) center no-repeat;
		background-size: 40%;
	}
	
	.search-input {
		margin: 0 0.3rem;
		flex: 1;
		border-radius: 0.08rem;
		background: #f7f7f7;
		color: #999;
		position: relative;
	}
	
	.search-input input[type=search] {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		vertical-align: middle;
		background: #f7f7f7;
		color: #333;
		padding-left: 0.15rem;
		-webkit-appearance: none;
		appearance: none;
		-webkit-tap-highlight-color: rgba(0,0,0,0)
	}
	input::-webkit-search-cancel-button{
	  display: none;
	}
	
	.more-icon {
		color: #fff;
		padding: 0 0.15rem;
		background: #f26200;
		border-radius: 0.08rem;
	}
	
	.search-history-tit {
		padding: 0.3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.search-history-tit .tit {
		font-size: 0.30rem;
	}
	
	.delete-icon {
		width: 0.5rem;
		height: 0.5rem;
		background: url(../../../static/image/delete.png) no-repeat center;
		background-size: 80%;
	}
	
	.search-history-list {
		padding-left: 0.3rem;
	}
	
	.search-history-list .search-history-item {
		display: inline-block;
		background: #F7F7F7;
		padding: 0.1rem 0.3rem;
		border-radius: 0.06rem;
		margin-right: 0.3rem;
		margin-bottom: 0.2rem;
	}
	
	.pop-product{
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
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
	.data-none{
		width: 2.5rem;
		margin: 0.8rem auto;
	}
</style>