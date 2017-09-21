<template>
    <header>
    	<div class="back" @click="back" v-if="backStatus"></div>
    	<div class="header-text">{{title}}</div>
    </header>
</template>

<script>
export default {
	props: {
        title: {
            type: String
        },
        backType: {
        	type: String,
        	default: 'normal'
        },
        backStatus: {
        	type: Boolean,
        	default: true
        }
    },

	methods: {
	  	back() {
	  		if(this.backType == 'normal') {
	  			this.$router.go(-1)
	  		}else {
	  			if(window.history.length > 1) {
					this.$router.go(-1)
				} else {
					this.$router.replace(this.backType)
				}
	  		}
	  	}
	}
}
</script>

<style scoped>
header{
	height: 0.9rem;
	line-height: 0.9rem;
	color: #fff;
	
	display: flex;
	background: #39B382;
	z-index: 50;
	position: fixed;
	width: 100%;
	left: 0;
	top: 0;
	/*background-image: url(../../../static/image/border.png);
	background-repeat: repeat-x;
	background-position: 0 bottom;
	background-size: auto 1px;*/
}
.back{
	width: 0.9rem;
	height: 0.9rem;
	background: url(../../../static/image/white-arror.png) no-repeat center;
	background-size: 20%;
}
.header-text{
	position: absolute;
	left: 0.9rem;
	top: 0;
	width: 5.7rem;
	text-align: center;
	font-size: 0.32rem;
}

</style>