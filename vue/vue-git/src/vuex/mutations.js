export default {
    getimg(state, data) {
        state.img = data
    },
    getwx_token(state, data) {
        state.wx_access_token = data
    },
    getOpenid(state, data) {
        state.openID = data
    },
    getUser(state, { nickname, id, headimgurl }) {
        state.nickname = nickname
        state.user_openid = id
        state.headimgurl = headimgurl
    },
    getpics(state, data) {
        state.pics = data
    },
    getname(state, data) {
        state.prize_name = data
    },
    gettype(state, data) {
        state.type = data
    },
    getwheels(state, data) {
        state.wheels = data
    },
    getrecords(state, data) {
        state.records = data
    },
    getchip_id(state, data) {
        state.chip_id = data
    },
    getusername(state, data) {
        state.username = data
    },
    getuserphone(state, data) {
        state.userphone = data
    },
    getuseraddress(state, data) {
        state.useraddress = data
    },
    getpage(state, data) {
        state.page = data
    },
    getifor(state, data) {
        state.ifor = data
    },
    
    setLoadingStatus(state, status) {
    	state.loadingStatus = status
    }
}