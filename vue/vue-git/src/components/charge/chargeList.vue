<template>
	<section>
		<top title="积分兑换" :backStatus="false"></top>
		<div class="pop-product-list">
			<scroller :on-infinite="infinite" ref="scroller">
				<div style="min-height: 1px;">
					<router-link :to="'/chargeDetail/'+ item.id" class="pop-product-item" v-for="(item,index) in pointProductList" :key="index">
						<div class="pop-product-img">
							<img :src="item.imgs[0]" class="fullEle"  />
						</div>
						<div class="pop-product-desc">
							<p class="pop-product-name">{{item.name}}</p>
							<p class="pop-product-price"><span class="amount">{{item.point}}积分</span><span>参考价: &yen;{{Number(item.price).toFixed(2)}}</span></p>
						</div>
					</router-link>
				</div>
			</scroller>
		</div>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import api from '@/fetch/api'
	import { storageGet } from '../../../static/js/app.js'
	export default {
		components: {
			top
		},
		data() {
			return {
				pointProductList: [],
				
				page: 1,
				page_size: 12,
				savePage: 1,
				
				scrollTop: 0
			}
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
	    	if(/chargeDetail/g.test(from.fullPath)) {
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
		mounted() {

		},
		methods: {
			initData() {
				this.access_token = storageGet('access_token')
				this.page = 1
				this.$store.commit('setLoadingStatus', true)
				api.pointProductList({
		        	params:{
					    page: this.page,
					    page_size: this.page_size,
					    access_token: this.access_token
					}
			    }).then(res => {   
			    	this.$store.commit('setLoadingStatus', false)
			    	this.page++
		            this.pointProductList = res.data.result.data
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
		   			api.pointProductList({
			        	params:{
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
		            	this.pointProductList = this.pointProductList.concat(res.data.result.data)
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
		display: flex;
		color: #bbb;
		align-items: center;
		justify-content: space-between;
	}
	
	.pop-product-price .amount {
		color: #f26200;
		font-size: 0.32rem;
	}
</style>