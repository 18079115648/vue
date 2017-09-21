import axios from 'axios'
import qs from 'qs'
import { Toast } from 'mint-ui'
import store from '@/vuex/store.js'
import { Autho } from '../../static/js/app.js'

//
var url = store.state.uri;
//
//if(!(access_token==null||access_token==undefined)){
//	localStorage.setItem('access_token', access_token)
//}else{
//	access_token=localStorage.getItem('access_token')
//}





// axios 配置
axios.defaults.timeout = 90000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://121.41.101.63:8088/yadu-api';
//axios.defaults.baseURL = 'http://116.62.201.22:8080/yadu-api'
//axios.defaults.baseURL = '/pm-api/'
						
//POST传参序列化
axios.interceptors.request.use((config) => {
    return config;
},(error) =>{
    
    return Promise.reject(error);
});

////返回状态判断
//axios.interceptors.response.use((res) =>{
//  if(!(res.data.err_code==0)){
//      return Promise.reject(res);
//  }
//  return res;
//}, (error) => {
//  return Promise.reject(error);
//});

export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
            	if(response.data.err_code==0){
            		resolve(response);
            	}else if(response.data.err_code==40014) {
            		resolve(response);
            	}else if(response.data.err_code==20001 || response.data.err_code==20002 || response.data.err_code==20003) {
            		reject(response)
            		localStorage.removeItem("access_token");
            		localStorage.removeItem("expire_time");
            		localStorage.setItem('url', window.location.hash)
            		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
            	}else if(response.data.err_code==40012) {
            		reject(response)
            		localStorage.setItem('url', window.location.hash)
            		Toast({
					  message: '请先注册账号',
					  position: 'bottom',
					  duration: 1500
					});
            		window.location.href = store.state.back_uri + '#/login'
            	}else if(response.data.err_code==40001) {
            		reject(response)
            		Toast({
					  message: '账号已被禁用，请联系客服',
					  position: 'bottom',
					  duration: 2000
					});
					setTimeout(function() {
						WeixinJSBridge.call('closeWindow')
					}, 2000)
            	}else{
            		reject(response)
            		Toast({
					  message: response.data.err_msg,
					  position: 'bottom',
					  duration: 2000
					});
            	}
                
            })
            .catch((error) => {
               reject(error)
               Toast({
				  message: '网络错误',
				  position: 'bottom',
				  duration: 2000
				});
            })
    })
}
export function fetchGet(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(response => {
            	if(response.data.err_code==0){
            		resolve(response);
            	}else if(response.data.err_code==20001 || response.data.err_code==20002 || response.data.err_code==20003) {
            		reject(response)
            		localStorage.removeItem("access_token");
            		localStorage.removeItem("expire_time");
            		localStorage.setItem('url', window.location.hash)
            		window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
            	}else if(response.data.err_code==40012) {
            		reject(response)
            		localStorage.setItem('url', window.location.hash)
            		Toast({
					  message: '请先注册账号',
					  position: 'bottom',
					  duration: 1500
					});
            		window.location.href = store.state.back_uri + '#/login'
            	}else if(response.data.err_code==40001) {
            		reject(response)
            		Toast({
					  message: '账号已被禁用，请联系客服',
					  position: 'bottom',
					  duration: 2000
					});
					setTimeout(function() {
						WeixinJSBridge.call('closeWindow')
					}, 2000)
            	}else{
            		reject(response)
            		Toast({
					  message: response.data.err_msg,
					  position: 'bottom',
					  duration: 2000
					});
            	}
                
            })
            .catch((error) => {
               reject(error)
               Toast({
				  message: '网络错误',
				  position: 'bottom',
				  duration: 2000
				});
            })
    })
}
export default {
	
	//微信分享签名
	wechatSign(params) {
		return fetchGet(url + 'wechat/getjsapi/signpackage', params)
	},
	
	//充值种类
	rechargeList(params) {
		return fetchGet(url + 'home/rechargeList', params)
	},
	
	//充值积分生成订单
	rechargeOrder(token,params) {
		return fetchPost(url + 'order/recharge?access_token='+ token, params)
	},
	
	//微信支付
	wechatPay(token,params) {
		return fetchPost(url + 'wechat/send/pay?access_token='+ token, params)
	},
	
	//产品首页
	homeIndex(params) {
		return fetchGet(url + 'home', params)
	},
	
	//产品分类
	productCate() {
		return fetchGet(url + 'productcate/list')
	},
	
	//产品详情
	productDetail(params) {
		return fetchGet(url + 'product/info', params)
	},
	
	//各类产品列表
	productList(params) {
		return fetchGet(url + 'product/list', params)
	},
	
	//产品搜索
	productSearch(params) {
		return fetchGet(url + 'product/search', params)
	},
	
	//热门商品词
	productHotkey() {
		return fetchGet(url + 'product/hotkey')
	},
	
	
	//活动列表
	activityList(params) {
		return fetchGet(url + 'act/list', params)
	},
	
	//活动详情
	activityDetail(params) {
		return fetchGet(url + 'act/info', params)
	},
	
	//活动现场
	activitySite(params) {
		return fetchGet(url + 'act/actInfo', params)
	},
	
	//活动详细介绍
	activityIntro(params) {
		return fetchGet(url + 'act/desc', params)
	},
	
	//报名活动
	activityJoin(token, params) {
		return fetchPost(url + 'act/join?access_token='+ token, params)
	},
	
	//判断绑定手机号
	isBindPhone(token, params) {
		return fetchPost(url + 'members/isBindPhone?access_token='+ token, params)
	},
	
	//修理案例首页
	repairIndex(params) {
		return fetchGet(url + 'home/repair', params)
	},
	
	//点赞案例
	praiseRepair(params) {
		return fetchGet(url + 'repair/praise', params)
	},
	
	//购买案例
	repairBuy(token, params) {
		return fetchPost(url + 'repair/buy?access_token='+ token, params)
	},
	
	//修理案例列表
	repairList(params) {
		return fetchGet(url + 'repair/list', params)
	},
	
	//修理案例详情
	repairDetail(params) {
		return fetchGet(url + 'repair/info', params)
	},
	
	//案例评论列表
	repairComment(params) {
		return fetchGet(url + 'repair/commentList', params)
	},
	
	//案例评论
	repairCommentText(token, params) {
		return fetchPost(url + 'repair/comment?access_token='+ token, params)
	},
	
	//案例搜索
	repairSearch(params) {
		return fetchGet(url + 'repair/search', params)
	},
	
	
	
	//获取省份
	provinceList(params) {
		return fetchGet(url + 'areas/provinces', params)
	},
	
	//获取城市
	cityList(params) {
		return fetchGet(url + 'areas/provinces/' + params + '/cities')
	},
	
	//获取县区
	areaList(params) {
		return fetchGet(url + 'areas/cities/' + params + '/counties')
	},
	
	//积分兑换商品
	productBuy(token,params) {
		return fetchPost(url + 'product/buy?access_token='+ token, params)
	},
	
	//修改车牌号
	chargeCarNumber(token,params) {
		return fetchPost(url + 'members/licenseNum?access_token='+ token, params)
	},
	
	//修改头像
	chargeUserAvatar(token,params) {
		return fetchPost(url + 'members/avatar?access_token='+ token, params)
	},
	
	//上传案例
	repairAdd(token,params) {
		return fetchPost(url + 'repair/add?access_token='+ token, params)
	},
	
	//修改上传案例
	repairEdit(token,params) {
		return fetchPost(url + 'repair/edit?access_token='+ token, params)
	},
	
	
	//修改性别
	chargeUserGender(token,params) {
		return fetchPost(url + 'members/gender?access_token='+ token, params)
	},
	
	//修改昵称
	chargeUserNickname(token,params) {
		return fetchPost(url + 'members/nickname?access_token='+ token, params)
	},
	
	//修改门店
	chargeUserStore(token,params) {
		return fetchPost(url + 'members/storeAddress?access_token='+ token, params)
	},
	
	//使用优惠券
	useCoupon(token,params) {
		return fetchPost(url + 'memberCoupon/use?access_token='+ token, params)
	},
	
	//确认收货
	confirmOrderReceipt(token,params) {
		return fetchPost(url + 'order/receipt?access_token='+ token, params)
	},
	
	//领取优惠券
	getCoupon(token,params) {
		return fetchPost(url + 'agent/receive?access_token='+ token, params)
	},
	
	//积分兑换的商品列表
	pointProductList(params) {
		return fetchGet(url + 'product/pointProductlist', params)
	},
	
	//个人中心
	userCenter(params) {
		return fetchGet(url + 'members/ucenter', params)
	},
	
	//用户信息
	memberInfo(params) {
		return fetchGet(url + 'members', params)
	},
	
	//已购案例
	buyRepairList(params) {
		return fetchGet(url + 'repair/buyList',params)
	},
	
	//我上传的案例
	UpdataRepairList(params) {
		return fetchGet(url + 'repair/mine',params)
	},
	
	//删除上传的案例
	deleteRepair(params) {
		return fetchGet(url + 'repair/del',params)
	},
	
	//上传的案例收入明细
	repairIncome(params) {
		return fetchGet(url + 'repair/orderInfo',params)
	},
	
	//商品订单列表
	orderList(params) {
		return fetchGet(url + 'order/list',params)
	},
	//商品订单详情
	orderDetail(params) {
		return fetchGet(url + 'order/info',params)
	},
	
	//修理工用户积分
	myIntegral(params) {
		return fetchGet(url + 'points/logs',params)
	},
	
	//用户参加活动列表
	myActivityList(params) {
		return fetchGet(url + 'act/myList',params)
	},
	
	//线下消费订单记录
	consumerOrderList(params) {
		return fetchGet(url + 'agentOrder/list',params)
	},
	
	//线下消费订单详情
	consumerOrderDetail(params) {
		return fetchGet(url + 'agentOrder/info',params)
	},
	
	//附近修理店
	repairShopList(params) {
		return fetchGet(url + 'agent/list',params)
	},
	
	//修理店详情
	repairShopDetail(params) {
		return fetchGet(url + 'agent/info',params)
	},
	
	//修理店评论
	orderComment(token, params) {
		return fetchPost(url + 'agentOrder/comment?access_token='+ token, params)
	},
	
	//修理店评价列表
	repairShopComment(params) {
		return fetchGet(url + 'agent/comment',params)
	},
	
	//车主优惠券
	myCoupon(params) {
		return fetchGet(url + 'memberCoupon/list',params)
	},
	
	//订单列表
	getOrderRecord(params) {
        return fetchGet('/order/list?access_token='+access_token,params)
    },
	
	
	//运营商下拉
	getOperator() {
        return fetchGet('/select/getOperator?access_token='+access_token)
    },
    
    //一期碎片确认收货
	receiveGoods(token,params) {
		return fetchPost(url + '/game/wheel/chips/'+params+'/receipt?access_token='+ token)
	},
    
}
