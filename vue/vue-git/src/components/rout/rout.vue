<template>
<section>
    <div class="ly-plate">
        <div class="model"></div>
        <div class="rotate-bg"></div>
	    <div class="lottery-star"><img src="./rotate-static.png" id="lotteryBtn"></div>
    </div>
    <machines v-if="show"></machines>
</section>
</template>

<script>
import axios from 'axios'
import {ready, drawRouletteWheel} from '../../../static/js/app.js'
import machines from '../machines/machines'
    export default {
        components: {
            machines
        },
        data() {
            return {
                show: false,
                wheels: [],
                records: []
            }
        },
        created () {
            var self = this
            this.$nextTick(() => {
            axios.get('static/whweel.json').then((res) => {
                self.wheels = res.data.result.wheels
                self.records = res.data.result.records
                ready(this.wheels)
                drawRouletteWheel()
            }).catch()
            })
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style lang="scss">
    * { touch-action: none; }; 
    @import './style.scss';
    .ly-plate {
        position: fixed;
        width: 100%;
        div.rotate-bg {
            left: 50%;
            margin-left: -254.5px
        }
        div.lottery-star {
            left: 50%;
            margin-left: -107px;
        }
    }
    .model {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 999;
        display: none
    }
</style>