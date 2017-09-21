<template>
	<section class="product-index">
		<header>
			<div class="back" @click="back"></div>
			<div class="search-input">
				<form action="#" onsubmit="return false">
					<input ref="Input" type="search" v-model.trim="key_word" @input="search_status = false" @keyup.enter="searchProduct" placeholder="商品名称" />
				</form>
				
			</div>
			<div class="more-icon" @click="searchProduct">搜索</div>
		</header>
		<section class="search-history" v-show="!search_status">
			<div class="search-history-tit" v-show="!search_status && history_word.length>0">
				<span class="tit">最近搜索</span>
				<span class="delete-icon" @click="delete_history"></span>
			</div>
			<div class="search-history-list" v-show="!search_status && history_word.length>0">
				<span class="search-history-item" @click="searchHistory(value)" v-for="(value, index) in history_word" :key="index">
					{{value}}
				</span>
			</div>
			<div class="search-history-tit" style="padding-top: 0.6rem;" v-show="hot_word.length>0">
				<span class="tit">热门商品</span>
			</div>
			<div class="search-history-list" v-show="hot_word.length>0">
				<span class="search-history-item" @click="searchHistory(value)" v-for="(value, index) in hot_word" :key="index">
					{{value}}
				</span>
			</div>
		</section>
		<!--<section class="data-none" v-show="!search_status && history_word.length<1">
			<img src="../../../static/image/none.png" class="fullEle" />
		</section>-->
		<div class="pop-product-list" v-show="search_status && product_list.length>0">
			<scroller :on-infinite="infinite" ref="scroller">
				<div style="min-height: 1px;">
					<router-link :to="'/productDetail/'+ item.id" v-for="(item, index) in product_list" :key="index" class="pop-product-item">
						<div class="pop-product-img">
							<img class="fullEle" :src="item.imgs[0]" />
						</div>
						<div class="pop-product-desc">
							<p class="pop-product-name">{{item.name}}</p>
							<p class="pop-product-price">&yen; {{Number(item.price).toFixed(2)}}</p>
						</div>
					</router-link>
				</div>
			</scroller>
				
		</div>
		<section class="data-none" v-show="search_status && product_list.length<1 ">
			<p style="margin: 0 -2rem 0.8rem; text-align: center; color: #999;">没有搜索到你想要的商品！</p>
			<img src="../../../static/image/none.png" class="fullEle" />
		</section>
		<confirm-modal :show="show" @cancel_modal="cancel_modal" @confirm_modal="confirm_modal" @closeModal="show = false" message="确定删除历史记录?"></confirm-modal>
	</section>
</template>

<script>
	import axios from 'axios'
	import { storageSet, storageGet, storageRemove } from '../../../static/js/app.js'
	import confirmModal from '../parts/confirmModal'
	import { Toast } from 'mint-ui'
	import api from '@/fetch/api'
	export default {
		components: {
			confirmModal
		},
		data() {
			return {
				show: false,
				key_word: '',
				search_status: false,
				product_list:[],
				history_word:[],
				hot_word: [],
				
				page: 1,
				page_size: 12,
				savePage: 1
			}
		},
		methods: {
			infinite(){
		   		setTimeout(() => {
		   			api.productSearch({
			        	params:{
						    keyword: this.key_word,
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
		            	this.product_list = this.product_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	},
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
				this.getProductSearch()
				
			},
			getProductSearch() {
				api.productSearch({
		        	params:{
					    keyword: this.key_word,
					    page: this.page,
					    page_size: this.page_size
					}
			    }).then((res) => {
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
			    		storageSet('history_word',JSON.stringify(this.history_word))
			    	}
			    	this.page++ 
			    	this.search_status = true
		            this.product_list = res.data.result.data
		            this.$nextTick(() => {
		            	this.$refs.scroller.scrollTo(0,0,false)
	                	this.$refs.scroller.resize()
	                	this.$refs.scroller.finishInfinite();
					})
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
				storageRemove('history_word')
				Toast({
				  message: '删除成功',
				  position: 'bottom',
				  duration: 1000
				});
			},
			initData() {
				api.productHotkey().then((res) => {
					this.hot_word = res.data.result
		        }, err => {
		       	
		        })
				var history_word = storageGet('history_word')
				if(history_word == null || history_word == '') {
					this.history_word = []
				}else {
					this.history_word = JSON.parse(storageGet('history_word'))
				}
			}
		},
		created() {
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
	    	if(/productDetail/g.test(from.fullPath)) {
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
			if(this.show) {
				this.show = false
				next(false)
				return
			}else {
				next()
			}
			
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
	
	.pop-product-list {
		position: absolute;
		left: 0;
		right: 0;
		top: 0.9rem;
		bottom: 0;
		-webkit-overflow-scrolling: touch;
		z-index: 1;
		overflow-y: auto;
	}
	
	.pop-product-item {
		display: flex;
		padding: 0.3rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	
	.pop-product-img {
		height: 1.5rem;
		width: 1.5rem;
		background: #ddd;
		margin-right: 0.3rem;
	}
	
	.pop-product-desc {
		flex: 1;
		height: 1.5rem;
		display: flex;
		flex-direction: column;
		padding: 0.1rem 0;
	}
	
	.pop-product-name {
		flex: 1;
	}
	
	.pop-product-price {
		color: #f26200;
		font-size: 0.32rem;
	}
	.data-none{
		width: 2.5rem;
		margin: 0.8rem auto;
	}
</style>