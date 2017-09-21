<template>
	<section class="fullDiv">
		<top title="产品分类"></top>
		<section class="productKind-content">
			<div class="product-one-level">
				<scroller ref="oneLevelContent">
					<div class="one-level-item" 
						:class="currIndex == index ? 'active' : ''" 
						@click="selectProduct(index)" 
						v-for="(item, index) in productCate" 
						:key="index">
						{{item.name}}
					</div>
				</scroller>
					
				
			</div>
			<div class="product-next-level">
				<scroller ref="nextLevelContent">
					<div class="next-level-item" v-for="(item, index) in currProduct" :key="index">
						<p class="next-level-name">{{item.name}}</p>
						<div class="next-level-content">
							<router-link :to="'/productList/'+ obj.id" class="finial-level-item" v-for="(obj, key) in item.list" :key="key">
								<img :src="obj.icon" />
								<span>{{obj.name}}</span>
							</router-link>
						</div>
					</div>
				</scroller>
					
			</div>
		</section>
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
				productCate:[],
				productCate_id: 0,
				currProduct:[],
				currIndex: 0
			}
		},
		created() {
			this.productCate_id = window.location.hash.split('/')[2]
			api.productCate().then((res) => {
            	this.productCate = res.data.result
                if(this.productCate_id == 0) {
               		this.currProduct = res.data.result[0].list
                }else {
                	res.data.result.forEach((item, key) => {
                		if(item.id == this.productCate_id) {
                			this.currIndex = key
                			this.currProduct = res.data.result[key].list
                			return
                		}
                	})
                }
                this.$nextTick(() => {
				    this.$refs.oneLevelContent.resize()
                	this.$refs.nextLevelContent.resize()
				})
                
               
            }).catch((err) => {
                console.log(err)
            })
		},
		mounted() {

		},
		methods: {
			selectProduct(index) {
				this.currIndex = index
				this.currProduct = this.productCate[index].list
                this.$nextTick(() => {
                	this.$refs.nextLevelContent.resize()
				})
			}
		}
	}
</script>

<style scoped>
	.productKind-content {
		width: 100%;
		display: flex;
		background: #F5F5F9;
		position: absolute;
		left: 0;
		top: 0.9rem;
		bottom: 0;
	}
	
	.product-one-level {
		width: 1.9rem;
		background: #fff;
		overflow: hidden;
		position: relative;
	}
	
	.one-level-item {
		height: 1rem;
		text-align: center;
		line-height: 1rem;
		/*background: #fff;*/
		position: relative;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	
	.one-level-item.active {
		background: #F5F5F9;
		color: #39b382;
	}
	
	.product-next-level {
		position: relative;
		overflow: hidden;
		flex: 1;
		margin: 0 0.3rem;
	}
	
	.next-level-item {
		background: #fff;
		margin-top: 0.3rem;
	}
	
	.next-level-name {
		padding: 0.2rem 0;
		text-align: center;
	}
	
	.next-level-content {
		display: flex;
		flex-wrap: wrap;
		padding: 0.1rem;
	}
	
	.finial-level-item {
		width: 33.333333%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.1rem 0 0.2rem;
	}
	
	.finial-level-item img {
		width: 0.9rem;
		height: 0.9rem;
		margin-bottom: 0.15rem;
	}
	
	.finial-level-item span {
		font-size: 0.24rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>