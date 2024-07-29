<template>
	<div class="module">
		<h3>通用数据库查询</h3>
		<el-form>
			<el-form-item label="连接池" label-width="120px">
				<el-radio-group v-model="dbpool">
			      <el-radio-button v-for="pool in dbpools" :label="pool"></el-radio-button>
			    </el-radio-group>
            </el-form-item>
            <el-form-item label="选项" label-width="120px">
				<el-checkbox v-model="showSysDBs">不显示系统数据库</el-checkbox>
            </el-form-item>
            <el-form-item label="数据库" label-width="120px">
				<el-select filterable v-model="db" placeholder="选择数据库">
				    <el-option
				      v-for="db in dbs"
				      :key="db"
				      :label="db"
				      :value="db">
				    </el-option>
			   </el-select>
            </el-form-item>
            <el-form-item label="表" label-width="120px">
            	<el-select filterable v-model="table" placeholder="选择表">
				    <el-option
				      v-for="table in tables"
				      :key="table"
				      :label="table"
				      :value="table">
				    </el-option>
			   </el-select>
            </el-form-item>

            <p>
            	<el-button @click="descTable">表结构</el-button>
	            <el-button @click="showTable">建表语句</el-button>
	            <el-button @click="countTable">表统计</el-button>
	            <el-button @click="selectTable">表数据浏览</el-button>
            </p>

            <el-form-item label="查询语句" label-width="120px">
            	<el-input v-model="sql" placeholder="请输入SQL查询"></el-input>
            </el-form-item>
            
            <el-button type="primary" @click="sqlQuery">查询</el-button>
            
            <el-button type="warning" @click="exeQuery">执行</el-button>
		</el-form>

		<h4>查询结果</h4>
		<table class="el-table">
			<thead>
				<tr>
					<th v-for="col in header">{{col.name}}</th>
				</tr>
			</thead>
			<tr v-for="row in rows">
				<td v-for="(v,i) in row.values" v-html="formatV(v, i)"></td>
			</tr>
		</table>
		<span>查询花费时间：{{took}}ms, 受影响行数：{{affected}}</span>


		<h4>数据统计</h4>
		<el-form>
			<el-form-item label="统计列" label-width="120px">
            	<el-select v-model="statField" placeholder="选择列">
				    <el-option
				      v-for="field in fields"
				      :key="field"
				      :label="field"
				      :value="field">
				    </el-option>
			   </el-select>
            </el-form-item>
            <el-button type="primary" @click="statQuery">统计</el-button>
		</el-form>

		<div v-show="showChart">
			<e-chart theme="shine" ref="chart1" :options="ec_options" :auto-resize="true"></e-chart>
		</div>
	</div>
</template>

<script>
require('echarts/theme/shine');

const sysdbs = {
	mysql: 1,
	information_schema: 1,
	performance_schema: 1,
	sys:1
}

export default {
	data(){
		return {
			dbpools: ['mysql-115', 'gbase8a', 'mysql-local'],
			dbpool: '',
			showSysDBs: true, //不显示系统数据库
			dbs: [],
			db: '',
			tables: [],
			table: '',
			fields: [],
			statField: '',
			sql: '',
			header: [],
			rows: [],
			took: '',
			affected: 0,
			showChart: true,
			ec_options: {}
		}
	},
	watch:{
		dbpool: function(v){
			if(!v) {
				this.dbs = []
				this.db = ''
				return;
			}
			this.db = '';
			this.showDatabases(v)
		},
		db: function(v){
			if(!v) {
				this.tables = []
				this.table = ''
				return;
			}
			this.showTables(this.dbpool, this.db)
		},
		showSysDBs(v){
			if(this.dbpool){
				this.showDatabases(this.dbpool)
			}
		},
		table(v){
			if(this.dbpool && this.db && this.table){
				this.listFields()
			}
		}
	},
	created(){
		// this.countBasic()
		// this.countData()
		this.ajaxGET(this.api('/db')).then( list => {
			this.dbpools = list
		})
	},
	methods: {
		clear(){
			this.header = []
			this.rows = []
			this.took = ''
			this.affected = 0
		},

		query(pool, sql){
			this.clear()
			const url = this.api('/db/'+pool+'/_query')
			return this.ajaxGET(url, {sql}).catch(e => {
				this.$message.error("发生错误："+e)
			})
		},

		showDatabases(pool){
			this.query(pool, 'show databases').then( ret => {
				let rows = (ret.result || {}).rows || []
				let dbs = rows.map(row => row.values[0])
				if(this.showSysDBs){
					this.dbs = dbs.filter( db => !(db in sysdbs))
				} else{
					this.dbs = dbs
				}
				if(this.dbs.length){
					this.db = this.dbs[0];
				}
			})
		},

		showTables(pool, db){
			this.query(pool, 'show tables in '+db).then( ret => {
				let rows = (ret.result || {}).rows || []
				this.tables = rows.map(row => row.values[0])
				if(this.tables.length){
					this.table = this.tables[0];
				}
			})
		},
		countTable(){
			if(!this.table) return;
			this.sql = "select count(*) from `"+this.db+'`.`'+this.table+'`';
			this.sqlQuery();
		},

		showTable(){
			if(!this.table) return;
			this.sql = 'show create table `'+this.db+'`.`'+this.table+'`';
			this.sqlQuery();
		},

		descTable(){
			if(!this.table) return;
			this.sql = 'describe `'+ this.db+'`.`'+this.table+'`'
			this.sqlQuery();
		},
		selectTable(){
			if(!this.table) return;
			this.sql = 'select * from `'+this.db+'`.`'+this.table+'`' + ' limit 0,10'
			this.sqlQuery();
		},

		sqlQuery(){
			this.query(this.dbpool, this.sql).then( ret => {
				this.show(ret)
			})
		},
		exeQuery(){
			this.clear()
			if(!this.dbpool){
				this.$message({
					type:'warn',
					message: '请选择连接池'
				})
				return;
			}
			const url = this.api('/db/'+this.dbpool+'/_execute')
			return this.ajaxPOST(url, {sql: this.sql}).catch(e => {
				this.$message.error("发生错误："+e)
			}).then( ret => {
				this.affected = ret.affected
				this.$message({
					type: 'success',
					message: '执行成功'
				})
			})
		},

		listFields(){
			let sql = 'describe `'+ this.db+'`.`'+this.table+'`'
			this.query(this.dbpool, sql).then( ret => {
				let ds = ret.result || {}
				let rows = ds.rows || []
				this.fields = rows.map(row => row.values[0])
			})
		},
		statQuery(){
			if(!this.statField) return;
			let sql = 'select '+ this.statField+',count(*) from `'+ this.db+'`.`'+this.table
			       +'` group by '+ this.statField

			this.query(this.dbpool, sql).then( ret => {
				let ds = ret.result || {}
				let rows = ds.rows || []
				let s_data = rows.map(row => {
					return {
						name:  row.values[0], 
						value: row.values[1]
					}
				})

				this.ec_options = {
					title: {
				        text: this.statField+'分布',
				        left: 'center',
				        top: 20
				    },
					tooltip: {
				        trigger: 'item',
				        formatter: "{b}: {c} ({d}%)"
				    },
					series: [{
						name: this.statField,
						type: 'pie',
						data: s_data
					}]
				}
			})
		},

		show(ret){
			this.took = ret.took || '-'
			let ds = ret.result || {}
			this.header = ds.header || []
			this.rows   = ds.rows    || []
		},

		formatV(v, i){
			if(v==null){
				return 'NULL'
			}
			//let col = this.header[i]

			if(typeof v === "string"){
				return v.replace(/\n/g, '<br/>')
			}

			return v
		}
	}
}

</script>
