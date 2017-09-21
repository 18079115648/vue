<template>
	<transition name="move">
		<section class="fullDiv move-right">
			<top title="修改门店"></top>
			<section class="content">
				<input type="text"  v-model.trim="store_name" @keyup.enter="keepNickName" placeholder="门店" />
			</section>
			<div class="save" @click="keepNickName">保存</div>
			
		</section>
	</transition>

</template>

<script>
	import top from '../parts/header'
	import { storageGet, Autho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top
		},
		data() {
			return {
				store_name: ''
			}
		},
		mounted() {

		},
		created() {
			this.store_name = storageGet('lastUserStore')
			this.access_token = storageGet('access_token')
		},
		methods: {
			keepNickName() {
				if(!this.store_name) {
					Toast({
					  message: '请输入您的门店新名称',
					  position: 'bottom',
					  duration: 1000
					})
					return
				}
				this.$store.commit('setLoadingStatus', true)
				api.chargeUserStore(this.access_token,qs.stringify({
					storeAddress: this.store_name
				})).then((res) => {
					this.$store.commit('setLoadingStatus', false)
					Toast({
					  message: '修改成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 1000
					})
					setTimeout(() => {
						this.$router.go(-1)
					},800)
	            })
	            .catch((error) => {
	                this.$store.commit('setLoadingStatus', false)
	            })
			}
		}
	}
</script>

<style scoped>
	.content{
		padding-top: 1.3rem;
	}
	.content input{
		display: block;
		width: 6.9rem;
		margin: 0 auto;
		padding: 0.2rem;
		background: #fff;
		border-radius: 0.1rem;
	}
	.save{
		position: fixed;
		width: 0.9rem;
		height: 0.9rem;
		right: 0;
		top: 0;
		line-height: 0.9rem;
		color: #fff;
		z-index: 60;
	}
</style>