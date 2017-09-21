<template>
    <section>
    	<div class="back" @click="back"></div>
    	<section class="product-banner">
        	<mt-swipe :auto="0" >
			  <mt-swipe-item v-for="(item, index) in detail_data.imgs" :key="index">
			  	<img class="fullEle" :src="item" />
			  </mt-swipe-item>
			</mt-swipe>
        </section>
        <section class="product-desc">
        	<p class="product-name">{{detail_data.name}}</p>
        	<p class="product-price">&yen; {{Number(detail_data.price).toFixed(2)}}</p>
        </section>
        <section class="product-detail-content">
        	<p class="product-detail-tit">产品详情</p>
        	<div class="product-desc-content content-html" v-html="detail_data.description"></div>
        </section>
        
    </section>
</template>

<script>
import axios from 'axios'
import api from '@/fetch/api'
export default {
	data() {
		return {
		  product_id:undefined,
		  detail_data:{}
    	}
	},
	mounted() { 
	    
    },
    created() {
    	this.product_id = window.location.hash.split('/')[2]
    	api.productDetail({
        	params:{
			    id: this.product_id
			}
	    }).then((res) => {
           this.detail_data = res.data.result
        }).catch((err) => {
            console.log(err)
        })
    },
    methods: {
  	  back() {
  		if(window.history.length > 1) {
			this.$router.go(-1)
		} else {
			this.$router.replace('/productCenter')
		}
  	  }
  	  
  }
}
</script>

<style scoped>
.back{
	width: 0.6rem;
	height: 0.6rem;
	background: rgba(0,0,0,0.4) url(../../../static/image/white-arror.png) no-repeat center;
	background-size: 30%;
	border-radius: 50%;
	position: fixed;
	left: 0.2rem;
	top: 0.2rem;
	z-index: 20;
}
.product-banner{
	height: 4rem;
}
.product-desc{
	padding: 0.3rem;
	border-bottom: 0.2rem solid #F5F5F9;
}
.product-name{
	line-height: 1.3;
	overflow:hidden; 
    text-overflow:ellipsis;
	display:-webkit-box; 
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2; 
}
.product-price{
	padding-top: 0.4rem;
	color: #f26200;
	font-size: 0.32rem;
}
.product-detail-tit{
	padding: 0.3rem;
}
.product-desc-content{
	padding: 0.1rem 0.3rem;
}

</style>