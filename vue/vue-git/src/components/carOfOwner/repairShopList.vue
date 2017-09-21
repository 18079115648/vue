<template>
	<section class="fullDiv">
		<top class="special-top" title="修理店" :backStatus="false"></top>
		<section class="pop-product">
			<div class="repair-case-select">
				<span @click="showSelectPop" :class="{active: showSelect}" >{{default_dis_text}}<i></i></span>
				<span @click="showSortPop" :class="{active: showkind}">{{default_sort_text}}<i></i></span>
			</div>
        	<div class="repair-shop-list">
        		<scroller :on-infinite="infinite" ref="scroller">
		        	<div style="min-height: 1px;">
		        		<div class="repair-shop-item" v-for="(item,index) in repair_shop_list" >
		        			<router-link :to="'/repairShopDetail/'+ item.id">
		        				<img :src="item.imgs[0]"  />
			        			<div class="repair-shop-info">
			        				<p class="name">{{item.name}}</p>
			        				<p class="level">
			        					<span class="active" v-for="n in item.star"></span>
			        					<span v-for="n in 5-item.star"></span>
			        				</p>
			        				<p class="profit-num" v-if="item.couponNum>0">优惠券：{{item.couponNum}}</p>
			        				<p class="distance" v-if="item.distance != -1">距离：{{item.distance}}km</p>
			        				<p class="distance" v-if="item.distance == -1">距离：未知</p>
			        			</div>
		        			</router-link>
		        			<!--<a href="http://api.map.baidu.com/direction?origin=latlng:34.264642646862,108.95108518068|name:我家&destination=大雁塔&mode=driving&region=西安&output=html&src=yourCompanyName|yourAppName" class="navigation"></a>-->
		        			<div class="navigation" @click="goMap(item.latitude, item.longitude)">
		        				<span>去这里</span>
		        			</div>
		        		</div>
		        	</div>
	        	</scroller>
        	</div>
        	<mt-popup v-model="showSelect" class="pop-detail" position="top">
		      	<div class="diatance-content">
		      		<div class="distance-item" @click="selectDistance(item,index)" :class="index == default_dis ? 'active' : ''" v-for="(item, index) in distance_kind" :key="index">{{item.text}}</div>
		      	</div>
		    </mt-popup>
		    <mt-popup v-model="showkind" class="pop-detail" position="top">
		      	<div class="diatance-content">
		      		<div class="distance-item" @click="selectSort(obj,key)" :class="key == default_sort ? 'active' : ''" v-for="(obj, key) in sort_kind" :key="key">{{obj.text}}</div>
		      	</div>
		    </mt-popup>
        </section>
	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import { storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import BMap from 'BMap'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			'top': top
		},
		data() {
			return {
				showSelect: false,
				distance_kind:[{
					text:'1km',
					value:1
				},{
					text:'2km',
					value:2
				},{
					text:'5km',
					value:5
				},{
					text:'10km',
					value:10
				},{
					text:'全部',
					value:null
				}],
				default_dis: 4,
				default_dis_text:'附近',
				
				showkind: false,
				sort_kind:[{
					text:'离我最近',
					value:1
				},{
					text:'评分最高',
					value:2
				},{
					text:'优惠活动',
					value:3
				}],
				default_sort: 0,
				default_sort_text:'离我最近',
				
				lng: undefined,
				lat: undefined,
				distance: undefined,
				sort: 1,
				
				accecc_token: '',
				repair_shop_list: [],
				
				page: 1,
				page_size: 12,
				savePage: 1,
				
				scrollTop: 0
				
				
			}
		},
		created() {
			
		},
		mounted() {
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
	    	if(/repairShopDetail/g.test(from.fullPath) || /baiduMap/g.test(from.fullPath)) {
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
		methods: {
			initData() {
				this.$store.commit('setLoadingStatus', true)
				this.access_token = storageGet('access_token')
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition((r) => {
					console.log(r)
					if(r.point.lng == 0 && r.point.lat == 0) {
						this.$store.commit('setLoadingStatus', false)
						Toast({
						  message: '获取位置信息失败',
						  position: 'bottom',
						  duration: 2000
						});
						return
					}
					this.lng = r.point.lng
					this.lat = r.point.lat
					this.page = 1
					this.getRepairShop()
				})
			},
			getRepairShop() {
				api.repairShopList({
		        	params:{
		        		distance: this.distance,
		        		latitude: this.lat,
		        		longitude: this.lng,
		        		sort: this.sort,
					    access_token: this.access_token,
					    page: this.page,
				    	page_size: this.page_size
					}
			    }).then(res => {  
			    	this.$store.commit('setLoadingStatus', false)
			    	this.page++
					this.repair_shop_list = res.data.result.data
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
		   			api.repairShopList({
			        	params:{
			        		distance: this.distance,
			        		latitude: this.lat,
			        		longitude: this.lng,
			        		sort: this.sort,
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
		            	this.repair_shop_list = this.repair_shop_list.concat(res.data.result.data)
		            	this.page++ 
					    this.$nextTick(() => {
					    	this.$refs.scroller.finishInfinite();
				        })
			        }, err => {
						this.$refs.scroller.finishInfinite(true)
			        })
		   			   
					  
		        }, 400)
		 	},
			goMap(lat, lng) {
				this.$router.push('/baiduMap/'+ lat +'/'+ lng)
			},
			showSelectPop() {
				this.showSelect = !this.showSelect
				this.showkind = false
			},
			selectDistance(item,index) {
				this.default_dis = index
				this.default_dis_text = item.text
				var timer = setTimeout(() => {
					clearTimeout(timer)
					this.showSelect = false
				},100)
				this.distance = item.value
				this.page = 1
				this.getRepairShop()
			},
			showSortPop() {
				this.showkind = !this.showkind
				this.showSelect = false
			},
			selectSort(item,index) {
				this.default_sort = index
				this.default_sort_text = item.text
				var timer = setTimeout(() => {
					clearTimeout(timer)
					this.showkind = false
				},100)
				this.sort = item.value
				this.page = 1
				this.getRepairShop()
			}
		}
	}
</script>

<style scoped>
	.special-top{
		position: relative !important;
		z-index: 2500;
	}
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
		background: #fff;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		position: relative;
		z-index: 2500;
	}
	.repair-case-select span{
		flex: 1;
		padding-left: 0.4rem;
		line-height: 0.5rem;
		border-right: 1px solid #eee;
		position: relative;
		right: -1px;
		
	}
	/*.repair-case-select span.active{
		background: #eee;
	}*/
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
	.repair-shop-list{
		background: #fff;
		position: absolute;
		width: 100%;
		left: 0;
		top: 0.9rem;
		right: 0;
		bottom: 0;
	}
	.repair-shop-item{
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.3rem;
	}
	.repair-shop-item>a{
		width: 5.8rem;
		display: flex;
	}
	.repair-shop-item img{
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 0.3rem;
	}
	.repair-shop-info{
		width: 4rem;
	}
	.repair-shop-info p{
		padding: 0.06rem 0;
		font-size: 0.24rem;
	}
	.repair-shop-info p.name{
		font-size: 0.28rem;
	}
	.repair-shop-info p.level{
		display: flex;
	}
	.repair-shop-info p.level span{
		width: 0.28rem;
		height: 0.28rem;
		margin-right: 0.06rem;
		background: url(../../../static/image/no-levle.png) no-repeat center;
		background-size: 100%;
	}
	.repair-shop-info p.level span.active{
		background-image: url(../../../static/image/has-levle.png);
	}
	.navigation{
		flex: 1;
		text-align: center;
		padding-top: 0.8rem;
		position: relative;
		
	}
	.navigation span{
		color: #999999;
		font-size: 0.24rem;
	}
	.navigation:before{
		position: absolute;
		content: '';
		width: 0.4rem;
		height: 0.4rem;
		background: url(../../../static/image/navi-icon.png) no-repeat center;
		background-size: auto 100%;
		left: 50%;
		margin-left: -0.2rem;
		top: 0.3rem;
	}
	.profit-num{
		color: #f39800;
	}
	.distance{
		color: #999;
	}
	.pop-detail{
		width: 100%;
		transition-duration: 0.1s !important;
		top: 1.8rem !important;
	}
	.distance-item{
		height: 0.76rem;
		padding-left: 0.4rem;
		line-height: 0.76rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	.distance-item.active{
		background: #eee;
		
	}
</style>