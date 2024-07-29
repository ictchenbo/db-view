<template>
	<div class="module">
		<h3>GBase 8a同步</h3>
		<hr/>
		<h4>基本信息</h4>
		<el-form>
			<el-form-item label="连接池" label-width="120px">
				<el-select v-model="pool" placeholder="选择连接池">
				    <el-option
				      v-for="pool in pools"
				      :key="pool"
				      :label="pool"
				      :value="pool">
				    </el-option>
			   </el-select>
            </el-form-item>
            <el-form-item label="状态表" label-width="120px">
				<el-input value="information_schema.kafka_consumer_status" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费者列表" label-width="120px">
				<el-input value="gclusterdb.kafka_consumers" disabled></el-input>
            </el-form-item>
            <el-form-item label="消费者偏移表" label-width="120px">
				<el-input value="gclusterdb.kafka_consumer_offset_{topic}" disabled></el-input>
            </el-form-item>
        </el-form>

        <h4>消费者状态</h4>
		<table class="el-table">
			<thead>
				<tr>
					<th v-for="col in list_header">{{col.name}}</th>
				</tr>
			</thead>
			<tr v-for="row in list_rows">
				<td v-for="(v,i) in row.values">{{formatV(v, i)}}</td>
			</tr>
		</table>

        <h4>消费者列表</h4>
        <table class="el-table">
        	<thead>
        	 	<tr>
        	 		<th>Name</th>
        	 		<th>Topic</th>
        	 		<th>Brokers</th>
        	 		<th>偏移量</th>
        	 		<th>状态</th>
        	 	</tr>
        	</thead>
        	<tbody>
        		<tr v-for="consumer in consumers" @click="showOffset(consumer)">
        			<td>{{consumer.name}}</td>
        			<td>{{consumer.topic}}</td>
        			<td>{{consumer.brokers}}</td>
        			<td>{{consumer.max_offset}}</td>
        			<td>
        				<el-button size="small" @click="startStop(consumer)">
        				{{consumer.buttonText}}</el-button>
        			</td>

        		</tr>
        	</tbody>
        </table>


		<el-form>
            <!-- <el-button type="primary" @click="sqlQuery">执行</el-button> -->
		</el-form>

		<span>查询花费时间：{{took}}ms</span>
	</div>
</template>

<script>

import DbTable from '@/components/v/db-table'

const START = '启动'
const STOP  = '停止'

export default {
	components: {
		DbTable
	},
	data(){
		return {
			pools: ['gbase8a'],
			pool: 'gbase8a',
			consumers: [],
			consumer_status: {},
			took: '-',
			list_header: [], 
			list_rows: []
		}
	},
	watch:{
		dbpool: function(v){
			if(!v) {
				
				return;
			}
		}
	},
	created(){
		this.getConsumerStatus()
		this.getConsumers();
	},
	methods: {
		query(pool, sql, callback){
			const url = this.api('/db/'+pool+'/_query')
			return this.ajaxGET(url, {sql}).then(callback).catch(e => {
				this.$message.error("发生错误："+e)
			})
		},
		execute(pool, sql ,callback){
			const url = this.api('/db/'+pool+'/_execute')
			return this.ajaxGET(url, {sql}).then(callback).catch(e => {
				this.$message.error("发生错误："+e)
			})
		},
		getConsumerStatus(){
			let sql = 'select * from information_schema.kafka_consumer_status'
			this.query(this.pool, sql, ret => {
				let status = ret.result || {}
				this.list_header = status.header;
				this.list_rows   = status.rows;
			})
		},
		getConsumers(){
			let sql = 'select * from gclusterdb.kafka_consumers'
			this.query(this.pool, sql, ret => {
				let ds = ret.result || {}
				this.consumers = (ds.rows || []).map(row => {
					let arr = row.values || []
					return {
						name: arr[0],
						topic: arr[4],
						brokers: arr[5],
						status: arr[9],
						buttonText: arr[9]=='STOP'?START:STOP
					}
				})
			})
		},
		showOffset(consumer){
			let sql = 'select * from gclusterdb.kafka_consumer_offset_'+consumer.name;
			this.query(this.pool, sql, ret => {
				alert(ret.values)
			})
		},
		startStop(consumer){
			let sql = (consumer.status=='STOP'?'start':'stop')+
				' start kafka consumer '+ consumer.name
			this.execute(this.pool, this.sql, ret =>{
				consumer.status = (consumer.status=='STOP'?'START':'STOP')
				consumer.statusText = (consumer.status=='STOP'?START:STOP)
			})
		},

		formatV(v, i){
			if(v==null){
				return 'NULL'
			}
			//let col = this.list_header[i]
			return v
		}
	}
}

</script>
