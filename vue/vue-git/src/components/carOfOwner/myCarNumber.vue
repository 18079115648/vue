<template>
	<transition name="move">
		<section class="fullDiv move-right">
			<top title="修改车牌"></top>
			<section class="edit-car-number">
				<div class="car-number">
					<span >车牌号</span>
					<div class="car-number-select">
						<span @click="show = true" class="car-area has-right-arror">{{province_selected}}</span>
						<input v-model="carNumber" type="url" style="text-transform:uppercase;" placeholder="请输入车牌号" lang="en" maxlength="6" @input="editCarNumber" />
					</div>
				</div>
				<div class="join-confirm-btn btn-hover" @click="changeCarNumber">保存</div>
			</section>	
			<mt-popup v-model="show" class="charge-detail" position="bottom">
		      	<div class="province-select">
		      		<span @click="selectProvince(item)" class="mobile-btn" v-for="(item, index) in province_list" :key="index">{{item.name}}</span>
		      	</div>
		    </mt-popup>
		</section>
	</transition>
</template>

<script>
    import { Popup } from 'mint-ui';
	import top from '../parts/header'
	import qs from 'qs'
	import { storageGet } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top
		},
		data() {
			return {
				access_token: '',
				show: false,
				carNumber: null,
				province_selected: '苏',
				province_list:[{
					name:'苏'
				},{
					name:'京'
				},{
					name:'沪'
				},{
					name:'津'
				},{
					name:'渝'
				},{
					name:'冀'
				},{
					name:'豫'
				},{
					name:'云'
				},{
					name:'辽'
				},{
					name:'黑'
				},{
					name:'湘'
				},{
					name:'皖'
				},{
					name:'鲁'
				},{
					name:'浙'
				},{
					name:'新'
				},{
					name:'赣'
				},{
					name:'鄂'
				},{
					name:'桂'
				},{
					name:'甘'
				},{
					name:'晋'
				},{
					name:'蒙'
				},{
					name:'陕'
				},{
					name:'吉'
				},{
					name:'闽'
				},{
					name:'贵'
				},{
					name:'粤'
				},{
					name:'青'
				},{
					name:'藏'
				},{
					name:'川'
				},{
					name:'宁'
				},{
					name:'琼'
				}]
			}
		},
		mounted() {

		},
		created() {
			var carNumber = storageGet('lastCarNumber')
			if(carNumber && carNumber != 'undefined') {
				this.province_selected = carNumber.slice(0,1)
				this.carNumber = carNumber.slice(1)
			}
			this.access_token = storageGet('access_token')
		},
		methods: {
			selectProvince(item) {
				this.show = false
				this.province_selected = item.name
			},
			editCarNumber() {
				this.carNumber = this.carNumber.replace(/[^A-Za-z0-9]/g,'').toUpperCase()
			},
			changeCarNumber() {
				console.log(this.carNumber)
				if(!(/^[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(this.carNumber))) {
					Toast({
					  message: '请正确输入车牌号',
					  position: 'bottom',
					  duration: 1500
					});
					return
				}
				api.chargeCarNumber(this.access_token, qs.stringify({
					licenseNum: this.province_selected + this.carNumber
	    		})).then(res => {   
		            Toast({
					  message: '修改成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 1000
					});
					setTimeout(() => {
						this.$router.push('/repairUser')
					},800)
		        }, err => {
		
		        })
			}
		}
	}
</script>

<style scoped>
	.edit-car-number{
		padding-top: 1.3rem;
	}
	.car-number{
		background: #fff;
		padding: 0 0.3rem;
		height: 0.9rem;
		line-height: 0.9rem;
		display: flex;
		justify-content: space-between;
	}
	.car-number-select{
		display: flex;
		width: 2.8rem;
	}
	.car-number-select span.car-area{
		width: 1rem;
		position: relative;
		color: #39B382;
		font-size: 0.32rem;
	}
	span.car-area.has-right-arror:after{
		transform: rotate(90deg);
		right: 0.36rem;
		margin-top: -0.14rem;
	}
	.car-number-select input{
		width: 1.8rem;
		padding: 0.3rem 0;
		vertical-align: middle;
		line-height: 0.3rem;
	}
	.charge-detail{
		width: 100%;
		padding: 0.2rem 0.1rem;
		background: #F5F5F9;
		
	}
	.province-select{
		display: flex;
		flex-wrap: wrap;
	}
	.province-select span{
		position: relative;
		width: 0.7rem;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		background: #fff;
		margin: 0.1rem;
		border-radius: 0.06rem;
		box-shadow: 2px 2px 1px #ccc;
		-webkit-user-select: none;
	}
	.join-confirm-btn{
		width: 6.9rem;
		margin: 1.5rem auto 0;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
	}
</style>