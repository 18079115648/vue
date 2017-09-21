<template>
	<section class="join-content">
		<top title="上传案例"></top>
		<section class="join-user-info">
			<div class="info-item">
				<span>案例标题</span>
				<input type="text" placeholder="请输入" v-model.trim="repairTitle" />
			</div>
			<div class="info-item has-right-arror" @click="show = true">
				<span>所属分类</span>
				<input type="text" v-model="case_name" placeholder="选择" readonly="readonly" style="padding-right: 0.2rem;" />
			</div>
			<div class="info-item">
				<span>所需积分</span>
				<input type="tel" @input="editPoint" placeholder="请输入" v-model.trim="repairPoint" />
			</div>
		</section>
		<div class="updata-content">
			<textarea class="case-detail-text" v-model.trim="repairText" placeholder="请输入案例内容"></textarea>
			<div class="media-content">
				<div class="media-item" v-for="(item, index) in oldImgList" :key="index" @click="checkImg(item,index,'old')">
					<img :src="item"  />
				</div>
				<div class="media-item" v-for="(item, index) in uploadImgList" :key="index" @click="checkImg(item,index,'new')">
					<img :src="item"  />
				</div>
				<div class="media-item" v-if="videoSrc" @click="checkVideo" >
					<div class="video-item fullEle"></div>
				</div>
				<div v-show="uploadBtn" class="media-item add" @click="sheetShow = true">
					<input type="file" id="uploadImg" name="uploadImg" multiple="multiple" @change="onImgChange"  accept="image/*" />
					<input type="file" id="uploadVideo" name="uploadVideo" @change="onVideoChange"   accept="video/*" />
				</div>
			</div>
		</div>
		<div class="join-confirm-btn btn-hover" @click="finishUpdata">完成</div>
		<div class="updata-ing" v-show="updata_status">正在上传...</div>
		<mt-popup v-model="show" class="case-kind">
	        <mt-radio
			  title="请选择案例分类"
			  v-model="case_kind"
			  :options="options" @change="selectKind">
			</mt-radio>
	    </mt-popup>
	    <mt-actionsheet class="sheetModal" :actions="actions" v-model="sheetShow"></mt-actionsheet>
	    <enlarge-img 
	    	:show="enlargeShow" 
	    	:type="mediaType"
	    	@closeEnlarge="enlargeShow = false" 
	    	@deleteImg="deleteImg"
	    	@deleteVideo="deleteVideo" 
	    	:videoSrc="videoSrc"
	    	:videoType="videoType"
	    	:length="uploadImgList.length + oldImgList.length" 
	    	:currIndex="currEnlargeIndex" 
	    	:imgSrc="currEnlargeSrc">
	    </enlarge-img>
	</section>

</template>

<script>
	import axios from 'axios'
	import { Radio } from 'mint-ui';
	import top from '../parts/header'
	import { storageGet, Autho } from '../../../static/js/app.js'
	import enlargeImg from '../parts/enlargeImg'
	import { Actionsheet } from 'mint-ui';
	import { Toast } from 'mint-ui'
	import api from '@/fetch/api'
	import qs from 'qs'
	export default {
		components: {
			top,
			enlargeImg
		},
		data() {
			return {
				repairTitle: '',
				repairPoint: '',
				repairText: '',
				show: false,
				sheetShow: false,
				enlargeShow: false,
				mediaType: 'img',
				actions:[],
				case_kind: '',
				case_name: '',
				options: [],
				uploadImgList: [],
				currEnlargeSrc: '',
				currEnlargeIndex: undefined,
				videoSrc: '',
				videoType: '',
				uploadBtn: true,
				imgFormData: undefined,
				imgFiles: [],
				videoFormData: undefined,
				videoFiles: undefined,
				
				access_token: '',
				allImgSrc: '',
				videoTime: undefined,
				allVideoSrc: '',
				
				repair_id: undefined,
				oldImgList: [],
				type : undefined,
				
				updata_status: false
			}
		},
		created() {
			this.repair_id = window.location.hash.split('/')[2]
			this.access_token = storageGet('access_token')
			axios.get(this.$store.state.uri + 'repaircate/list').then((res) => {
				res.data.result.forEach((item) => {
					var obj= {}
					obj.value = String(item.id)
					obj.label = item.name
					this.options.push(obj)
				})
            }).catch((err) => {
                console.log(err)
            })
            api.repairDetail({
	        	params:{
				    id: this.repair_id,
				    access_token: this.access_token
				}
		    }).then((res) => {
              	this.repairTitle = res.data.result.title
              	this.case_name = res.data.result.cateName
              	this.case_kind = String(res.data.result.cateId)
				this.repairText = res.data.result.description
				this.repairPoint = res.data.result.price
//				this.type = res.data.result.type
				if(res.data.result.type == 3) {
					this.videoSrc = res.data.result.video
					this.uploadBtn = false
					this.allImgSrc = res.data.result.imgs[0]
					this.videoTime = res.data.result.videoTime
					this.allVideoSrc = res.data.result.video
				}else if(res.data.result.type == 2) {
					this.oldImgList = res.data.result.imgs
				}
            }).catch((err) => {
                console.log(err)
            })
		},
		mounted() {
			this.actions = [{
		        name: '上传图片(最多6张)',
		        method: this.openImg
		    }, {
		        name: '上传视频(低于10M)',
		        method: this.openVideo
		    }]
		},
		methods: {
			finishUpdata() {
				if(this.verify()) {
					this.$store.commit('setLoadingStatus', true)
					this.updata_status = true
					if((this.imgFiles.length + this.oldImgList.length)>0) {
						
						if(this.imgFiles.length>0) {
							this.imgFormData = new FormData();//创建form对象
							this.imgFiles.forEach((item) => {
								this.imgFormData.append('file',item)
							})
							axios.post(this.$store.state.uri + 'upload/imgList', this.imgFormData, {
				            	headers:{
				            		'Content-Type':'multipart/form-data'
				            	}
				            }).then((res) => {
				            	if(res.data.err_code==0){
									this.allImgSrc = this.oldImgList.concat(res.data.result).join(',')
									this.reapirEdit()
								}else{
									this.$store.commit('setLoadingStatus', false)
				            		this.updata_status = false
									Toast({
									  message: '图片上传失败',
									  position: 'bottom',
									  duration: 2000
									});
								}
				            	
								
				            })
				            .catch((error) => {
				            	this.$store.commit('setLoadingStatus', false)
				            	this.updata_status = false
				                Toast({
								  message: '图片上传失败',
								  position: 'bottom',
								  duration: 2000
								});
				            })
						}else {
							this.allImgSrc = this.oldImgList.join(',')
							this.reapirEdit()
						}
						
					}else if(this.videoFiles || this.videoSrc) {
						if(this.videoFiles) {
							this.videoFormData = new FormData();//创建form对象
							this.videoFormData.append('file',this.videoFiles)
							axios.post(this.$store.state.uri + 'upload/video', this.videoFormData, {
				            	headers:{
				            		'Content-Type':'multipart/form-data'
				            	}
				            }).then((res) => {
				            	if(res.data.err_code==0){
				            		this.videoTime = res.data.result.time
				            		this.allVideoSrc = res.data.result.video
				            		this.allImgSrc = res.data.result.img
									this.reapirEdit()
								}else{
									this.$store.commit('setLoadingStatus', false)
				            		this.updata_status = false
									Toast({
									  message: '视频上传失败',
									  position: 'bottom',
									  duration: 2000
									});
								}	
				            })
				            .catch((error) => {
				            	this.$store.commit('setLoadingStatus', false)
				            	this.updata_status = false
				                Toast({
								  message: '视频上传失败',
								  position: 'bottom',
								  duration: 2000
								});
				            })
						}else {
							this.reapirEdit()
						}
						
					}else {
						this.reapirEdit()
					}
				
				}
				

			},
			reapirEdit() {
				api.repairEdit(this.access_token,qs.stringify({
					cateId: this.case_kind,
					description: this.repairText,
					img: this.allImgSrc,
					price: this.repairPoint,
					time: this.videoTime,
					title: this.repairTitle,
					video: this.allVideoSrc,
					id: this.repair_id
				})).then((res) => {
					this.$store.commit('setLoadingStatus', false)
					this.updata_status = false
					this.$router.replace('/updataDetail/' + this.repair_id)
					Toast({
					  message: '上传成功，等待审核',
					  position: 'middle',
					  duration: 4000
					});
	            })
	            .catch((error) => {
	                this.$store.commit('setLoadingStatus', false)
	                this.updata_status = false
	            })
			},
			verify() {
				if(!this.repairTitle) {
					Toast({
					  message: '请输入案例标题',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				if(!this.case_kind) {
					Toast({
					  message: '请选择案例类别',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				if(!this.repairPoint) {
					this.repairPoint = 0
				}
				if(!this.videoSrc && ((this.imgFiles.length + this.oldImgList.length)<1) && !this.repairText) {
					Toast({
					  message: '请编辑案例',
					  position: 'bottom',
					  duration: 1000
					});
					return false
				}
				return true
			},
			editPoint() {
				this.repairPoint = this.repairPoint.replace(/\D+/g,'') 
				if(this.repairPoint.indexOf('0') == 0) {
					this.repairPoint = 0
				}
			},
			selectKind(id) {
				console.log(this.case_kind)
				this.show = false
				this.options.forEach((item) => {
					if(item.value == id) {
						this.case_name = item.label
					}
				})
			},
			openImg() {
				if(this.videoSrc) {
					Toast({
					  message: '图片和视频不能一起上传',
					  position: 'bottom',
					  duration: 1500
					});
					return
				}
				document.getElementById('uploadImg').click()
			},
			openVideo() {
				if((this.uploadImgList.length + this.oldImgList.length)>0) {
					Toast({
					  message: '图片和视频不能一起上传',
					  position: 'bottom',
					  duration: 1500
					});
					return
				}
				document.getElementById('uploadVideo').click()
			},
			onImgChange(e) {
				var self = this
				var files = e.target.files || e.dataTransfer.files
				var len = files.length
				var maxLen = this.uploadImgList.length + this.oldImgList.length + len
				if (!files){
					return;
				}
				if(maxLen>6) {
					Toast({
					  message: '最多上传6张图片',
					  position: 'bottom',
					  duration: 1500
					});
					return
				}
				for(var i=0; i<len; i++) {
					var src=window.URL.createObjectURL(files[i]);
					this.uploadImgList.push(src) 
					this.imgFiles.push(files[i]) 
				}
				var file = $('#uploadImg')
				var clone = file.clone().val("");
				clone.change(this.onImgChange)
				file.after(clone); 
				file.remove(); 
			},
			onVideoChange(e) {
				var files = e.target.files[0] || e.dataTransfer.files[0]
				if(files.size > 10500000) {
					Toast({
						message: '视频内容不得大于10M',
						position: 'bottom',
						duration: 1500
					});
					return
				}
				var src=window.URL.createObjectURL(files)
				this.videoType = files.type
				this.videoSrc = src
				this.uploadBtn = false
				this.videoFiles = files
				var file = $('#uploadVideo')
				var clone = file.clone().val("");
				clone.change(this.onVideoChange)
				file.after(clone); 
				file.remove(); 
			},
			checkImg(item,index, status) {
				if(status == 'new') {
					this.currEnlargeIndex = index + this.oldImgList.length
				}else {
					this.currEnlargeIndex = index
				}
				this.currEnlargeSrc = item
				
				this.mediaType = 'img'
				this.enlargeShow = true
			},
			deleteImg() {
				if(this.currEnlargeIndex > this.oldImgList.length-1) {
					this.uploadImgList.splice(this.currEnlargeIndex-this.oldImgList.length, 1)
					this.imgFiles.splice(this.currEnlargeIndex-this.oldImgList.length, 1)
				}else {
					this.oldImgList.splice(this.currEnlargeIndex, 1)
					this.imgFiles.splice(this.currEnlargeIndex, 1)
				}
				this.allImgSrc = undefined
				this.enlargeShow = false
			},
			deleteVideo() {
				this.videoSrc = undefined
				this.allImgSrc = undefined
				this.videoTime = undefined
				this.allVideoSrc = undefined
				this.uploadBtn = true
				this.enlargeShow = false
			},
			checkVideo() {
				this.mediaType = 'video'
				this.enlargeShow = true
			},

		},
		beforeRouteLeave(to, from, next) {
			if(this.show || this.enlargeShow || this.sheetShow) {
				this.show = false
				this.enlargeShow = false
				this.sheetShow = false
				next(false)
				return
			}else {
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
		top: 0;
		padding-top: 0.9rem;
	}
	.join-content .mint-popup{
		transition-duration: 0.1s !important;
		/*transition: none;*/
	}
	.join-user-info{
		padding-top: 0.4rem;
	}
	.info-item{
		padding: 0.04rem 0.5rem 0.04rem 0.3rem;
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
	.case-kind{
		width: 80%;
		border-radius: 0.1rem;
		overflow: hidden;
	}
	
	.updata-content{
		padding: 0.3rem;
		background: #fff;
		margin-top: 0.3rem;
	}
	.case-detail-text{
		display: block;
		outline: none;
		border: 0;
		width: 100%;
		height: 2rem;
		font-size: 0.3rem;
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
		position: relative;
		border: none;
	}
	.media-item.add input{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 100rem;
		bottom: 100rem;
		opacity: 0;
	}
	.media-item{
		width: 1.5rem;
		height: 1.5rem;
		margin: 0.15rem;	
		position: relative;
		border: 1px solid #e2e2e2;
	}
	.media-item>img {
		display: block;
		max-width: 100%;
		max-height: 100%;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.video-item{
		background: url(../../../static/image/icon-video.png) no-repeat center;
		background-size: 66%;
	}
	.join-confirm-btn{
		width: 6.9rem;
		margin: 1.2rem auto 0.5rem;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
	}
	.delete-video{
		position: absolute;
		width: 0.4rem;
		height: 0.4rem;
		top: 0;
		right: 0;
		background: url(../../../static/image/delete-icon.png) no-repeat center;
		background-size: 100% 100%;
		z-index: 20;
	}
	
</style>