export default {
    get_img({ commit }, data) {
        commit('getimg', data)
    },
    get_wx_token({ commit }, data) {
        commit('getwx_token', data)
    },
    get_Openid({ commit }, data) {
        commit('getOpenid', data)
    },
    get_User({ commit }, { nickname, id, headimgurl }) {
        commit('getUser', { nickname, id, headimgurl })
    },
    get_pics({ commit }, data) {
        commit('getpics', data)
    },
    get_name({ commit }, data) {
        commit('getname', data)
    },
    get_type({ commit }, data) {
        commit('gettype', data)
    },
    get_wheels({ commit }, data) {
        commit('getwheels', data)
    },
    get_records({ commit }, data) {
        commit('getrecords', data)
    },
    get_chip_id({ commit }, data) {
        commit('getchip_id', data)
    },
    get_username({ commit }, data) {
        commit('getusername', data)
    },
    get_userphone({ commit }, data) {
        commit('getuserphone', data)
    },
    get_useraddress({ commit }, data) {
        commit('getuseraddress', data)
    },
    get_page({ commit }, data) {
        commit('getpage', data)
    },
    get_ifor({ commit }, data) {
        commit('getifor', data)
    },
    
    getLoadingStatus({ commit }, data) {
        commit('setLoadingStatus', data)
    }
}