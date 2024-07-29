<template>
<div class="module">
	<h3>组列表</h3>
	<el-button type="primary" style="float: right;" @click="onNewItem=true">添加组</el-button>

	<el-input v-model="q" style="width: 200px;" @change="list" placeholder="输入组名"></el-input>

   	<el-table
   	  :data="items"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="组名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userNames"
        label="包含用户">
        <template>

        </template>
      </el-table-column>
      <el-table-column
        prop="thread"
        label="线索权限">
      </el-table-column>
      <el-table-column
        label="邮件权限">
        <template slot-scope="scope">
        	<el-button @click="edit(scope.row)" icon="el-icon-edit" size="small" circle title="设置"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        label="备注">
      </el-table-column>
      <el-table-column
	      fixed="right"
	      label="操作"
	      width="160">
	      <template slot-scope="scope">
	      	<el-button @click="update(scope.row)" icon="el-icon-edit" size="small" circle title="修改"></el-button>
	        <el-button @click="remove(scope.row)" type="danger" icon="el-icon-delete" size="small" circle title="删除"></el-button>
	      </template>
      </el-table-column>

   	</el-table>

    <div class="pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        small
        :current-page="currentPage"
        :page-sizes="[2,3, 10, 30, 50,100,500]"
        :page-size="pageSize"
        :pager-count="5"
        layout="prev,pager, next, total, sizes"
        :total="pager.total || 0">
      </el-pagination>
    </div>

    <my-dialog title="添加用户组" :visible="onNewItem"  @ok="add" @cancel="onNewItem=false">
    	<div slot="body">
    	  <el-form :model="form">
		    <el-form-item label="组名" label-width="120px">
		      <el-input v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="线索权限" label-width="120px">
		    	<el-checkbox v-for="perm in perms" v-model="form.thread1[perm.name]">{{perm.label}}</el-checkbox>
		    </el-form-item>

		    <el-form-item label="邮件权限" label-width="120px">
		      <el-input type="textarea" v-model="form.email1" rows="5"></el-input>
		    </el-form-item>

		    <!--<el-form-item label="组成员" label-width="120px">
		      <el-input v-model="form.member" auto-complete="off"></el-input>
		    </el-form-item>-->

		    <el-form-item label="备注" label-width="120px">
		      <el-input type="textarea" v-model="form.comment"></el-input>
		    </el-form-item>
		  </el-form>
    	</div>
    </my-dialog>
    <my-dialog title="修改邮件权限" :visible="editNewItem"  @ok="updateOk" @cancel="editNewItem=false">
      <div slot="body">
        <el-form :model="form">
          <el-form-item label="邮件权限" label-width="120px">
            <el-input type="textarea" v-model="form.email1" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
</div>

</template>
<script>

import MyDialog from '@/components/v/dialog'

const THREAD_PERMS = [
	{name: 'view', label: '查看'},
	{name: 'edit', label: '编辑'},
	{name: 'delete', label: '删除'},
	{name: 'export', label: '导出'},
	{name: 'stat', label: '统计'}
]

let permMap = {}

THREAD_PERMS.forEach(function(p){
	permMap[p.name] = p.label
})

function formatUser(user){
	//user.id = user.id || user._id;
	//useridmap[user.username] = user;
	if(! (user in users)){
		return null;
	}
	return users[user].username;
}

function mapPerm(arr){
	return (arr || []).map(function(v){
		return permMap[v]
	})
}

function UserGroup(body, context, data){
	var listtable  = body.find('table.favlist');
	var userformhtml = body.find('.dialogs > .addgroup').html();

	function addUser(input, user){
		var v = $.trim(input.val());
		if(v!='') v = v.substring(0, v.lastIndexOf(';')+1);
		input.val(v+user.username+';');
	}

	function queryUser(q, callback){
		var list = [];
		for(var id in users){
		 var user = users[id];
		 if(user.username.indexOf(q)>=0 || user.name.indexOf(q)>=0) list.push(user);
		}
		callback(list);
	}

	function setupUserSearch(input, hlist){
		input.keyup(function(){
			var _this = $(this);
			var v = $.trim(_this.val());
			v = v.substring(v.lastIndexOf(';')+1);
			if(v=='') {
				return;
			}
			queryUser(v, function(list){
				hlist.empty();
				list.forEach(function(item){
					var div = $('<div class="item"></div>').appendTo(hlist);
					div.text(item.name+'('+item.username+')');
					div.click(function(){
						hlist.hide();
						addUser(input, item);
					})
				});
				hlist.show();
				if(hlist.find('.item').length==0){
					//flashMsg('没有结果');
				}
			});
		});
	}
}

export default {
	components: { MyDialog },
	data(){
		return {
			q: '',
			items: [],
			pager: {},
			currentPage: 1,
			pageSize: 10,

			onNewItem: false,
			editNewItem: false,
			form: {
				thread1: {}
			},
			userList: [],
			userMap: {},
			perms: THREAD_PERMS
		}
	},
	created(){
		this.listUsers()
	},
	methods: {
		handleSizeChange(){

		},
		handleCurrentChange(){

		},

		listUsers(){
			this.ajaxGET(this.api('/common/user')).then( list => {
				this.userList = list
				let map = {}
				list.forEach(function(user){
					map[user.id] = user
				})
				this.userMap = map;
				this.list()
			})
		},

		add(){
		  // debugger
			let fd = this.form
			if(!fd.name || fd.name=='') {
				this.$message('输入不完整');
				return;
			}
			var group = {
				name: fd.name,
				perms: {},
				users:[],
				comment: fd.comment
			};
			if(fd._id) group._id = fd._id
			//if(fd.member) fd.member.split(';').forEach(function(name){
			//	if(name=='') return;
			//	var username = name;
				//var username = $.trim(name.substring(name.indexOf('<')+1, name.lastIndexOf('>')));
				//if(useridmap[username]) group.users.push(useridmap[username]);
			//});
			let thread1 = fd.thread1 || {}
			let perms = []
			for(let k in thread1){
				if(thread1[k]) perms.push(k)
			}
			group.perms.thread1 = perms

			if(fd.email1){
				group.perms.email1 = fd.email1.split(/[,;\r\n]+/g)
			}

			this.ajaxPUT(this.api('/users/user_group'), {row: JSON.stringify(group)}).then( id => {
				fd._id = id
				this.onNewItem = false
				this.list()
			})
		},
    updateOk(){
      // debugger
      let fd = this.form
      if(!fd.name || fd.name=='') {
        this.$message('输入不完整');
        return;
      }
      var group = {
        name: fd.name,
        perms: {},
        users:[],
        comment: fd.comment
      };
      if(fd._id) group._id = fd._id
      //if(fd.member) fd.member.split(';').forEach(function(name){
      //	if(name=='') return;
      //	var username = name;
      //var username = $.trim(name.substring(name.indexOf('<')+1, name.lastIndexOf('>')));
      //if(useridmap[username]) group.users.push(useridmap[username]);
      //});
      let thread1 = fd.thread1 || {}
      let perms = []
      for(let k in thread1){
        if(thread1[k]) perms.push(k)
      }
      group.perms.thread1 = perms

      if(fd.email1){
        group.perms.email1 = fd.email1.split(/[,;\r\n]+/g)
      }

      this.ajaxPUT(this.api('/users/user_gr oup'), {row: JSON.stringify(group)}).then( id => {
        fd._id = id
        this.editNewItem = false
        this.list()
      })
    },
		edit(item){
			this.form = item;
			this.editNewItem = true
		},
    update(item){
      this.form = item;
      this.onNewItem = true
    },
		list(){
			this.ajaxGET(this.api('/users/user_group')).then( (data, p) => {
				let userMap = this.userMap
				data.forEach(function(group){
					let perms = group.perms || {}
					group.thread = mapPerm(perms.thread1)
					group.email =  perms.email1  || []
					let thread1 = {};
					(perms.thread1||[]).forEach(function(p){
						thread1[p] = true;
					});
					group.thread1 = thread1
					group.email1 = group.email.join(';')
					let users = []

					group.users.forEach(function(uid){
						if(userMap[uid]){
							users.push(userMap[uid].name)
						}
					})
					group.userNames = users;
				})
				this.items = data
				this.pager.total = data.length
			})
		},
		remove(item){
			let url = this.api('/users/user_group/'+item._id)
			this.$confirm('确定删除该用户组吗？', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          this.ajaxDELETE(url).then( r => {
	          	//if(r.status==0){
	          	  this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
	          	  this.list()
	          	//}
	          })
	        }).catch(() => {})
		},
	}
}

</script>

<style scoped>
	div.new-excel-dialog{
		height:500px;
		overflow-y:auto;
	}
	.preview .table td.edit input.full{
		max-width: initial;
		width: 100%;
	}

</style>
