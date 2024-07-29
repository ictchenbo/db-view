<template>
<div class="module">
	<h3>我的消息</h3>

    <div class="cond">
    	<el-date-picker
	      v-model="date1"
	      type="date"
	      placeholder="选择开始日期" value-format="timestamp">
	    </el-date-picker>
	    ~
	    <el-date-picker
	      v-model="date2"
	      type="date"
	      placeholder="选择结束日期" value-format="timestamp">
	    </el-date-picker>

	    <el-checkbox v-model="unread">只看未读</el-checkbox>

	    <el-checkbox v-model="send">查看我发送的消息</el-checkbox>
    </div>

   	<el-table
   	  :data="items"
      style="width: 100%" @row-click="markRead">

	 <el-table-column
        prop="addressor"
        label="发送人"
        width="100">
      </el-table-column>

      <el-table-column
        prop="addressee"
        label="接收人"
        width="100">
      </el-table-column>

      <el-table-column
        label="消息">
        <template slot-scope="scope">
        	<div :class="scope.row.read?'':'unread'">{{scope.row.content}}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="时间"
        width="160"
        >
        <template slot-scope="scope">{{$formatDate('yyyy-MM-dd hh:mm', scope.row.time)}}</template>
      </el-table-column>

      <el-table-column
	      fixed="right"
	      label="操作"
	      width="120">
	      <template slot-scope="scope">
	      	<el-button v-if="!scope.row._self" @click="reply(scope.row)" icon="el-icon-edit" size="small" circle title="回复"></el-button>
	        <el-button @click="remove(scope.row)" type="danger" icon="el-icon-delete" size="small" circle title="删除"></el-button>
	      </template>
      </el-table-column>

    </el-table>

    <el-button type="primary" icon="el-icon-message"  @click="showNewForm">发送消息</el-button>

    <my-dialog title="发消息" :visible="onNewItem" @ok="sendMessage" @cancel="form={};onNewItem=false">
    	<div slot="body">
		  <el-form :model="form">
		  	<el-form-item label="收件人" label-width="120px">
		      <el-select v-model="form.addressee" placeholder="请选择收件人">
			    <el-option
			      v-for="item in userList"
			      :key="item.id"
			      :label="item.name"
			      :value="item.username">
			    </el-option>
			   </el-select>
		    </el-form-item>

		    <el-form-item label="内容" label-width="120px">
		      <el-input type="textarea" v-model="form.content" rows="5"></el-input>
		    </el-form-item>
		  </el-form>
		</div>
	</my-dialog>

	<my-dialog title="回复消息" :visible="onReply" @ok="sendReply" @cancel="onReply=false">
    	<div slot="body">
    	  <el-form :model="form">
    	  	<el-form-item label="收件人" label-width="120px" >
    	  	  <el-input v-model="form.addressee" disabled></el-input>
		    </el-form-item>
		    <el-form-item label="内容" label-width="120px">
		      <el-input type="textarea" v-model="form.content" rows="5" autofocus></el-input>
		    </el-form-item>

    	  </el-form>
    	</div>
    </my-dialog>

	<my-dialog title="消息详情" :visible="vis1" @cancel="vis1=false">
    	<div slot="body">
    		<div>
	            <span style="margin:10px">收件人</span>
	            <span  style="margin:10px">{{detail.addressee}}</span>
	        </div>
	        <div>
	            <span style="margin:10px">发件人</span>
	            <span  style="margin:10px">{{detail.addressor}}</span>
	        </div>
	        <div>
	            <span style="margin:10px">时间</span>
	            <span style="margin:10px">{{detail.time}}</span>
	        </div>
	        <div >
	            <span style="margin:10px">内容</span>
	            <div style="margin:10px">{{detail.content}}</div>
	        </div>
    	</div>
    </my-dialog>

</div>

</template>

<script>

import MyDialog from '@/components/v/dialog'
import userDao from './user'
import constant from '@/constant'

const TABLE = 'user_message'

export default {
	components: { MyDialog },
	data(){
		return {
			send: false,
			unread: true,
			onNewItem: false,
			form: {},
			onReply: false,
			vis1: false,
			detail: {},
			items: [],
			userList: [],
			date1: '',
			date2: ''
		}
	},
	watch: {
		date1(){
			this.list()
		},
		date2(){
			this.list()
		},
		unread(){
			this.list()
		},
		send(){
			this.list()
		}
	},
	created(){
		let userID = constant.user.id
		userDao.list( list => {
			this.userList = list.filter(u => u.id!=userID)
		})

		this.list()
	},
	methods: {
		list(){
		  // debugger
			let query = {};
			let time = {}

			console.log(this.date1)
			console.log(this.date2)
      if(this.date1) time["$gt"] = +this.date1;
			if(this.date2) time["$lt"] = +this.date2+1000*60*60*24;
			if(Object.keys(time).length){
				query.time = time;
			}
			if(this.send){
				query.addressor = constant.user.username;
			}else{
				query.addressee = constant.user.username;
			}
			if(this.unread){
				query.read = false;
			}
			let args = {
				query: JSON.stringify(query),
				sort: JSON.stringify({time: -1}),
				limit: 20
			};

			this.ajaxGET(this.api('/users/'+TABLE), args).then(list => {
				list.forEach(item => {
					item._self = item.addressor == constant.user.username;
				})
				this.items = list
			})
		},
		reply(msg){
			this.onReply = true;
			this.form.addressee = msg.addressor;
			this.form.content = "回复["+msg.addressor+"]: ";
		},
		sendReply(){
			this.sendMessage();
		},
		view(msg){
			this.vis1 = true
		},
		markRead(msg){
			//只能将接收到消息标记为已读
			if(msg.addressor==constant.user.username){
				return;
			}
			let query = JSON.stringify({'_id':msg._id})
			let set = JSON.stringify({'read':true})
			this.ajaxPOST(this.api('/users/'+TABLE+'/_update'), {
				query, set
			}).then( () => {
				msg.read = true;
			})
		},
		remove(msg){
			this.$confirm('确定删除该消息吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
				this.ajaxDELETE(this.api('/users/'+TABLE+'/'+msg._id)).then( () => {
					this.list()
				})
			})
		},
		showNewForm(){
			this.form = {}
			this.onNewItem = true
		},
		sendMessage(){
			let form = this.form
			form.read = false
			form.time = +new Date();
			form.addressor = constant.user.username;
			form.addressorName = constant.user.name;
			this.ajaxPUT(this.api('/users/'+TABLE), {row: JSON.stringify(form)}).then( () => {
				this.$message.success('消息已发送');
				this.onNewItem = false
				this.onReply = false
			}).catch(() =>{
				this.$message.error('消息发送失败，请稍后再试');
			})
		}
	}
}

</script>
<style scoped>
	.unread{
		font-weight: bold;
	}
</style>
