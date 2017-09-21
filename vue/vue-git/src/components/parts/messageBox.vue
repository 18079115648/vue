<template>
    
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
	props: {
        show: {
            type: Boolean
        }
    },
    created() {
    	MessageBox.confirm('确定清空搜索记录?').then(action => {
			    
		},err =>{
			
		});
    },
    methods: {
    	cancel() {
    		this.$emit('shareCancel')
    	}
    }
   
}
</script>

<style scoped>
.share-tip{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0,0,0,0.4);
	padding: 0 15px;
	z-index: 20;
}
.share-tip img{
	display: block;
	width: 100%;
}

</style>