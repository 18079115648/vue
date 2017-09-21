<template>
	<section class="fullDiv" v-cloak>
		<top title="活动详情" backType="/activityList"></top>
		<section class="activity-detail-content">
			<div class="activity-item-img">
				<mt-swipe :auto="0" >
				  <mt-swipe-item v-for="(item, index) in activityImg" :key="index">
				  	<img class="fullEle" :src="item" />
				  </mt-swipe-item>
				</mt-swipe>
				<!--<img :src="activityImg[0]" class="fullEle"  />-->
			</div>
			<div class="activity-item-desc">
				<p class="activity-name">{{activity_detail.title}}</p>
				<p class="activity-time">活动时间：{{activity_detail.startTime}} 至 {{activity_detail.endTime}}</p>
				<p class="activity-addr">
					<span style="width: 1.5rem;">活动地点：</span>
					<span style="flex: 1; line-height: 1.4;">{{activity_detail.address}}</span>
					<router-link class="address-map-icon" :to="'/baiduMap/' + activity_detail.latitude +'/' + activity_detail.longitude"></router-link>
				</p>
				<p class="activity-user"><span style="width: 1.5rem; display: inline-block;">主办方：</span>{{activity_detail.owner}}</p>
			</div>
			<div class="join-num">
				<p class="tit">报名人数 ({{activity_detail.joinNum}})</p>
				<div class="join-list" v-if="activity_detail.joinNum>0">
					<div class="join-avatar" v-for="(value, index) in activity_detail.joinListImgs.slice(0,9)" :key="index">
						<img :src="value" class="fullEle"  />
					</div>
					
				</div>
			</div>
			<div class="activity-more-detail">
				<router-link :to="'/activityIntro/'+ activity_id" class="activity-more-item has-right-arror">
					<span>详细介绍</span>
				</router-link>
				<router-link :to="'/activitySite/'+ activity_id" class="activity-more-item has-right-arror">
					<span>活动现场</span>
				</router-link>
				<a :href="activity_detail.liveUrl" class="activity-more-item has-right-arror" v-if="activity_detail.liveUrl">
					<span>视频直播</span>
				</a>
			</div>
			<div class="operate-content">
				<span class="share-wx" @click="show = true">微信分享</span>
				<span class="join-btn end " v-if="activity_detail.join" @click="endTip('join')">已报名</span>
				<span class="join-btn end" v-if="(!activity_detail.join) && (activity_detail.flag == 1)" @click="endTip('end')">已结束</span>
				<span class="join-btn btn-hover" v-if="(!activity_detail.join) && (activity_detail.flag == 2)" @click="goJoin">我要报名</span>
				<span class="join-btn end" v-if="(!activity_detail.join) && (activity_detail.flag == 3)" @click="endTip('ing')">已开始</span>
			</div>
		</section>
		<share-tip v-show="show" @shareCancel="show = false"></share-tip>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import shareTip from '../parts/shareTip'
	import {SecondAutho, storageGet, loadJssdk} from '../../../static/js/app.js'
	import { Toast } from 'mint-ui'
	import wx from 'weixin-js-sdk'
	import api from '@/fetch/api'
	export default {
		components: {
			top,
			shareTip
		},
		data() {
			return {
				show: false,
				activity_id: undefined,
				activity_detail:{},
				activityImg: []
			}
		},
//		beforeCreate() {
//	        SecondAutho(window.location.hash)
//	    },
		created() {
			this.activity_id = window.location.hash.split('/')[2]
			this.access_token = storageGet('access_token')
			api.activityDetail({
	        	params:{
				    id: this.activity_id,
				    access_token: this.access_token
				}
		    }).then((res) => {
		    	var self = this
		    	this.activityImg = res.data.result.imgs
	            this.activity_detail = res.data.result
	            var lineLink = window.location.href
				var imgUrl = this.activityImg[0]
				var shareTitle = this.activity_detail.title
				var descContent = '松泽商城' + this.activity_detail.title + '活动'
				this.wxShare(lineLink, imgUrl, shareTitle, descContent)
	        }).catch((err) => {
	            console.log(err)
	        })
		},
		mounted() {
			
		},
		methods: {
			wxShare(lineLink, imgUrl, shareTitle, descContent) {
				api.wechatSign({
		        	params:{
					    url: window.location.href.split('#')[0]
					}
			    }).then((res) => {
					wx.config({
		                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                appId: res.data.result.appId, // 必填，公众号的唯一标识
		                timestamp: parseInt(res.data.result.timestamp), // 必填，生成签名的时间戳
		                nonceStr: res.data.result.nonceStr, // 必填，生成签名的随机串
		                signature: res.data.result.signature, // 必填，签名，见附录1
		                jsApiList: ['uploadImage', 'getLocation', 'chooseImage', 'previewImage', 'uploadImage', 'scanQRCode', 'chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		            })
					wx.ready(function () {
						loadJssdk(lineLink, imgUrl, shareTitle, descContent)
					})
		        }).catch((err) => {
		            console.log(err)
		        })
			},
			goJoin() {
				if(SecondAutho(window.location.hash)) {
					this.$router.push('/activityJoin/'+ this.activity_id)
				}
			},
			endTip(value) {
				if(value == 'end') {
					Toast({
					  message: '活动已结束',
					  position: 'bottom',
					  duration: 1500
					});
				}else if(value == 'join') {
					Toast({
					  message: '活动已报名',
					  position: 'bottom',
					  duration: 1500
					});
				}else {
					Toast({
					  message: '活动已开始，报名结束',
					  position: 'bottom',
					  duration: 1500
					});
				}
				
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
	[v-cloak]{
		display: none;
	}
	.activity-detail-content{
		padding-top: 0.9rem;
		background: #fff;
	}
	.activity-item-img {
		height: 4rem;
	}
	
	.activity-item-desc {
		padding: 0.3rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	
	.activity-name {
		color: #333;
		font-size: 0.3rem;
		font-weight: 600;
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		margin-bottom: 0.2rem;
	}
	
	.activity-time,
	.activity-addr {
		position: relative;
		margin-bottom: 0.2rem;
	}
	.activity-addr{
		padding-right: 1rem;
		display: flex;
	}
	.address-map-icon{
		position: absolute;
		right: 0;
		top: 50%;
		width: 0.8rem;
		height: 0.8rem;
		margin-top: -0.4rem;
		background: url(../../../static/image/navi.png) no-repeat center;
		background-size: 60%;
	}
	
	.join-num {
		padding: 0 0.3rem;
		border-bottom: 0.2rem solid #F5F5F9;
	}
	
	.join-num .tit {
		padding: 0.3rem 0;
	}
	
	.join-list {
		display: flex;
		padding-bottom: 0.3rem;
		margin-right: -0.2rem;
	}
	
	.join-avatar {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 0.2rem;
	}
	.activity-more-detail{
		border-bottom: 2rem solid #F5F5F9;
	}
	.activity-more-item {
		position: relative;
		display: block;
		height: 0.9rem;
		line-height: 0.9rem;
		padding: 0 0.3rem;
		background-image: url(../../../static/image/border.png);
		background-repeat: repeat-x;
		background-position: 0 bottom;
		background-size: auto 1px;
	}
	
	.operate-content {
		height: 1rem;
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
	}
	
	.share-wx {
		position: relative;
		width: 1.8rem;
		text-align: center;
		line-height: 1.44rem;
		font-size: 0.24rem;
	}
	
	.share-wx:after {
		content: '';
		position: absolute;
		width: 0.46rem;
		height: 0.46rem;
		background: url(../../../static/image/wx-icon.png) no-repeat center;
		background-size: 100%;
		left: 50%;
		margin-left: -0.3rem;
		top: 0.1rem;
	}
	
	.join-btn {
		flex: 1;
		background: #39b382;
		color: #fff;
		line-height: 1rem;
		text-align: center;
		font-size: 0.32rem;
	}
	.join-btn.end{
		background: #ddd;
		color: #fefefe;
	}
</style>