<template>
	<section>
		<top title="评价列表"></top>
		<div class="pop-product-list">
			<scroller :on-infinite="infinite" ref="scroller">
				<div style="min-height: 1px;">
					<div v-for="(item, index) in comment_list" :key="index" class="pop-product-item">
						<div class="comment-user">
							<div class="pop-product-img">
								<img class="fullEle" :src="item.avatar" />
							</div>
							<div class="pop-product-desc">
								<p class="pop-product-name">{{item.nickName}}</p>
								<p class="pop-product-price">{{item.createTime}}</p>
							</div>
						</div>
						<div class="comment-text" v-html="item.comment">
							
						</div>	
					</div>
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
				comment_list:[],
				
				page: 1,
				page_size: 12
			}
		},
		created() {
	    	this.repair_id = window.location.hash.split('/')[2]
	    	api.repairShopComment({
	        	params:{
				    id: this.repair_id,
				    page: this.page,
				    page_size: this.page_size
				}
		    }).then((res) => {
		    	this.page++
	            this.comment_list = res.data.result.data
	            this.$nextTick(() => {
                	this.$refs.scroller.resize()
                	this.$refs.scroller.finishInfinite();
				})
	        }).catch((err) => {
	            console.log(err)
	        })
	    },
		mounted() {

		},
		methods: {
			infinite(){
		   		setTimeout(() => {
		   			api.repairShopComment({
			        	params:{
						    id: this.repair_id,
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
		            	this.comment_list = this.comment_list.concat(res.data.result.data)
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
		padding: 0.3rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	.comment-user{
		display: flex;
	}
	
	.pop-product-img {
		height: 0.9rem;
		width: 0.9rem;
		margin-right: 0.3rem;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.pop-product-desc {
		flex: 1;
		height: 0.9rem;
		display: flex;
		flex-direction: column;
		padding: 0.06rem 0;
	}
	
	.pop-product-name {
		flex: 1;
	}
	
	.pop-product-price {
		color: #999;
	}
	.comment-text{
		line-height: 1.5;
		padding-top: 0.2rem;
	}
</style>