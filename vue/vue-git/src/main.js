// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router/router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './vuex/store'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import MuseUI from 'muse-ui'
// import 'muse-ui/dist/muse-ui.css'
import mint from 'mint-ui'
import 'mint-ui/lib/style.css'

import { Autho } from '../static/js/app.js'
import { Toast } from 'mint-ui'


import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
//import BaiduMap from 'vue-baidu-map'
//
//Vue.use(BaiduMap, {
//// ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//ak: 'c8ViDxq9FA8W3TEGrRcEbiLL'
//})
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
            		window.location.href = store.state.back_uri + '#/login'
            	}else if(response.data.err_code==40001) {
            		reject(response)
            		Toast({
					  message: '账号已被禁用，请联系客服',
					  position: 'bottom',
					  duration: 2000
					});
					setTimeout(function() {
						window.opener=null;
						window.open('','_self');
						window.close();
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
            		window.location.href = store.state.back_uri + '#/login'
            	}else if(response.data.err_code==40001) {
            		reject(response)
            		Toast({
					  message: '账号已被禁用，请联系客服',
					  position: 'bottom',
					  duration: 2000
					});
					setTimeout(function() {
						window.opener=null;
						window.open('','_self');
						window.close();
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
Vue.prototype.$axios = {
	get: fetchGet,
	post: fetchPost
}
Vue.config.productionTip = true

Vue.use(VueRouter)
//Vue.use(VueResource)
Vue.use(MuseUI)
Vue.use(mint)
    // import { InfiniteScroll } from 'mint-ui'
    // Vue.use(InfiniteScroll)

const router = new VueRouter({
    routes,
//  mode: 'history',
    strict: process.env.NODE_ENV !== 'production'
})

router.beforeEach((to, from, next) => {
	let href = window.location.href
	let code = window.location.search
	if(to.meta.requireAouth) {
		Autho()
		next()
	}else {
		if(/qrcode/g.test(href)) {
			window.location.href = 'http://' + window.location.host + '/#/qrcode' + code
		}
		next()
	}
    
})

window.alert = function(name) {
    var iframe = document.createElement('IFRAME')
    iframe.style.display = 'none'
    iframe.setAttribute('src', 'data:text/plain,')
    document.documentElement.appendChild(iframe)
    window.frames[0].window.alert(name)
    iframe.parentNode.removeChild(iframe)
}

window.confirm = function(message) {
    var iframe = document.createElement('IFRAME')
    iframe.style.display = 'none'
    iframe.setAttribute('src', 'data:text/plain,')
    document.documentElement.appendChild(iframe)
    var alertFrame = window.frames[0]
    var result = alertFrame.window.confirm(message)
    iframe.parentNode.removeChild(iframe)
    return result
}


/* eslint-disable no-new */
new Vue({
    store,
    router,
    components: { App },
    data() {
        return {}
    },
    methods: {
        GetQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        }
    },
    created() {},
    render: h => h(App)
}).$mount('#app')