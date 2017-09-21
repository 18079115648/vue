<template>
	<section class="join-content">
		<top title="提交报名"></top>
		<section class="join-user">
			<img :src="headImg"  />
			<span>{{nickName}}</span>
		</section>
		<section class="join-user-info">
			<div class="info-item">
				<span>姓名</span>
				<input type="text" placeholder="请输入" v-model.trim="name" />
			</div>
			<div class="info-item">
				<span>手机号</span>
				<input type="tel" maxlength="11" @input="inputPhone"  placeholder="请输入" v-model.trim="mobile_phone" />
			</div>
		</section>
		<div class="join-confirm-btn btn-hover" @click="joinConfirm" v-show="!disabledBtn">申请报名</div>
		<div class="join-confirm-btn btn-hover disabled" v-show="disabledBtn">申请报名</div>
		<confirm-modal 
			:show="show" 
			@cancel_modal="cancel_modal" 
			@confirm_modal="confirm_modal" 
			@closeModal="show = false" 
			cancel_text="确认"
			confirm_text="查看详情"
			has_icon="success"
			message="报名成功 !">
		</confirm-modal>
	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import confirmModal from '../parts/confirmModal'
	import { MessageBox } from 'mint-ui';
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	import { storageGet,checkCode, checkMobile, SecondAutho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	export default {
		components: {
			top,
			confirmModal
		},
		data() {
			return {
				show: false,
				nickName: '',
				headImg: '',
				access_token: '',
				mobile_phone: null,
				name: '',
				activity_id: undefined,
				disabledBtn: false
			}
		},
	    created() {
	    	if(!SecondAutho()) {
	    		return
	    	}
	    	this.$store.commit('setLoadingStatus', true)
	    	this.activity_id = window.location.hash.split('/')[2]
	    	this.access_token = storageGet('access_token')
	    	api.userCenter({
	        	params:{
				    access_token: this.access_token
				}
		    }).then((res) => {
            	this.$store.commit('setLoadingStatus', false)
                this.headImg = res.data.result.avatar
                this.nickName = res.data.result.nickname
                this.mobile_phone = res.data.result.mobile
            })
            .catch((error) => {
                this.$store.commit('setLoadingStatus', false)
            })
	    },
		mounted() {

		},
		methods: {
			inputPhone() {
				if (!/^\d*$/.test(this.mobile_phone)) {	
		            this.mobile_phone = this.mobile_phone.replace(/^\D+/g,'')            
		        } 
			},
			joinConfirm() {
				if(this.verify()) {
					this.disabledBtn = true
					api.activityJoin(this.access_token, qs.stringify({
						'id': this.activity_id,
						'name': this.name,
						'phone': this.mobile_phone
	//					'access_token': this.access_token
		    		})).then(res => {   
			            this.show = true
			            this.disabledBtn = false
			        }, err => {
									this.disabledBtn = false
			        })
				}
					
				
			},
			verify() {
				if(!this.name) {
					Toast({
					  message: '请输入正确的姓名',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				
				if(!(/^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(this.mobile_phone))) {
					Toast({
					  message: '请输入正确的联系方式',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				return true
			},
			cancel_modal() {
		  		this.show = false
		  		this.$router.go(-1)
		  	},
		  	confirm_modal() {
		  		this.$router.go(-1)
		  	}
		},
		beforeRouteLeave(to, from, next) {
			if(this.show) {
				next(false)
				this.show = false
				return
			}
			next()
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
	.join-user{
		margin-bottom: 0.4rem;
		padding: 0.25rem 0.3rem;
		padding-top: 1.15rem;
		background: #fff;
		display: flex;
		align-items: center;
	}
	.join-user img{
		display: block;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		margin-right: 0.3rem;
	}
	.info-item{
		padding: 0.04rem 0.3rem;
		background: #fff;
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
	.join-confirm-btn.disabled{
		background: #e1e1e1;
		color: #bbb;
	}
</style>