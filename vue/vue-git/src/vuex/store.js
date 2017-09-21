import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    // uri: 'http://121.41.101.63:8088/pm-api/',
    uri: '/pm-api/',
    back_uri: 'http://h5.czszdq.com',
    appID: 'wx0bb8b873da0be6b2',
    appsecret: '4be7f5bcbdc93b70df514c1a16178afe',
//  back_uri: 'http://songze.ydd100.cn',
//  appID: 'wx217d8ec2472ac757',
//  appsecret: '98f2aef9df683aff59a69d52c613c1c4',
//  appID: 'wxa44aee61d206be4a',
//  appsecret: '82247ce969bf0b7f3e12a636fe87434f',

//	appID: 'wxa19cf213af9686ad',
//  appsecret: '1b10e11fe2c9747db9ed137a4c2041a2',
//  back_uri: 'http://192.168.0.12:830',  
    wx_access_token: '',
    openID: '',
    bing_mobile_status: 0,
    access_token: '',
    nickname: '',
    user_openid: '',
    headimgurl: '',
    img: [],
    pics: '',
    prize_name: '',
    type: '',
    wheels: '',
    records: '',
    chip_id: '',
    username: null,
    userphone: '',
    useraddress: '',
    page: '',
    ifor: false,
    loadingStatus: false
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
})