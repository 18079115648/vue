<template>
	<section class="product-index">
		<header>
			<div class="search-input" @click="toSearch">搜索你要的商品</div>
			<router-link class="more-icon" to="/productSearch"></router-link>
		</header>
		<section class="product-index-content">
			<scroller ref="scroller">
				<section class="product-banner">
					<mt-swipe :auto="0">
						<mt-swipe-item v-for="(item, index) in homeData.banner" :key="index">
							<a :href="item.href" class="fullEle">
								<img class="fullEle" :src="item.picture" />
							</a>
						</mt-swipe-item>
					</mt-swipe>
				</section>
				<section class="product-nav">
					<router-link :to="'/productKind/'+item.id" class="nav-item" v-for="(item, index) in productCate.slice(0,3)" :key="index">
						<div class="nav-item-img">
							<img :src="item.icon" class="fullEle" />
						</div>
						<p>{{item.name}}</p>
					</router-link>
					<router-link to="/productKind/0" class="nav-item">
						<div class="nav-item-img">
							<img src="../../../static/image/more-icon.png" class="fullEle" />
						</div>
						<p>更多</p>
					</router-link>
				</section>
				<section class="new-product">
					<div class="new-product-tit">
						<span class="tit">新品推荐</span>
						<span class="tip">滑动查看更多</span>
					</div>
					<div class="new-product-content swiper-container" ref="mainSwiper">
						<ul class="swiper-wrapper">
							<li class="swiper-slide new-product-item" v-for="(item, index) in homeData.new" :key="index">
								<router-link :to="'/productDetail/'+item.id" class="fullEle">
									<div class="new-product-img">
										<img class="fullEle" :src="item.imgs[0]" />
									</div>
									<p class="new-product-name" v-html="item.name"></p>
									<p class="new-product-price">&yen; {{Number(item.price).toFixed(2)}}</p>
								</router-link>
							</li>
						</ul>
					</div>

				</section>
				<section class="pop-product">
					<div class="pop-product-tit">
						<div class="tit"><span class="pop-icon"></span>热销爆款</div>
					</div>
					<div class="pop-product-list">
						<router-link :to="'/productDetail/'+item.id" v-for="(item, index) in homeData.hot" :key="index" class="pop-product-item fullEle">
							<div class="pop-product-img">
								<img class="fullEle" :src="item.imgs[0]" />
							</div>
							<div class="pop-product-desc">
								<p class="pop-product-name" v-html="item.name"></p>
								<p class="pop-product-price">&yen; {{Number(item.price).toFixed(2)}}</p>
							</div>
						</router-link>
					</div>
				</section>
			</scroller>

		</section>

	</section>
</template>

<script>
	import axios from 'axios'
	import $ from 'jquery'
	import Swiper from '@/../static/swiper.min.js'
	require('@/../static/swiper.min.css')
	import api from '@/fetch/api'
	import { storageGet } from '../../../static/js/app.js'
	export default {
		data() {
				return {
					homeData: {},
					productCate: [],
					scrollTop: 0
				}
			},
			created() {
//				this.initData()
				
			},
			mounted() {
				

			},
			methods: {
				initData() {
					this.access_token = storageGet('access_token')
					this.$store.commit('setLoadingStatus', true)
					api.homeIndex({
			        	params:{
						    access_token: this.access_token
						}
				    }).then((res) => {
						this.$store.commit('setLoadingStatus', false)
						this.homeData = res.data.result
						this.$nextTick(() => {
							this.$refs.scroller.resize()
							this.mySwiper = new Swiper(this.$refs.mainSwiper, {
								loop: true,
								observer: true, //修改swiper自己或子元素时，自动初始化swiper
								observeParents: true,
								slidesPerView: 3
							})
						})
					}).catch((err) => {
						this.$store.commit('setLoadingStatus', false)
					})
					api.productCate().then((res) => {
						this.productCate = res.data.result
						this.$nextTick(() => {
							
							this.$refs.scroller.resize()
						})
					}).catch((err) => {
						console.log(err)
					})
				},
				toSearch() {
					this.$router.push('/productSearch')
				}
			},
			activated() {
		    	this.$refs.scroller.resize()
		    	this.$refs.scroller.scrollTo(0,this.scrollTop,false)
		    },
			beforeRouteEnter (to, from, next) {
		    	if(/productDetail/g.test(from.fullPath) || /productKind/g.test(from.fullPath) || /productSearch/g.test(from.fullPath)) {
		    		next(vm=>{
		    			if(vm.productCate.length<1) {
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
		overflow: hidden;
	}
	
	header {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		height: 0.9rem;
		background: #333;
		display: flex;
		padding: 0.2rem 0.3rem;
		justify-content: space-between;
		line-height: 0.5rem;
		background: #39B382;
		z-index: 10;
	}
	
	.search-input {
		width: 6rem;
		border-radius: 0.06rem;
		background: #fff;
		color: #999;
		padding-left: 0.7rem;
		position: relative;
	}
	
	.search-input:before {
		position: absolute;
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		left: 0.1rem;
		top: 0;
		background: url(../../../static/image/search-icon.png) no-repeat center;
		background-size: 60%;
	}
	
	.more-icon {
		width: 0.5rem;
		background: url(../../../static/image/more.png) no-repeat center;
		background-size: 100%;
	}
	
	.product-banner {
		height: 3rem;
	}
	
	.product-nav {
		padding: 0.25rem 0;
		display: flex;
		border-bottom: 0.2rem solid #F5F5F9;
	}
	
	.nav-item {
		flex: 1;
		text-align: center;
	}
	
	.nav-item-img {
		display: inline-block;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 0.1rem;
	}
	
	.new-product-tit {
		padding: 0 0.2rem;
		height: 0.8rem;
		line-height: 0.8rem;
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.1rem;
	}
	
	.new-product-tit .tit {
		color: #f41626;
		font-size: 0.3rem;
		font-weight: bold;
		padding-left: 0.5rem;
		position: relative;
	}
	
	.new-product-tit .tit:before {
		content: '';
		position: absolute;
		width: 0.4rem;
		height: 0.4rem;
		left: 0;
		top: 50%;
		margin-top: -0.2rem;
		background: url(../../../static/image/hot-icon.png) no-repeat center;
		background-size: 100%;
	}
	
	.new-product-content {
		height: 3.5rem;
	}
	
	.new-product-item {
		padding: 0 0.2rem;
	}
	
	.new-product-img {
		width: 2.1rem;
		height: 2.1rem;
	}
	
	.new-product-name {
		line-height: 1.2;
		margin-top: 0.1rem;
		height: 0.64rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.new-product-price {
		color: #f26200;
		padding-top: 0.1rem;
	}
	
	.pop-product-tit {
		height: 0.8rem;
		background: #f5f5f9;
		line-height: 0.8rem;
		text-align: center;
	}
	
	.pop-product-tit .tit {
		display: inline-block;
		height: 100%;
		color: #ffad06;
		font-size: 0.3rem;
		position: relative;
		padding-left: 0.46rem;
	}
	
	.pop-product-tit .tit:after {
		content: '';
		width: 0.5rem;
		height: 0;
		border-bottom: 1px solid #ffad06;
		position: absolute;
		right: -0.8rem;
		top: 48%;
	}
	
	.pop-product-tit .tit:before {
		content: '';
		width: 0.5rem;
		height: 0;
		border-bottom: 1px solid #ffad06;
		position: absolute;
		left: -0.8rem;
		top: 48%;
	}
	
	.pop-icon {
		position: absolute;
		width: 0.36rem;
		height: 0.36rem;
		background: url(../../../static/image/pop-icon.png) no-repeat center;
		background-size: 100%;
		left: 0;
		top: 50%;
		margin-top: -0.18rem;
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
	}
</style>