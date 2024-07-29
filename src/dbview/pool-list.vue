<template>
 <div class="module">
 	<h3>数据连接管理</h3>
 	<el-button type="primary" size="small">添加</el-button>
 	<el-table
 	 	:data="list"
    	stripe
    	style="width: 100%">
    <el-table-column
      prop="name"
      label="连接名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="dbtype"
      label="数据库类型"
      width="180">
    </el-table-column>
    <el-table-column
      prop="jdbcUrl"
      label="地址">
    </el-table-column>
  </el-table>
 </div>
</template>

<script>

export default {
	data(){
		return {
			list: [
				{name: 'gbase8a', dbtype: 'gbase8a', jdbcUrl: ''},
				{name: 'mysql-53', dbtype: 'mysql',  jdbcUrl: ''},
			]
		}
	},
	created(){

	},
	methods: {
		
	}
}

</script>
