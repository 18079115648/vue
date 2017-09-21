<template>
	<section class="fullDiv">
		<top title="评价"></top>
		<div class="repairCommentText">
			<textarea placeholder="请输入您的评价" v-model.trim="commentText"></textarea>
		</div>
		<div class="join-confirm-btn btn-hover" @click="pushComment">提交评价</div>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import api from '@/fetch/api'
	import {Autho, storageGet } from '../../../static/js/app.js'
	import { Toast } from 'mint-ui'
	import qs from 'qs'
	export default {
		components: {
			top
		},
		data() {
			return {
				commentText: '',
				repair_id: undefined,
				access_token: ''
			}
		},
		beforeCreate() {
	        Autho(this)
	    },
		created() {
	    	this.repair_id = window.location.hash.split('/')[2]
	    	this.access_token = storageGet('access_token')
	    },
		mounted() {

		},
		methods: {
			pushComment() {
				if(!this.commentText) {
					Toast({
					  message: '请输入评论内容',
					  position: 'bottom',
					  duration: 1000
					});
		    		return
				}
				api.repairCommentText(this.access_token, qs.stringify({
					'comment': this.commentText,
					id: this.repair_id
	    		})).then(res => {   
		            Toast({
					  message: '评论成功',
					  position: 'middle',
					  iconClass: 'toast-icon icon-success',
					  duration: 1000
					})
		            var timer = setTimeout(() => {
						clearTimeout(timer)
						this.$router.go(-1)
					},800)
		        }, err => {
		
		        })
				
			}
		}
	}
</script>

<style scoped>
	.repairCommentText{
		padding: 1.3rem 0.3rem 0;
	}
	.repairCommentText textarea{
		width: 100%;
		outline: none;
		-webkit-appearance: none;
		background: #fff;
		padding: 0.2rem;
		border: 0;
		height: 2.6rem;
	}
	.join-confirm-btn{
		width: 6.9rem;
		margin: 1rem auto 0;
		height: 0.8rem;
		text-align: center;
		line-height: 0.8rem;
		color: #fff;
		font-size: 0.32rem;
		background: #39b382;
		border-radius: 0.08rem;
	}
</style>