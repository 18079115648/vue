<template>
	<section class="fullDiv">
		<top title="活动详细介绍"></top>
		<section class="activity-site-content content-html" v-html="activity_site">
			
		</section>
	</section>
</template>

<script>
	import axios from 'axios'
	import top from '../parts/header'
	import api from '@/fetch/api'
	export default {
		components: {
			top
		},
		data() {
			return {
				activity_site:undefined
			}
		},
		created() {
			this.activity_id = window.location.hash.split('/')[2]
			api.activityIntro({
	        	params:{
				    id: this.activity_id
				}
		    }).then((res) => {
	           this.activity_site = res.data.result
	        }).catch((err) => {
	            console.log(err)
	        })
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style scoped>
	.activity-site-content{
		padding: 0.3rem;
		padding-top: 1.2rem;
	}
</style>