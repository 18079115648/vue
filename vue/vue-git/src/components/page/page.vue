<<template>
  
</template>

<script>
import axios from 'axios'
import { storageSet, GetQueryString } from '../../../static/js/app.js'
export default {
    data() {
        return {
            phone: '',
            vir: '',
            shin: true,
            num: 60,
            btn: true,
            name: '',
            id: '',
            headimgurl: '',
            sex: ''}
},
created() {
		var flag = false
		var timestamp = Date.parse(new Date())
		timestamp = timestamp / 1000
		if(localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == undefined || !localStorage.getItem('access_token')) { 
    	flag = true
    } else if (parseInt(localStorage.getItem('expire_time')) < timestamp) {
      flag = true
    } else if (localStorage.getItem('expire_time') == null || localStorage.getItem('expire_time') == undefined || !localStorage.getItem('expire_time')) {
      flag = true
    }
    if(!flag) {
    	this.$router.go(-2)
    	return
    }
    var self = this
    console.log('url' + self.$store.state.page)
    var qs = require('qs')
    var codi = GetQueryString('code')
    localStorage.setItem('pagecode', codi)
    this.$axios.get(this.$store.state.uri + 'wechat/getopenid/' + codi + '?app_id=' + this.$store.state.appID + '&app_secret=' + this.$store.state.appsecret)
        .then((msg) => {
            this.$store.dispatch('get_wx_token', msg.data.result.access_token)
            this.$store.dispatch('get_Openid', msg.data.result.openid)
            this.$axios.get(this.$store.state.uri + 'wechat/userinfo?access_token=' + msg.data.result.access_token + '&openid=' + msg.data.result.openid)
                .then((res) => {
                    var name = res.data.result.nickname
                    var id = res.data.result.openid
                    localStorage.setItem('openid', res.data.result.openid)
                    var url = res.data.result.headimgurl
                    var sex = res.data.result.sex
                    this.name = name
                    this.id = id
                    this.headimgurl = url
                    this.sex = sex
                    this.$store.dispatch('get_User', {name, id, url})
                    // console.log(res.data.result)
                    axios.post(this.$store.state.uri + 'members/oauth/login', qs.stringify({
                        avatar: url,
                        nickname: name,
                        oauth_id: id,
                        sex: sex
                    }), {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'version': '1.0.1'
                        }
                    })
                    .then((obj) => {
                        localStorage.setItem('access_token', obj.data.result.access_token)
                        var timestamp = Date.parse(new Date()) / 1000 + obj.data.result.expire_time - 300
                        console.log(obj.data.result.expire_time)
                        localStorage.setItem('expire_time', timestamp)
                        localStorage.setItem('refresh_token', obj.data.result.refresh_token)
                        localStorage.setItem('bing_mobile_status', obj.data.bing_mobile_status)
                        // addCookie('access_token', res.data.result.access_token)
                        // addCookie('access_token', res.data.result.access_token)
                        if (obj.data.bing_mobile_status !== 1) {
                            window.location.href = this.$store.state.back_uri + '#/login'
                        } else {
                            window.location.href = this.$store.state.back_uri + localStorage.getItem('url')
                        }
                    })
                    .catch((erron) => {
                        console.log(erron)
                    })
                })
                .catch((erron) => {
                    console.log(erron)
                })
        })
        .catch((erron) => {
            console.log(erron)
        })
    }
}
</script>

<style lang="scss">

</style>
