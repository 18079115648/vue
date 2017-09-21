<template>
	<section class="fullDiv">
		<top title="收入明细"></top>
		<section class="myIntegral-total">
			<div class="integral-num">
				<p class="integral"><i></i>80</p>
				<p class="tip">单价：150积分</p>
			</div>
		</section>
		<section class="myIntegral-list">
			<div class="myIntegral-list-item">
				<div class="integral-info">
					<p class="integral-tit">啊；拉的卡；老大；斗罗大陆</p>
					<p class="integral-time">2017</p>
				</div>
				<div class="exchange-num">
					+10
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
	.myIntegral-total{
		width: 100%;
		height: 3.2rem;
		position: relative;
		background-image: url(../../../static/image/bg-1.png);
		background-size: 100%;
		color: #fff;
	}
	.integral-num{
		position: absolute;
		width: 6.5rem;
		left: 0.5rem;
		top: 1.1rem;
		text-align: center;
	}
	.integral-num .integral{
		font-size: 1rem;
		padding-bottom: 0.3rem;
		position: relative;
	}
	.integral-num .integral i{
		display: inline-block;
		width: 0.3rem;
		height: 0.4rem;
		margin-right: 0.15rem;
		vertical-align: bottom;
		background: url(../../../static/image/interge-icon.png) no-repeat center;
		background-size: 100%;
		position: relative;
		bottom: 0.04rem;
	}
	.integral-num .tip{
		font-size: 0.28rem;
		color: #fefefe;
	}
	.charge-btn{
		position: absolute;
		background: #fff;
		color: #f39800;
		padding: 0.2rem 0.4rem;
		border-radius: 0.06rem;
		right: 0.7rem;
		bottom: 0.6rem;
	}
	.myIntegral-list-item{
		background: #fff;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		padding: 0.3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.integral-info>p{
		line-height: 2;
	}
	.integral-info>p.integral-time{
		color: #bbb;
	}
	.exchange-num{
		font-size: 0.32rem;
	}
</style>