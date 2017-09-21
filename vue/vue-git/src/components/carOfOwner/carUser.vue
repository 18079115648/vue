<template>
	<section class="join-content">
		<top title="车主中心"></top>
		<section class="repair-user-content">
			<div class="repair-center-top">
				<div class="user-info">
					<router-link to="/carUserInfo">
						<div class="user-avatar">
							<img src=""  />
						</div>
						<div class="user-nick-name">
							哈哈哈
						</div>
					</router-link>
					
				</div>
				<div class="user-nav">
					<router-link to="/carUserIntegral" class="user-nav-item">
						<div class="nav-item-num"><span>12</span>分</div>
						<p>积分</p>
					</router-link>
					<router-link to="/myCoupon" class="user-nav-item">
						<div class="nav-item-num"><span>12</span>张</div>
						<p>优惠券</p>
					</router-link>
				</div>
			</div>
			<div class="repair-center-mid">
				<div class="user-link-item has-right-arror car-number">
					<span>我的车牌号</span>
					<span>1999积分</span>
				</div>
				<div class="user-link-item has-right-arror order">
					<span>消费订单</span>
				</div>
			</div>
			<div class="repair-center-mid">
				<div class="user-link-item tel">
					<span>客服热线</span>
					<span><a href="tel:18079115648">18079115648</a></span>
				</div>
				<div class="user-link-item has-right-arror about">
					<span>关于我们</span>
				</div>
			</div>
		</section>
		
	</section>

</template>

<script>
	import top from '../parts/header'
	export default {
		components: {
			top
		},
		data() {
			return {
				
			}
		},
		mounted() {

		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.join-content{
		position: absolute;
		width: 100%;
		height: 100%;
		background: #F5F5F9;
	}
	.repair-center-top{
		background: #fff;
	}
	.repair-center-top .user-info{
		background: url(../../../static/image/bg-2.png) no-repeat center;
		background-size: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.6rem;
		padding-bottom: 0.4rem;
	}
	.user-avatar{
		width: 1.3rem;
		height: 1.3rem;
		border-radius: 50%;
		overflow: hidden;
		border: 1px solid #61c29b;
	}
	.user-avatar img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.user-nick-name{
		color: #fff;
		padding-top: 0.3rem;
		text-align: center;
	}
	.user-nav{
		padding: 0.3rem 0;
		display: flex;
	}
	.user-nav-item{
		flex: 1;
		text-align: center;
	}
	.user-nav-item span{
		font-size: 0.44rem;
		margin-right: 0.1rem;
		color: #39B382;
	}
	.nav-item-num{
		margin-bottom: 0.2rem;
	}
	.repair-center-mid{
		margin: 0.4rem 0;
		background: #fff;
	}
	.user-link-item{
		padding: 0 0.3rem 0 0.9rem;
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
		left: 0.1rem;
		top: 50%;
		margin-top: -0.4rem;
	}
	.user-link-item.car-number:before{
		background-image: url(../../../static/image/car-number.png);
	}
	.user-link-item.order:before{
		background-image: url(../../../static/image/order.png);
	}
	.user-link-item.tel:before{
		background-image: url(../../../static/image/tel-icon.png);
	}
	.user-link-item.about:before{
		background-image: url(../../../static/image/about-icon.png);
	}
</style>