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
				<div class="user-info-item has-right-arror">
					<span>昵称</span>
					<span>哈哈</span>
				</div>
				<div class="user-info-item has-right-arror" @click="show = true">
					<span>性别</span>
					<span>男</span>
				</div>
				<div class="user-info-item has-right-arror" @click="editUserName">
					<span>姓名</span>
					<input type="text" placeholder="请输入联系人姓名" readonly="readonly" />
				</div>
			</div>
			<div class="user-info-mid">
				<div class="user-info-item">
					<span>地区</span>
					<span>哈哈</span>
				</div>
				<div class="user-info-item">
					<span>门店</span>
					<span>男</span>
				</div>
				<div class="user-info-item">
					<span>手机号</span>
					<span>哈哈</span>
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
	import top from '../parts/header'
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
			        label: '男',
			        value: '1',
			      },
			      {
			        label: '女',
			        value: '2'
			      }
			    ]
			}
		},
		mounted() {

		},
		methods: {
			editUserName() {
				this.$router.push('/repairUserName')
			},
			selectKind(data) {
				this.show = false
				console.log(data)
			},
			onFileChange(e) {
				var files = e.target.files[0] || e.dataTransfer.files[0]; 
				
				if (!files){
					return;
				}
//				this.data.push(files)
	//			this.formData.append('name',files)
	//			console.log(this.formData)
	            this.createImage(files);
			},
			createImage(files) {
	            var src=window.URL.createObjectURL(files)
				this.avatar = src          
	        }
		}
	}
</script>

<style scoped>
	.repair-user-content{
		padding-top: 0.4rem;
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
	}
</style>