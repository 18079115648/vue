<template>
	<section class="join-content">
		<top title="上传案例"></top>
		<div class="updata-content">
			<textarea class="case-detail-text" placeholder="请输入案例内容"></textarea>
			<div class="media-content">
				<div class="media-item add"></div>
			</div>
		</div>
		<div class="join-confirm-btn" @click="finishUpdata">完成</div>
		
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
			finishUpdata() {
				this.$router.push('/updataDetail')
			}
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
	.updata-content{
		padding: 0.3rem;
		background: #fff;
	}
	.case-detail-text{
		display: block;
		outline: none;
		border: 0;
		width: 100%;
		height: 2rem;
	}
	.media-content{
		padding: 0.4rem 0;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		margin: 0 -0.15rem;
	}
	.media-item.add{
		background: url(../../../static/image/add-icon.png) no-repeat center;
		background-size: 100% 100%;
	}
	.media-item{
		width: 1.5rem;
		height: 1.5rem;
		margin: 0.15rem;	
	}
	.join-confirm-btn{
		width: 6.9rem;
		margin: 1rem auto 0;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
	}
</style>