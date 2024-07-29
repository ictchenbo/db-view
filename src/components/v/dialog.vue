<template>
	<el-dialog :title="title"  :visible.sync="show" @close="onCancel">
		<slot name="body"></slot>
		<div slot="footer" class="dialog-footer">
		    <el-button @click="onCancel">取 消</el-button>
		    <el-button type="primary" :loading="loading" @click="onOK">确 定</el-button>
	  	</div>
	</el-dialog>
</template>

<script>

export default {
	props: {
		title: {type: String, default: '弹出框'},
		visible: {type: Boolean, default: false}
	},
	data(){
		return {
			show: false,
			loading: false
		}
	},
	watch: {
		visible: function(v){
			this.show = v
			console.log('updated! '+ v)
		}
	},
	methods: {
		onOK(){
			this.loading = true;
			this.$emit('ok')
			this.loading = false;
		}, onCancel(){
			this.$emit('cancel')
		}
	}
}

</script>
