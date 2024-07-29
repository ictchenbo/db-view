<template>
	<div class="db-table">
		<h4 class="title">{{title}}</h4>
		<table class="el-table">
			<thead>
				<tr>
					<th v-for="col in header">{{col.name}}</th>
				</tr>
			</thead>
			<tr v-for="row in rows">
				<td v-for="(v,i) in row.values">{{formatV(v, i)}}</td>
			</tr>
		</table>
	</div>
</template>

<script>

export default {
	props: {
		title: {type: String, default: ''},
		ds: {type: Object, default: {}},
	},
	data(){
		return {
			header: [],
			rows: []
		}
	},
	created(){
		this.header = ds.header || []
		this.rows   = ds.row || []
	},
	methods:{
		formatV(v, i){
			if(v==null){
				return 'NULL'
			}
			let col = this.header[i]

			return v
		}
	}
}

</script>
