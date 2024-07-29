<template>
<div class="module">
	<h3>我的书签</h3>
    <div class="cond">
    	<el-date-picker
	      v-model="date1"
	      type="date"
	      placeholder="选择开始日期">
	    </el-date-picker>
	    ~
	    <el-date-picker
	      v-model="date2"
	      type="date"
	      placeholder="选择结束日期">
	    </el-date-picker>
    </div>

    <el-table
   	  :data="items"
      style="width: 100%">
      <el-table-column
        prop="subject"
        label="主题"
        width="180">
      </el-table-column>

      <el-table-column
        prop="cond"
        label="关键词"
        width="180">
      </el-table-column>

      <el-table-column
        prop="time"
        label="时间"
        width="180">
      </el-table-column>

      <el-table-column
        prop="comment"
        label="备注"
        width="180">
      </el-table-column>

      <el-table-column
	      fixed="right"
	      label="操作"
	      width="160">
	      <template slot-scope="scope">
	        <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
	      </template>
      </el-table-column>

    </el-table>
</div>

</template>

<script>
const TABLE = 'user_bookmark'

export default {
	data(){
		return {
			date1: '',
			date2: '',
			items: []
		}
	},
	created(){
		this.list()
	},
	watch: {
		date1(){
			this.list()
		}, date2(){
			this.list()
		}
	},
	methods: {
		list(){
			let time = {}, query = null
			if(this.date1) time["$gt"] = +this.date1;
			if(this.date2) time["$lt"] = +this.date2;
			if(Object.keys(time).length){
				query = {
					time
				}
			}
			let args = {
				query,
				sort: JSON.stringify({time: -1}), 
				limit: 20
			};
			this.ajaxGET(this.api('/users/'+TABLE), args).then(list => {
				this.items = list
			})
		},
		remove(item){
			this.$confirm('确定删除该用户吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
				this.ajaxDELETE(this.api('/users/'+TABLE+'/'+item._id)).then( () => {
					this.list()
				})
			})
		},
		go(item){

		}
	}
}

</script>
