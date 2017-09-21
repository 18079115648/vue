// /////////////////////////////////SATRT////////////////////////////////////////

import store from '@/vuex/store.js'
import wx from 'weixin-js-sdk'

export function storageSet(key, value) {
	return localStorage.setItem(key, value);
}
export function storageGet(key) {
	return localStorage.getItem(key);
}
export function storageRemove(key) {
	return localStorage.removeItem(key);
}

export function markTime(time) {
	var hour = Math.floor(time / 3600);
	var min = Math.floor(time / 60);
	var sec = Math.floor(time % 60);
	min = min > 9 ? min : '0' + min;
	sec = sec > 9 ? sec : '0' + sec;
	hour = hour > 9 ? hour : '0' + hour;
	if(hour > 0) {
		return hour + ':' + min + ':' + sec
	}
	return min + ':' + sec
}

export function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}

export function GetQueryStringOther(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var param=window.location.hash.split('?')[1];
    if(!param){
    	return null
    }
    var r = window.location.hash.split('?')[1].match(reg)
    if (r != null) return unescape(r[2])
    return null
}

// 验证验证码 必须为数字和字母
export function checkCode(str) {
    var re = /^[a-z0-9A-Z]+$/
    var m = true
    if (re.test(str)) {
        m = true
    } else {
        m = false
    }
    return m
}

// 验证姓名 2-4 位
export function checkName(str) {
    var re = /^[\u4E00-\u9FA5]{2,4}$/
    var m = true
    if (re.test(str)) {
        m = true
    } else {
        m = false
    }
    return m
}

// 验证手机号
export function checkMobile(str) {
    // /^1\d{10}$/
    var re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/
    var m = true
    if (re.test(str)) {
        m = true
    } else {
        m = false
    }
    return m
}

// 验证邮箱
export function checkEmail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(str)) {
        alert('正确')
    } else {
        alert('错误')
    }
}

/*eslint-disable */
// cookie
// 添加一个cookie：   addCookie(name,value,expiresHours) 
// 该函数接收3个参数：cookie名称，cookie值，以及在多少小时后过期。这里约定expiresHours为0时不设定过期时间，即当浏览器关闭时cookie自动消失。
export function addCookie(name, value, expiresHours) {

    var cookieString = name + "=" + escape(value);

    if (expiresHours > 0) { //判断是否设置过期时间 
        var date = new Date();
        date.setTime(date.getTime + expiresHours * 3600 * 1000);
        cookieString = cookieString + "; expires=" + date.toGMTString();
    }

    document.cookie = cookieString;

}

// 获取指定名称的cookie值：getCookie(name) 
// 该函数返回名称为 name 的 cookie 值，如果不存在则返回空
export function getCookie(name) {

    var strCookie = document.cookie;

    var arrCookie = strCookie.split("; ");

    for (var i = 0; i < arrCookie.length; i++) {

        var arr = arrCookie[i].split("=");
        if (arr[0] == name) return arr[1];

    }

    return "";
}

// 删除指定名称的cookie：deleteCookie(name) 
// 该函数可以删除指定名称的cookie
export function deleteCookie(name) {

    var date = new Date();

    date.setTime(date.getTime() - 10000);

    document.cookie = name + "=v; expires=" + date.toGMTString();

}
/*eslint-enable */

// 判断是安卓还是ios
export function getModileType() {
    var u = navigator.userAgent
        // var app = navigator.appVersion
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
        return 1
    }
    if (isIOS) {
        return 2
    }
}

// 登陆
export function Autho(self) {
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
        // localStorage.removeItem('url')
    if (localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == undefined || !localStorage.getItem('access_token')) {
        // alert('access_token = ' + localStorage.getItem('access_token'))
        localStorage.setItem('url', window.location.hash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'

    } else if (parseInt(localStorage.getItem('expire_time')) < timestamp) {
        // alert('expire-time = ' + localStorage.getItem('expire_time'))
        localStorage.setItem('url', window.location.hash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'

    } else if (localStorage.getItem('expire_time') == null || localStorage.getItem('expire_time') == undefined || !localStorage.getItem('expire_time')) {
        localStorage.setItem('url', window.location.hash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'

    }
}


// 登陆
export function SecondAutho(urlHash) {
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
	if(!urlHash) {
		urlHash = window.location.hash
	}
        // localStorage.removeItem('url')
    if (localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == undefined || !localStorage.getItem('access_token')) {
        // alert('access_token = ' + localStorage.getItem('access_token'))
//      localStorage.setItem('url', window.location.hash)
        localStorage.setItem('url', urlHash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
    	return false
    } else if (parseInt(localStorage.getItem('expire_time')) < timestamp) {
        // alert('expire-time = ' + localStorage.getItem('expire_time'))
        localStorage.setItem('url', urlHash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
    	return false
    } else if (localStorage.getItem('expire_time') == null || localStorage.getItem('expire_time') == undefined || !localStorage.getItem('expire_time')) {
        localStorage.setItem('url', urlHash)
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.appID + '&redirect_uri=' + encodeURIComponent(store.state.back_uri +'/#/page') + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
    	return false
    }
    return true
}

export function loadJssdk(lineLink, imgUrl, shareTitle, descContent) {
    wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: lineLink, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        desc: descContent, // 分享描述
        title: shareTitle, // 分享标题
        link: lineLink, // 分享链接
        imgUrl: imgUrl, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        desc: descContent, // 分享描述
        title: shareTitle, // 分享标题
        link: lineLink, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
