<template>
	<transition name="move">
		<div class="enlargeImg-content move-right" v-show="show">
			<div class="header">
				<div class="back" @click="back"></div>
    			<div class="header-text" ><span v-if="type == 'img'">{{currIndex+1}}/{{length}}</span></div>
    			<div class="delete" @click="deleteImg"></div>
			</div>
			<div class="enlargeImg-body">
				<img v-if="type == 'img'" class="fullAuto" :src="imgSrc"  />
				<video 
					v-if="type == 'video' && videoSrc" 
					:src="videoSrc" 
					class="video fullAuto" 
					webkit-playsinline="true" 
			      	x-webkit-airplay="true"  
			      	playsinline="true"
					controls="controls" >
			    </video>
			</div>
		</div>
	</transition>
    
</template>

<script>
export default {
	props: {
        show: {
            type: Boolean
        },
        length: {
        	type: Number
        },
        type: {
        	type: String
        },
        currIndex: {
        	type: Number
        },
        imgSrc: {
        	type: String
        },
        videoSrc: {
        	type: String
        },
        videoType: {
        	type: String
        }
    },
    methods: {
    	back() {
    		this.$emit('closeEnlarge')
    	},
    	deleteImg() {
    		if(this.type == 'img') {
    			this.$emit('deleteImg')
    		}else if(this.type == 'video') {
//  			this.videoSrc = undefined
    			this.$emit('deleteVideo')
    		}
    		
    	}
    },
//  computed: {
//  	
//  }
   
}
</script>

<style scoped>
.enlargeImg-content{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 100;
	background: #333;
	transition: transform .1s ease-out;
}
.enlargeImg-content.move-enter-avtive,.enlargeImg-content.move-leave{
    transform: translate3d(0,0,0);
}
.enlargeImg-content.move-enter{
    transform: translate3d(100%,0,0);
}
.enlargeImg-content.move-leave-active{
	transform: translate3d(100%,0,0);
}
.header{
	height: 0.9rem;
	line-height: 0.9rem;
	color: #fff;
	
	display: flex;
	background: #39B382;
}
.back{
	width: 0.9rem;
	height: 0.9rem;
	background: url(../../../static/image/white-arror.png) no-repeat center;
	background-size: 20%;
}
.header-text{
	width: 5.5rem;
	
	padding-left: 0.2rem;
}
.header-text span{
	font-size: 0.36rem;
}
.delete{
	width: 1.1rem;
	height: 0.9rem;
	background: url(../../../static/image/delete-white.png) no-repeat center;
	background-size: 40%;
}
.enlargeImg-body{
	position: absolute;
	left: 0;
	top: 0.9rem;
	bottom: 0;
	right: 0;
	overflow-y: auto;
	-webkit-overflow-scrolling : touch;
}
.video{
	display: block;
	max-width: 100%;
	margin: 0 auto;
	max-height: 50%;
}
</style>