<template>
	<section>
		<top :title="titleText"></top>
		<div class="pop-product-list">
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
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import api from '@/fetch/api'
	export default {
		components: {
			top
		},
		data() {
			return {
				product_list:[],
				titleText:'',
				
				page: 1,
				page_size: 12,
				savePage: 1,
				
				scrollTop: 0
			}
		},
		created() {
//	    	this.initData()
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
	    	if(/productDetail/g.test(from.fullPath)) {
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
				this.product_kind = window.location.hash.split('/')[2]
				this.page = 1
		    	api.productList({
		        	params:{
					    id: this.product_kind,
					    page: this.page,
					    page_size: this.page_size
					}
			    }).then((res) => {
			    	this.titleText = res.data.result.cateName
			    	this.page++
		            this.product_list = res.data.result.list.data
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
		   			api.productList({
			        	params:{
						    id: this.product_kind,
						    page: this.page,
						    page_size: this.page_size
						}
				    }).then((res) => {
	   					if(res.data.result.list.data.length==0){
					      	this.$nextTick(() => {
							    this.$refs.scroller.finishInfinite(true)
							})	
							return
				        }
		            	this.product_list = this.product_list.concat(res.data.result.list.data)
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
</style>