<template>
    <div class="wheels">
        <div class="banner">
            <div class="turnplate" style="background-image:url(static/images/cj_bg.png);background-size:100% 100%;">
                <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas>
                <img class="pointer" src="static/images/jt2.png"/>
            </div>
        </div>
        <img v-for="wheel in wheels" :src="wheel.pic" :id="'shan-img-' + wheel.wheel_id" ref="'img' + wheel.wheel_id" style="display:none;"/>
    </div>
</template>

<script>
import {ready, drawRouletteWheel} from '../../../static/js/app.js'
import axios from 'axios'
export default {
  components :{
  },
  data () {
    return {
      wheels: [],
      records: []
    }
  },
  props: {
  },
  created () {
  },
  mounted () {
    axios.get('static/whweel.json').then((res) => {
        this.wheels = res.data.result.wheels
        this.records = res.data.result.records
        ready(this.wheels)
        drawRouletteWheel()
    }).catch()
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
	.banner{display:block;width:95%;margin-left:auto;margin-right:auto;margin-bottom: 20px;}
	.banner .turnplate{display:block;width:100%;position:relative;}
	.banner .turnplate canvas.item{width:100%;}
	.banner .turnplate img.pointer{position:absolute;width:36%;height:40%;left:32%;top:28%;}
	.more{display: block;width: 100%;position: fixed;top: 0;left: 0;height: 150px;}
	.cloud{position: fixed;left: 0;top: 70%;width: 150px;}
	.cloud2{position: fixed;right: 0;top: 32%;width: 50px;}
	.cloud3{position: fixed;left: 0;top: 30%;width: 100px;}
	@media screen and (max-width: 320px) {
		.cloud{position: fixed;left: 0;top: 70%;width: 150px;}
		.cloud2{position: fixed;right: 0;top: 30%;width: 50px;}
		.cloud3{position: fixed;left: 0;top: 23%;width: 100px;}
	}
	@media screen and (min-width: 321px) and (max-width: 375px) {
		.cloud{position: fixed;left: 0;top: 72%;width: 150px;}
		.cloud2{position: fixed;right: 0;top: 32%;width: 50px;}
		.cloud3{position: fixed;left: 0;top: 25%;width: 100px;}
	}
	@media screen and (min-width: 376px) {
		.cloud{position: fixed;left: 0;top: 68%;width: 150px;}
		.cloud2{position: fixed;right: 0;top: 32%;width: 50px;}
		.cloud3{position: fixed;left: 0;top: 25%;width: 100px;}
	}
	@media screen and (max-height: 480px) {
		.cloud{position: fixed;left: 0;top: 81%;width: 150px;}
		.cloud2{position: fixed;right: 0;top: 35%;width: 50px;}
		.cloud3{position: fixed;left: 0;top: 27%;width: 100px;}
	}

	#mark{width: 100%;height: 100%;background: rgba(0,0,0,0.5);position: fixed;top: 0;left: 0;display: none;}
	.red-img{position: fixed;top: 10%;left: 5%;width: 90%;}
</style>