<template>

	<div id="allmap"></div>

</template>
<script>
	import BMap from 'BMap'
	import api from '@/fetch/api'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
				return {
					center: {
						lng: 0,
						lat: 0
					},
					start_lat: undefined,
					start_lng: undefined
				}
			},
			created() {
				var self = this
				this.start_lat = window.location.hash.split('/')[2]
				this.start_lng = window.location.hash.split('/')[3]
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
		                jsApiList: ['uploadImage', 'getLocation', 'openLocation', 'chooseImage', 'previewImage', 'scanQRCode', 'chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		            })
					wx.ready(function () {
						wx.openLocation({
						    latitude: parseFloat(self.start_lat), // 纬度，浮点数，范围为90 ~ -90
						    longitude: parseFloat(self.start_lng), // 经度，浮点数，范围为180 ~ -180。
						    name: '', // 位置名
						    address: '', // 地址详情说明
						    scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
						    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
						});
					})
		        }).catch((err) => {
		            console.log(err)
		        })
			},
			mounted() {
//				this.ready()
			},
			methods: {
				ready() {
					var map = new BMap.Map("allmap");
					var geolocation = new BMap.Geolocation();
					geolocation.getCurrentPosition((r) => {
						console.log(r)
						this.center.lng = r.point.lng
						this.center.lat = r.point.lat
						var point = new BMap.Point(this.center.lng, this.center.lat);
						map.centerAndZoom(point, 15);
						var p1 = new BMap.Point(this.start_lng, this.start_lat);
						var driving = new BMap.DrivingRoute(map, {
							renderOptions: {
								map: map,
								autoViewport: true
							}
						});
						driving.search(point, p1);
					})
				}

			}
	}
</script>
<style scoped>
	#allmap {
		width: 100%;
		height: 100vh;
	}
</style>