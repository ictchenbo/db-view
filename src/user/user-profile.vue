<template>
<div class="module">
	<el-row>
		<h3>线索字段</h3>
		<el-tag v-for="f in fields" type="info" closable @close="remove(f)">
			{{f.label || f.name}}
		</el-tag>
		<el-button type="primary" icon="el-icon-plus" circle @click="onNewItem=true" title="添加字段" size="small"></el-button>
		<el-button type="primary" icon="el-icon-refresh" circle @click="reset" title="恢复默认" size="small"></el-button>

	</el-row>

	<el-row>
		<h3>高亮颜色设置</h3>
		<p>
			<div v-for="item in colors" class="color-item">
				<label>{{item.label}}</label>
				<el-color-picker v-model="item.value" @change="saveColors"></el-color-picker>
			</div>
		</p>
	</el-row>

	<el-row>
		<h3>阅读字体设置</h3>
		<p>
			<div v-for="item in fonts" class="color-item">
				<label>{{item.label}}</label>
				<el-select v-model="item.value" placeholder="请选择字体" @change="saveFonts">
				    <el-option
				      v-for="size in font_sizes"
				      :key="size"
				      :label="size"
				      :value="size">
				      <span :style="'font-size:'+size">{{ size }}</span>
				    </el-option>
				</el-select>
			</div>
		</p>
	</el-row>

	<my-dialog title="添加字段" :visible="onNewItem" @ok="add" @cancel="onNewItem=false">
    	<div slot="body">
    	  <el-form>
    	  	<el-form-item label="字段名称" label-width="120px">
		      <el-input v-model="input"></el-input>
		    </el-form-item>
		  </el-form>
		</div>
	</my-dialog>
</div>

</template>

<script>

import MyDialog from '@/components/v/dialog'

import user from './user'
import threadDAO from '@/thread/thread'

const TYPE_COLORS = 'hi_colors'
const DEF_COLORS = [
	{name: 'hi.search', value: '#ff0000', label: '检索关键词'},
	{name: 'hi.entity', value: '#ffff00', label: '知识实体'},
	{name: 'hi.dict', value: '#00ffff', label: '标注词典'}
]

const TYPE_FONTS  = 'read_fonts'
const DEF_FONTS = [
	{name: 'font.email', value: '14px', label: '邮件正文'},
	{name: 'font.thread', value: '14px', label: '线索正文'}
]

export default {
	components: { MyDialog },
	data(){
		return {
			fields: [],
			onNewItem: false,
			input: '',
			colors: [],
			font_sizes: ['12px', '14px', '16px', '18px', '20px'],
			fonts: []
		}
	},
	created(){
		threadDAO.loadUserFS( fs => {
			this.fields = fs.slice(0)
		})

		user.getProfile(TYPE_COLORS).then( list => {
			if(list && list.length>0){
				this.colors = JSON.parse(list[0])
			} else {
				this.colors = DEF_COLORS
			}
		})

		user.getProfile(TYPE_FONTS).then( list => {
			if(list && list.length>0){
				this.fonts = JSON.parse(list[0])
			} else {
				this.fonts = DEF_FONTS
			}
		})
	},
	methods: {
		add(){
			if(!this.input) {
				this.$message.error("输入为空");
				return;
			}
			let name = this.input
			let index = this.fields.find((f) => name==f.name || name==f.label)
			if(index !=undefined){
				this.$message.error("已有同名字段");
				return
			}
			this.fields.push({name: name})
			this.saveThreadFields()
			this.input = ''
			this.onNewItem = false
		},
		remove(tag){
			this.fields.splice(this.fields.indexOf(tag), 1);
			this.saveThreadFields()
		},
		reset(){
			this.fields = threadDAO.loadDefault().slice(0)
			this.saveThreadFields()
		},
		saveThreadFields(){
			threadDAO.saveUserFS(this.fields, () => {
				this.$message.success('设置完成')
			})
		},
		saveColors(){
			let v = JSON.stringify(this.colors)
			user.saveProfile(TYPE_COLORS, v).then( () => {
				this.$message.success('设置完成')
			})
		},
		saveFonts(){
			let v = JSON.stringify(this.fonts)
			user.saveProfile(TYPE_FONTS, v).then( () => {
				this.$message.success('设置完成')
			})
		}
	}
}

</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .color-item{
  	float: left;
  	width: 80px;
  }
</style>
