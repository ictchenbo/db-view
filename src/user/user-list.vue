<template>
<div class="module">
	<h3>用户列表</h3>
	<el-button type="primary" style="float: right" @click="form={};onNewItem=true">添加用户</el-button>

    <el-input placeholder="输入用户名" style="width: 200px;" v-model="q" @change="list"></el-input>

   	<el-table
   	  :data="items"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="显示名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户组">
        <template slot-scope="scope" v-if="scope.row.role!='admin'">
        	<el-tag v-for="group in scope.row.groups">
    			{{group.name}}
    		</el-tag>
        	<el-button @click="setUserGroup(scope.row)" icon="el-icon-edit" size="small" circle title="设置"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="邮件权限">
    	<template slot-scope="scope" v-if="scope.row.role!='admin'">
    		{{scope.row.buz}}
    		<el-button @click="setUserPermit(scope.row)" icon="el-icon-edit" size="small" circle title="设置"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
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
	      	<el-button @click="edit(scope.row)" icon="el-icon-edit" size="small" circle title="修改用户信息"></el-button>
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

    <my-dialog title="添加用户" :visible="onNewItem" @ok="add('form')" @cancel="onNewItem=false">
    	<div slot="body">
    	  <el-form :model="form" status-icon :rules="rules" ref="form">
    	  	<el-form-item label="用户名" label-width="120px" class="required" prop="username">
		      <el-input v-model="form.username" auto-complete="off" autofocus></el-input>
		    </el-form-item>

		    <el-form-item label="用户昵称" label-width="120px">
		      <el-input v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="密码" label-width="120px" class="required" prop="pwd">
		      <el-input v-model="form.pwd" type="password" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="确认密码" label-width="120px" class="required" prop="pwd1">
		      <el-input v-model="form.pwd1" type="password" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="邮箱" label-width="120px">
		      <el-input v-model="form.email" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="备注" label-width="120px">
		      <el-input v-model="form.comment" auto-complete="off"></el-input>
		    </el-form-item>

    	  </el-form>
    	</div>
    </my-dialog>

    <my-dialog title="修改用户信息" :visible="onEditItem" @ok="update" @cancel="onEditItem=false">
    	<div slot="body">
    	  <el-form :model="form">
    	  	<el-form-item label="用户名" label-width="120px">
		      <el-input v-model="form.username" auto-complete="off" autofocus disabled></el-input>
		    </el-form-item>

		    <el-form-item label="用户昵称" label-width="120px">
		      <el-input v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="重设密码" label-width="120px">
		      <el-input v-model="form.pwd" type="password" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="确认密码" label-width="120px">
		      <el-input v-model="form.pwd1" type="password" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="邮箱" label-width="120px">
		      <el-input v-model="form.email" auto-complete="off"></el-input>
		    </el-form-item>

		    <el-form-item label="备注" label-width="120px">
		      <el-input v-model="form.comment" auto-complete="off"></el-input>
		    </el-form-item>

    	  </el-form>
    	</div>
    </my-dialog>

    <my-dialog title="设置用户所属组" :visible="onSetGroup" @ok="saveUserGroup" @cancel="onSetGroup=false">
    	<div slot="body">
    		<el-form :model="groupForm">
    		<el-checkbox v-for="group in myGroups" v-model="groupForm[group.name]">{{group.name}}</el-checkbox>
    		</el-form>
    	</div>
    </my-dialog>

    <my-dialog title="设置用户权限" :visible="onSetPermit" @ok="saveUserPermit" @cancel="onSetPermit=false">
    	<div slot="body">
    	  <el-form :model="perm">
    	  	<el-form-item label="业务方向" label-width="120px">
		      <el-input v-model="perm.buz" auto-complete="off" placeholder="输入方向，多个方向之间用半角分号分隔" ></el-input>
		    </el-form-item>

		    <el-form-item label="邮件权限" label-width="120px">
		      <el-input type="textarea" v-model="perm.emails" auto-complete="off" placeholder="输入邮箱，多个邮箱之间请换行或用半角分号分隔"></el-input>
		    </el-form-item>
    	  </el-form>
    	</div>
    </my-dialog>

</div>

</template>

<script>
import MyDialog from '@/components/v/dialog'


const TABLE_PERMIT = "user_permits"
const TABLE_GROUP  = "user_group"

let userList = []
export default {
	components: { MyDialog },
	data(){
	  let validatePass = (rule,value,callback) =>{
	    if(value.length<4){
	      callback(new Error('长度最小为4个字符'))
      }else if(userList.indexOf(value)>-1){
	      callback(new Error('用户名已存在，请重新输入用户名'))
      }else {
	      callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
		return {
			q: '',
			pager: {},
			currentPage: 1,
			pageSize: 10,
			items: [],
			onNewItem: false,
			form: {},
			onEditItem: false,
			curItem: null,
			myGroups: [],
			onSetGroup: false,
			allGroups: {},
			groupForm: {},
			permits: {},
			onSetPermit: false,
			perm: {},
      rules: {
			  username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {trigger:'blur',validator:validatePass}
        ],
        pwd:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,message:'长度最小为6个字符',trigger:'blur'}
        ],
        pwd1:[
          {required:true,message:'请再次输入密码',trigger:'blur'},
          {trigger:'blur',validator: validatePass2}
        ]
      }
		}
	},
	created(){
		this.listPermits()
	},
	methods: {
		handleSizeChange(){

		},
		handleCurrentChange(n){
			this.currentPage = n
		},

		listPermits(){
			this.ajaxGET(this.api('/users/'+TABLE_PERMIT), {limit: 0})
			.then( data => {
				let permits = {}
				data.forEach(function(item){
					permits[item._id] = item
				})
				this.permits = permits
				this.listGroups()
			})
		},

		listGroups(){
			this.ajaxGET(this.api('/users/user_group'), {limit: 0})
			.then( data => {
				let allGroups = {}, userGroups = {}

				data.forEach(function(group){
					allGroups[group.name] = group
					group.users.forEach(function(uid){
						let g = userGroups[uid] || []
						g.push(group)
						userGroups[uid] = g
					})
				})

				this.allGroups = allGroups
				this.userGroups = userGroups
				this.myGroups = data

				this.list()
			})
		},

		add(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let item = this.form
          //TODO check information
          item.groups = [];
          this.ajaxPUT(this.api('/common/user'), item).then( id =>{
            item.id = id
            this.items.push(item)
            this.onNewItem = false
          })
        } else {

        }
      })
		},
		update(){
			let item = this.form
			// item.groups = [];
			this.ajaxPUT(this.api('/common/user'), item).then( id =>{
				item.id = id
				this.onEditItem = false
			})
		},

		edit(item){
			this.form = item
			this.onEditItem = true
		},

		list(){

			this.ajaxGET(this.api('/common/user'), {q: this.q})
			.then( list => {
				let permits = this.permits
				let userGroups = this.userGroups
				list.forEach(function(item){
					if(item.isAdmin) item.comment = '管理员'

					item.groups = userGroups[item.id] || []
					item.permits = permits[item.id] || {}
					item.buz = item.permits.buz || ''
					userGroups[item.id] = item.groups

          userList.push(item.username)
				})

				list.sort(function(a, b){
				    var s1 = a.username.toLowerCase(), s2 = b.username.toLowerCase();
				    if(s1<s2) return -1;
					return 1;
				});

				this.items = list
				this.pager.total = list.length
			})
		},

		remove(item){
			let url = this.api('/common/user/'+item.id)

			this.$confirm('确定删除该用户吗？', '提示', {
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
		setUserGroup(user){
			this.curItem = user
			let map = {}
			user.groups.forEach(function(g){
				map[g.name] = 1
			})
			user.myGroupsMap = map

			let form = {}
			let allGroups = this.allGroups
			for(let name in allGroups){
				form[name] = (name in map);
			}
			this.groupForm = form;

			this.onSetGroup = true
		},
		saveUserGroup(){
			let user = this.curItem
			let groups = this.groupForm
			let allGroups = this.allGroups
			for(let name in groups){
				let selected = groups[name]
				if(!selected && (name in user.myGroupsMap)){
					let users = (allGroups[name].users || []).filter(function(uid){
						return uid!=user.id
					})
					this.updateGroup(name, users)
					user.groups = user.groups.filter(function(g){
						return g.name!=name;
					})
				} else if(selected && !(name in user.myGroupsMap)){
					let users = allGroups[name].users || [];
					users.push(user.id)
					user.groups.push(allGroups[name])
					this.updateGroup(name, users)
				}
			}
			this.onSetGroup = false
		},

		updateGroup(group, users){
			let q = JSON.stringify({name:group});
			let data = JSON.stringify({name:group,users:users});

			this.ajaxPOST(this.api('/users/user_group/_update'), {query:q,set:data})
			.then( r => {})
		},

		setUserPermit(user){
			this.curItem = user;
			this.ajaxGET(this.api('/users/'+TABLE_PERMIT+'/'+user.id))
			.then( data => {
				let p = data || {}
				let perm = {
					buz: (p.buz || []).join(';'),
					emails: (p.emails || []).join('\n')
				}
				this.perm = perm
				this.onSetPermit = true
			})
		},
		saveUserPermit(){
			let user = this.curItem;
			let fd = this.perm
			let buz = (fd.buz && fd.buz.split(/[,;\s]+/g)) || []
			let emails = (fd.emails && fd.emails.split(/[,;\r\n]+/g)) || []
			let query = JSON.stringify({_id: user.id})
			let set   = JSON.stringify({
				_id: user.id,
				buz,
				emails
			})

			this.ajaxPOST(this.api('/users/'+TABLE_PERMIT+'/_update'), {
				query, set, upsert: true
			}).then( r => {
				user.permits = fd
				user.buz = buz
				this.onSetPermit = false
			});
		}
	}
}

</script>
