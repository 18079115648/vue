<template>
	<section class="fullDiv">
		<top title="个人中心"></top>
		<section class="repair-user-content">
			<div class="user-info-top has-right-arror">
				<span>头像</span>
				<div class="avatar">
					<img :src="avatar"  />
					<input type="file" name="upload" @change="onFileChange" accept="image/*" />
				</div>
			</div>
			<div class="user-info-mid">
				<div class="user-info-item has-right-arror" @click="editUserName">
					<span>昵称</span>
					<span>{{userInfo.nick_name}}</span>
				</div>
				<div class="user-info-item has-right-arror" @click="show = true">
					<span>性别</span>
					<span v-if="gender == 0">保密</span>
					<span v-if="gender == 1">男</span>
					<span v-if="gender == 2">女</span>
				</div>
				<!--<div class="user-info-item has-right-arror" >
					<span>姓名</span>
					<input type="text" placeholder="请输入联系人姓名" readonly="readonly" />
				</div>-->
			</div>
			<div class="user-info-mid">
				<div class="user-info-item">
					<span>地区</span>
					<span>{{userInfo.province}} {{userInfo.city}} {{userInfo.district}}</span>
				</div>
				<div v-if="userInfo.type == 1" class="user-info-item has-right-arror" @click="editUserStore">
					<span>门店</span>
					<span>{{userInfo.store_address}}</span>
				</div>
				<div class="user-info-item">
					<span>手机号</span>
					<span>{{userInfo.mobile}}</span>
				</div>
			</div>
		</section>
		<mt-popup v-model="show" class="case-kind">
	      <mt-radio
				  title="请选择性别"
				  v-model="case_kind"
				  :options="options" @change="selectKind">
				</mt-radio>
	   </mt-popup>
	</section>

</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import {storageSet, storageGet, Autho } from '../../../static/js/app.js'
	import api from '@/fetch/api'
	import qs from 'qs'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			top
		},
		data() {
			return {
				show: false,
				case_kind: '',
				avatar: '',
				options: [
				  {
			        label: '保密',
			        value: '0',
			      },
			      {
			        label: '男',
			        value: '1',
			      },
			      {
			        label: '女',
			        value: '2'
			      }
			      
			    ],
			    userInfo:{},
			    gender: undefined
			}
		},
		created() {
			this.access_token = storageGet('access_token')
			this.$store.commit('setLoadingStatus', true)
			api.memberInfo({
				params:{
					access_token: this.access_token
				}
			}).then((res) => {
				this.$store.commit('setLoadingStatus', false)
				this.userInfo = res.data.result
				this.avatar = res.data.result.avatar
				this.gender = res.data.result.gender
				this.case_kind = String(res.data.result.gender)
            })
            .catch((error) => {
                this.$store.commit('setLoadingStatus', false)
            })
		},
		mounted() {

		},
		methods: {
			editUserName() {
				if(this.userInfo.nick_name) {
					storageSet('lastUserName',this.userInfo.nick_name)
				}
				this.$router.push('/repairUserName')
			},
			editUserStore() {
				if(this.userInfo.store_address) {
					storageSet('lastUserStore',this.userInfo.store_address)
				}
				this.$router.push('/repairUserStore')
			},
			selectKind(id) {
				this.show = false
				api.chargeUserGender(this.access_token,qs.stringify({
					gender: id
				})).then((res) => {
					this.gender = id
					Toast({
					  message: '修改成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 1000
					});
	            })
	            .catch((error) => {
	                console.log(error)
	            })
			},
			onFileChange(e) {
				var files = e.target.files[0] || e.dataTransfer.files[0]; 
				if (!files){
					return;
				}
				if(files.size > 5000000) {
					Toast({
					  message: '头像图片不得大于5M',
					  position: 'bottom',
					  duration: 1500
					});
		    		return
				}
				var param = new FormData(); //创建form对象
          		param.append('file',files);//通过append向form对象添加数据
//				this.data.push(files)
	//			this.formData.append('name',files)
	//			console.log(this.formData)
	            this.$store.commit('setLoadingStatus', true)
	            axios.post(this.$store.state.uri + 'upload/img', param, {
	            	headers:{
	            		'Content-Type':'multipart/form-data'
	            	}
	            }).then((res) => {
	            	api.chargeUserAvatar(this.access_token,qs.stringify({
						avatar: res.data.result
					})).then((res) => {
						this.$store.commit('setLoadingStatus', false)
						this.createImage(files);
						Toast({
						  message: '修改成功',
						  position: 'middle',
						  iconClass: 'toast-icon icon-success',
						  duration: 1000
						});
		            })
		            .catch((error) => {
		                this.$store.commit('setLoadingStatus', false)
		            })
					
	            })
	            .catch((error) => {
	                this.$store.commit('setLoadingStatus', false)
	            })
			},
			createImage(files) {
	            var src=window.URL.createObjectURL(files)
				this.avatar = src          
	        }
		},
		beforeRouteLeave(to, from, next) {
			if(this.show) {
				this.show = false
				next(false)
				return
			}else {
				next()
			}
			
		}
	}
</script>

<style scoped>
	.repair-user-content{
		padding-top: 1.3rem;
	}
	.user-info-top{
		padding: 0.25rem 0.7rem 0.25rem 0.3rem;
		display: flex;
		justify-content: space-between;
		background: #fff;
		align-items: center;
	}
	.user-info-top .avatar{
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
		overflow: hidden;
		position: relative;
	}
	.user-info-top .avatar input{
		z-index: 30;
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
	}
	.user-info-top .avatar img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.user-info-mid{
		margin-top: 0.4rem;
		background: #fff;
	}
	.user-info-item{
		height: 0.9rem;
		line-height: 0.9rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
		display: flex;
		padding: 0 0.3rem;
		justify-content: space-between;
	}
	.user-info-item.has-right-arror{
		padding-right: 0.6rem;
	}
	.user-info-item>input{
		text-align: right;
		padding: 0.3rem 0;
		width: 3rem;
	}
	.case-kind{
		width: 80%;
		border-radius: 0.1rem;
		overflow: hidden;
		transition-duration: 0.1s !important;
		/*transition: none;*/
	}
</style>