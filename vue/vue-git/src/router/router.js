const home = r => require.ensure([], () => r(require('../components/home/home.vue')), 'home')
const roulette = r => require.ensure([], () => r(require('../components/RussianRoulette/RussianRoulette.vue')), 'roulette')
const user = r => require.ensure([], () => r(require('../components/user/user.vue')), 'user')
const score = r => require.ensure([], () => r(require('../components/user/score.vue')), 'score')
const puzzle = r => require.ensure([], () => r(require('../components/user/puzzle.vue')), 'puzzle')
const userinfo = r => require.ensure([], () => r(require('../components/user/userinfo.vue')), 'userinfo')
const about = r => require.ensure([], () => r(require('../components/user/about.vue')), 'about')
const qrcode = r => require.ensure([], () => r(require('../components/qrcode/qrcode.vue')), 'qrcode')
const instructions = r => require.ensure([], () => r(require('../components/RussianRoulette/instructions.vue')), 'instructions')
const info = r => require.ensure([], () => r(require('../components/RussianRoulette/info.vue')), 'info')
const login = r => require.ensure([], () => r(require('../components/login/login.vue')), 'login')
const page = r => require.ensure([], () => r(require('../components/page/page.vue')), 'page')
const productCenter = r => require.ensure([], () => r(require('@/components/product/productCenter.vue')), 'productCenter')
const productSearch = r => require.ensure([], () => r(require('@/components/product/productSearch.vue')), 'productSearch')
const productList = r => require.ensure([], () => r(require('@/components/product/productList.vue')), 'productList')
const productDetail = r => require.ensure([], () => r(require('@/components/product/productDetail.vue')), 'productDetail')
const productKind = r => require.ensure([], () => r(require('@/components/product/productKind.vue')), 'productKind')
const activityList = r => require.ensure([], () => r(require('@/components/product/activityList.vue')), 'activityList')
const activityDetail = r => require.ensure([], () => r(require('@/components/product/activityDetail.vue')), 'activityDetail')
const activitySite = r => require.ensure([], () => r(require('@/components/product/activitySite.vue')), 'activitySite')
const activityIntro = r => require.ensure([], () => r(require('@/components/product/activityIntro.vue')), 'activityIntro')
const activityJoin = r => require.ensure([], () => r(require('@/components/product/activityJoin.vue')), 'activityJoin')
const repairCenter = r => require.ensure([], () => r(require('@/components/repair/repairCenter.vue')), 'repairCenter')
const repairSearch = r => require.ensure([], () => r(require('@/components/repair/repairSearch.vue')), 'repairSearch')
const repairList = r => require.ensure([], () => r(require('@/components/repair/repairList.vue')), 'repairList')
const repairDetail = r => require.ensure([], () => r(require('@/components/repair/repairDetail.vue')), 'repairDetail')
const repairCommentText = r => require.ensure([], () => r(require('@/components/repair/repairCommentText.vue')), 'repairCommentText')
const repairComment = r => require.ensure([], () => r(require('@/components/repair/repairComment.vue')), 'repairComment')
const updataStep1 = r => require.ensure([], () => r(require('@/components/updata/updataStep1.vue')), 'updataStep1')
const editUpdataStep1 = r => require.ensure([], () => r(require('@/components/updata/editUpdataStep1.vue')), 'editUpdataStep1')
const updataStep2 = r => require.ensure([], () => r(require('@/components/updata/updataStep2.vue')), 'updataStep2')
const updataDetail = r => require.ensure([], () => r(require('@/components/updata/updataDetail.vue')), 'updataDetail')
const chargeList = r => require.ensure([], () => r(require('@/components/charge/chargeList.vue')), 'chargeList')
const chargeDetail = r => require.ensure([], () => r(require('@/components/charge/chargeDetail.vue')), 'chargeDetail')
const addressInput = r => require.ensure([], () => r(require('@/components/charge/addressInput.vue')), 'addressInput')
const repairUser = r => require.ensure([], () => r(require('@/components/repairPerson/repairUser.vue')), 'repairUser')
const repairUserInfo = r => require.ensure([], () => r(require('@/components/repairPerson/repairUserInfo.vue')), 'repairUserInfo')
const repairUserName = r => require.ensure([], () => r(require('@/components/repairPerson/repairUserName.vue')), 'repairUserName')
const repairUserStore = r => require.ensure([], () => r(require('@/components/repairPerson/repairUserStore.vue')), 'repairUserStore')
const buyRepairList = r => require.ensure([], () => r(require('@/components/repairPerson/buyRepairList.vue')), 'buyRepairList')
const myIntegral = r => require.ensure([], () => r(require('@/components/repairPerson/myIntegral.vue')), 'myIntegral')
const myActivityList = r => require.ensure([], () => r(require('@/components/repairPerson/myActivityList.vue')), 'myActivityList')
const recharge = r => require.ensure([], () => r(require('@/components/repairPerson/recharge.vue')), 'recharge')
const allUpdataCase = r => require.ensure([], () => r(require('@/components/repairPerson/allUpdataCase.vue')), 'allUpdataCase')
const caseProfit = r => require.ensure([], () => r(require('@/components/repairPerson/caseProfit.vue')), 'caseProfit')
const myOrders = r => require.ensure([], () => r(require('@/components/repairPerson/myOrders.vue')), 'myOrders')
const orderDetail = r => require.ensure([], () => r(require('@/components/repairPerson/orderDetail.vue')), 'orderDetail')
const repairShopList = r => require.ensure([], () => r(require('@/components/carOfOwner/repairShopList.vue')), 'repairShopList')
const baiduMap = r => require.ensure([], () => r(require('@/components/carOfOwner/baiduMap.vue')), 'baiduMap')
const repairShopDetail = r => require.ensure([], () => r(require('@/components/carOfOwner/repairShopDetail.vue')), 'repairShopDetail')
const repairShopComment = r => require.ensure([], () => r(require('@/components/carOfOwner/repairShopComment.vue')), 'repairShopComment')
const carUser = r => require.ensure([], () => r(require('@/components/carOfOwner/carUser.vue')), 'carUser')
const carUserInfo = r => require.ensure([], () => r(require('@/components/carOfOwner/carUserInfo.vue')), 'carUserInfo')
const carUserIntegral = r => require.ensure([], () => r(require('@/components/carOfOwner/carUserIntegral.vue')), 'carUserIntegral')
const myCoupon = r => require.ensure([], () => r(require('@/components/carOfOwner/myCoupon.vue')), 'myCoupon')
const myCarNumber = r => require.ensure([], () => r(require('@/components/carOfOwner/myCarNumber.vue')), 'myCarNumber')
const consumerOrders = r => require.ensure([], () => r(require('@/components/carOfOwner/consumerOrders.vue')), 'consumerOrders')
const consumerOrderDetail = r => require.ensure([], () => r(require('@/components/carOfOwner/consumerOrderDetail.vue')), 'consumerOrderDetail')
const orderComment = r => require.ensure([], () => r(require('@/components/carOfOwner/orderComment.vue')), 'orderComment')




const index = r => require.ensure([], () => r(require('@/components/index.vue')), 'index')



export default  [{
        path: '/index',
        component: index
    }, {
        path: '/roulette',
        component: roulette
    }, {
        path: '/user',
        component: user
    }, {
        path: '/user/score',
        component: score
    }, {
        path: '/user/puzzle',
        component: puzzle
    }, {
        path: '/user/puzzle/userinfo',
        component: userinfo
    }, {
        path: '/user/about',
        component: about
    }, {
        path: '/qrcode',
        component: qrcode
    }, {
        path: '/roulette/instructions',
        component: instructions
    }, {
        path: '/roulette/info',
        component: info
    }, {
        path: '/login',
        component: login
    }, {
        path: '/page',
        component: page
    }, {
        path: '/productCenter',
        component: productCenter,
        meta: { keepAlive: true }
    }, {
        path: '/productSearch',
        component: productSearch,
        meta: { keepAlive: true }
    }, {
        path: '/productList/:id',
        component: productList,
        meta: { keepAlive: true }
    }, {
        path: '/productDetail/:id',
        component: productDetail
    }, {
        path: '/productKind/:id',
        component: productKind
    }, {
        path: '/activityList',
        component: activityList,
        meta: { keepAlive: true }
    }, {
        path: '/activityDetail/:id',
        component: activityDetail
    }, {
        path: '/activitySite/:id',
        component: activitySite
    }, {
        path: '/activityIntro/:id',
        component: activityIntro
    }, {
        path: '/activityJoin/:id',
        component: activityJoin
    }, {
        path: '/repairCenter',
        component: repairCenter,
        meta: { keepAlive: true }
    }, {
        path: '/repairSearch',
        component: repairSearch,
        meta: { keepAlive: true }
    }, {
        path: '/repairList/:id',
        component: repairList,
        meta: { keepAlive: true }
    }, {
        path: '/repairDetail/:id',
        component: repairDetail
    }, {
        path: '/repairComment/:id',
        component: repairComment
    }, {
        path: '/repairCommentText/:id',
        component: repairCommentText
    }, {
        path: '/updataStep1',
        component: updataStep1
    }, {
        path: '/editUpdataStep1/:id',
        component: editUpdataStep1
    }, {
        path: '/updataStep2',
        component: updataStep2
    }, {
        path: '/updataDetail/:id',
        component: updataDetail
    }, {
        path: '/chargeList',
        component: chargeList,
        meta: { keepAlive: true }
    }, {
        path: '/chargeDetail/:id',
        component: chargeDetail
    }, {
        path: '/addressInput/:id/:id',
        component: addressInput
    }, {
        path: '/repairUser',
        component: repairUser
    }, {
        path: '/repairUserInfo',
        component: repairUserInfo,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/repairUserName',
        component: repairUserName,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/repairUserStore',
        component: repairUserStore,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/buyRepairList',
        component: buyRepairList,
        meta: { keepAlive: true }
    }, {
        path: '/myIntegral',
        component: myIntegral,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/myActivityList',
        component: myActivityList,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/recharge',
        component: recharge
    }, {
        path: '/allUpdataCase',
        component: allUpdataCase
    }, {
        path: '/caseProfit/:id',
        component: caseProfit,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/myOrders',
        component: myOrders,
        meta: {
            requireAouth: true,
            keepAlive: true
        }
    }, {
        path: '/orderDetail/:id',
        component: orderDetail,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/repairShopList',
        component: repairShopList,
        meta: { keepAlive: true }
    }, {
        path: '/baiduMap/:id/:id',
        component: baiduMap
    }, {
        path: '/repairShopDetail/:id',
        component: repairShopDetail
    }, {
        path: '/repairShopComment/:id',
        component: repairShopComment
    }, {
        path: '/carUser',
        component: carUser
    }, {
        path: '/carUserInfo',
        component: carUserInfo
    }, {
        path: '/carUserIntegral',
        component: carUserIntegral
    }, {
        path: '/myCoupon',
        component: myCoupon,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/myCarNumber',
        component: myCarNumber,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/consumerOrders',
        component: consumerOrders,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/orderComment/:id',
        component: orderComment,
        meta: {
            requireAouth: true
        }
    }, {
        path: '/consumerOrderDetail/:id',
        component: consumerOrderDetail,
        meta: {
            requireAouth: true
        }
    }]