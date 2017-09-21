<template>
	<section class="join-content">
		<top title="收货信息"></top>
		<section class="join-user-info">
			<div class="info-item">
				<span>收货人</span>
				<input type="text" placeholder="请输入" v-model.trim="receiver" />
			</div>
			<div class="info-item">
				<span>联系信息</span>
				<input type="tel" @input="inputPhone" maxlength="11" placeholder="请输入" v-model.trim="mobile" />
			</div>
			<div class="info-item">
				<span>所在地区</span>
				<div class="area-select">
					<select v-model="provinceId" @change="changeProvince">
						<option disabled value="disabled">省份</option>
                        <option v-for="item in provinceList" :value="item">{{item.name}}</option>
                    </select>
                    <select v-model="cityId" @change="changeCity">
                        <option disabled value="disabled">城市</option>
                        <option v-for="item in cityList" :value="item">{{item.name}}</option>
                    </select>
                    <select v-model="areaId">
                        <option disabled value="disabled">县区</option>
                        <option v-for="item in areaList" :value="item">{{item.name}}</option>
                    </select>
				</div>
			</div>
			<textarea class="address-detail" placeholder="请填写详细地址" v-model.trim="addressDetail"></textarea>
		</section>
		<div class="join-confirm-btn btn-hover"  @click="chargeConfirm">立即兑换</div>
		<confirm-modal 
			:show="show" 
			@cancel_modal="cancel_modal" 
			@confirm_modal="confirm_modal" 
			@closeModal="show = false" 
			confirm_text="充值换积分"
			has_icon="warn"
			message="积分余额不足 !">
		</confirm-modal>
		<confirm-modal 
			:show="succ_show" 
			@cancel_modal="succ_cancel_modal" 
			@confirm_modal="succ_confirm_modal" 
			@closeModal="succ_show = false" 
			confirm_text="查看订单"
			cancel_text="确认"
			has_icon="success"
			message="兑换成功 !">
		</confirm-modal>
	</section>

</template>

<script>
	import top from '../parts/header'
	import confirmModal from '../parts/confirmModal'
	import { MessageBox } from 'mint-ui'
	import { storageGet, SecondAutho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import { Toast } from 'mint-ui'
	import qs from 'qs'
	export default {
		components: {
			top,
			confirmModal
		},
		data() {
			return {
				show: false,
				succ_show: false,
				access_token: '',
				receiver: '',
				mobile: undefined,
				productId:undefined,
				productNum:undefined,
				
				provinceList:[],
				provinceId: 'disabled',
				cityList:[],
				cityId: 'disabled',
				areaList:[],
				areaId: 'disabled',
				addressDetail: ''
				
			}
		},
		beforeCreate() {
	        SecondAutho()
	    },
		created() {
			this.productId = window.location.hash.split('/')[2]
			this.productNum = window.location.hash.split('/')[3]
			this.access_token = storageGet('access_token')
	    	api.provinceList().then((res) => {
                this.provinceList = res.data.result
                
            })
            .catch((error) => {
                console.log(error)
            })
//			api.memberInfo({
//				params:{
//					access_token: this.access_token
//				}
//			}).then((res) => {
//              this.mobile = res.data.result.mobile
//          })
//          .catch((error) => {
//              console.log(error)
//          })
		},
		mounted() {

		},
		watch: {
			
		},
		methods: {
			inputPhone() {
				if (!/^\d*$/.test(this.mobile)) {	
		            this.mobile = this.mobile.replace(/^\D+/g,'')            
		        } 
			},
			changeProvince() {
				api.cityList(this.provinceId.id).then((res) => {
	                this.cityList = res.data.result
	                this.cityId = res.data.result[0]
	                this.changeCity()
	            })
	            .catch((error) => {
	                console.log(error)
	            })
			},
			changeCity() {
				api.areaList(this.cityId.id).then((res) => {
	                this.areaList = res.data.result
	                this.areaId = res.data.result[0]
	            })
	            .catch((error) => {
	                console.log(error)
	            })
			},
			verify() {
				if(!(/^[\u4E00-\u9FA5]{2,4}$/.test(this.receiver))) {
					Toast({
					  message: '请输入正确的收货人',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				
				if(!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(this.mobile))) {
					Toast({
					  message: '请输入正确的联系方式',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				if(this.provinceId == 'disabled') {
					Toast({
					  message: '请选择收货地址',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				if(!this.addressDetail) {
					Toast({
					  message: '请输入详细地址',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				return true
			},
			
			cancel_modal() {
		  		this.$router.go(-1)
		  	},
		  	confirm_modal() {
		  		this.$router.push('/recharge')
		  	},
		  	succ_cancel_modal() {
		  		this.$router.go(-1)
		  	},
		  	succ_confirm_modal() {
		  		this.$router.replace('/myOrders')
		  	},
			chargeConfirm() {
				if(this.verify()) {
					api.productBuy(this.access_token, qs.stringify({
						cityId: this.cityId.id,
						cityName: this.cityId.name,
						consignee: this.receiver,
						districtId: this.areaId.id,
						districtName: this.areaId.name,
						id: this.productId,
						mobile: this.mobile,
						num: this.productNum,
						provinceId: this.provinceId.id,
						provinceName: this.provinceId.name,
						street: this.addressDetail,
						access_token: this.access_token
		    		})).then(res => {   
			            if(res.data.err_code == 40014) {
			            	this.show = true
			            	return
			            }
			            if(res.data.err_code == 0) {
			            	this.succ_show = true
			            	return
			            }
			        }, err => {
			
			        })
				}
			}
		},
		beforeRouteLeave(to, from, next) {
			if(this.show || this.succ_show) {
				this.show = false
				this.succ_show = false
				next(false)
				return
			}else{
				next()
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
		left: 0;
		padding-top: 1.3rem;
	}
	.join-user-info{
		background: #fff;
	}
	.info-item{
		padding: 0.04rem 0.5rem 0.04rem 0.3rem;
		
		display: flex;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		height: 0.9rem;
		line-height: 0.82rem;
		justify-content: space-between;
	}
	.info-item input{
		width: 4rem;
		text-align: right;
	}
	.area-select{
		width: 4.4rem;
		text-align: right;
		display: flex;
	}
	.area-select select{
		width: 1.2rem;
		margin-left: 0.2rem;
		border: 0;
		outline: none;
		appearance: none;
		background: #fff;
		text-align: left;
		font-size: 0.28rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
		
	}
	.area-select select option{
		text-align: left;
	}
	.address-detail{
		outline: none;
		border: 0;
		display: block;
		width: 100%;
		padding: 0.3rem;
		height: 1.6rem;
		line-height: 1.5;
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
	.case-kind{
		width: 80%;
		border-radius: 0.1rem;
		overflow: hidden;
	}
</style>