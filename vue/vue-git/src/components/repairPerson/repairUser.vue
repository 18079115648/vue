<template>
	<section class="join-content">
		<top title="修理工中心" :backStatus="false"></top>
		<section class="repair-user-content">
			<div class="repair-center-top">
				<router-link to="/repairUserInfo" class="user-info">
					<img :src="userData.avatar"  />
					<div class="user-message">
						<p >{{userData.nickname}}</p>
						<p class="mess">
							<span v-if="userData.type == 1">修理工</span>
							<span v-if="userData.type == 2">车主</span>
							<span>{{userData.mobile}}</span>
						</p>
					</div>
				</router-link>
				<div class="user-nav">
					<router-link to="/buyRepairList" class="user-nav-item">
						<div class="nav-item-icon case"></div>
						<p>已购案例</p>
					</router-link>
					<router-link to="/myActivityList" class="user-nav-item">
						<div class="nav-item-icon activity"></div>
						<p>活动</p>
					</router-link>
					<router-link to="/myOrders" class="user-nav-item">
						<div class="nav-item-icon  orders"></div>
						<p>商品订单</p>
					</router-link>
					<router-link to="/user/puzzle" class="user-nav-item">
						<div class="nav-item-icon part"></div>
						<p>碎片</p>
					</router-link>
				</div>
			</div>
			<div class="repair-center-mid">
				<router-link to="myIntegral" class="user-link-item has-right-arror inter">
					<span>我的积分</span>
					<span>{{userData.points}}积分</span>
				</router-link>
				<div @click="goAllUpdataCase" class="user-link-item has-right-arror updata">
					<span>上传案例</span>
					<span>{{userData.caseCount}}个</span>
				</div>
				<router-link to="myCoupon" class="user-link-item has-right-arror coupon">
					<span>优惠券</span>
					<span>{{userData.couponCount}}张</span>
				</router-link>
				<div @click="goMyCarNumber" class="user-link-item has-right-arror car-number">
					<span>我的车牌号</span>
					<span>{{userData.licenseNum}}</span>
				</div>
				<router-link to="consumerOrders" class="user-link-item has-right-arror order" style="align-items: center;">
					<span>消费订单</span>
					<span v-if="userData.notCommentNum>0" class="comment-tip">{{userData.notCommentNum}}单待评价</span>
				</router-link>
			</div>
			<div class="repair-center-mid">
				<div class="user-link-item tel">
					<span>客服热线</span>
					<span><a style="display: block; height: 100%;" :href="'tel:'+userData.service_tel">{{userData.service_tel}}</a></span>
				</div>
				<router-link to="/user/about" class="user-link-item has-right-arror about">
					<span>关于我们</span>
				</router-link>
			</div>
		</section>
		
	</section>

</template>

<script>
	import top from '../parts/header'
	import {storageSet, storageGet, SecondAutho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	export default {
		components: {
			top
		},
		data() {
			return {
				access_token: '',
				userData:{}
			}
		},
	    created() {
	    	if(!SecondAutho('#/repairUser')) {
	    		return
	    	}
			this.access_token = storageGet('access_token')
			this.$store.commit('setLoadingStatus', true)
	    	api.userCenter({
	        	params:{
				    access_token: this.access_token
				}
		    }).then((res) => {
		    	this.$store.commit('setLoadingStatus', false)
                this.userData = res.data.result
            })
            .catch((error) => {
                this.$store.commit('setLoadingStatus', false)
            })
		},
		mounted() {
			
		},
		methods: {
			goAllUpdataCase() {
				storageSet('repairStatus', '1')
				this.$router.push('/allUpdataCase')
			},
			goMyCarNumber() {
				if(this.userData.licenseNum) {
					storageSet('lastCarNumber', this.userData.licenseNum)
				}
				this.$router.push('/myCarNumber')
			}
		}
	}
</script>

<style scoped>
	.join-content{
		position: absolute;
		width: 100%;
		min-height: 100%;
		background: #F5F5F9;
		left: 0;
		top: 0;
		padding-top: 0.9rem;
	}
	.repair-user-content{
		padding-top: 0.4rem;
	}
	.repair-center-top{
		background: #fff;
	}
	.repair-center-top .user-info{
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.3rem;
	}
	.user-info img{
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		margin-right: 0.3rem;
	}
	.user-message{
		flex: 1;
	}
	.user-message p{
		line-height: 1.5;
	}
	.user-message p.mess{
		font-size: 0.24rem;
		color: #999;
		padding-top: 0.14rem;
	}
	.user-nav{
		padding: 0.3rem 0;
		display: flex;
	}
	.user-nav-item{
		flex: 1;
		text-align: center;
	}
	.nav-item-icon{
		display: inline-block;
		width: 0.4rem;
		height: 0.6rem;
		margin-bottom: 0.15rem;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}
	.nav-item-icon.part{
		background-image: url(../../../static/image/part-icon.png);
	}
	.nav-item-icon.activity{
		background-image: url(../../../static/image/activity-icon.png);
	}
	.nav-item-icon.orders{
		background-image: url(../../../static/image/order-icon.png);
	}
	.nav-item-icon.case{
		background-image: url(../../../static/image/case-icon.png);
	}
	
	.repair-center-mid{
		margin: 0.4rem 0;
		background: #fff;
	}
	.user-link-item{
		padding: 0 0.3rem 0 1rem;
		height: 0.9rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		line-height: 0.9rem;
		display: flex;
		justify-content: space-between;
		position: relative;
	}
	.user-link-item.has-right-arror{
		padding-right: 0.7rem;
	}
	.user-link-item:before{
		content: '';
		position: absolute;
		width: 0.8rem;
		height: 0.8rem;
		background-size: 45%;
		background-position: center;
		background-repeat: no-repeat;
		left: 0.2rem;
		top: 50%;
		margin-top: -0.4rem;
	}
	.user-link-item.inter:before{
		background-image: url(../../../static/image/inter-icon.png);
	}
	.user-link-item.coupon:before{
		background-image: url(../../../static/image/coupon-icon.png);
		background-size: 50%;
	}
	.user-link-item.updata:before{
		background-image: url(../../../static/image/updata-icon.png);
	}
	.user-link-item.tel:before{
		background-image: url(../../../static/image/tel-icon.png);
	}
	.user-link-item.about:before{
		background-image: url(../../../static/image/about-icon.png);
	}
	.user-link-item.car-number:before{
		background-image: url(../../../static/image/car-number.png);
	}
	.user-link-item.order:before{
		background-image: url(../../../static/image/order.png);
	}
	.comment-tip{
		font-size: 0.24rem;
		color: #fff;
		background: #F41626;
		height: 0.5rem;
		line-height: 0.5rem;
		padding: 0 0.08rem;
		vertical-align: middle;
		border-radius: 0.06rem;
	}
</style>