import {ajaxGET, ajaxPUT, ajaxPOST, ajaxDELETE} from '@/components/js/httputils'
import constant from '@/constant'

function gotoLogin(){
    constant.user = null
    location.href = '#/'
    location.reload();
}

export default {
    checkLogin(){
        let user = localStorage.getItem("user")
        if(user){
            return new Promise(function(resolve){
                resolve(JSON.parse(user))
            })
        }
        return ajaxGET(constant.api('/web')).then( d => {
            return d;
        })
    },
    logoff(){
        localStorage.removeItem("user")
        ajaxPOST(constant.api('/web/logoff')).then(gotoLogin)
                .catch(gotoLogin)
    },
	getProfile(type){
		let u = constant.api('/session/'+constant.user.id+'/profile')
		return ajaxGET(u, {type: type})
	},
	saveProfile(type, content){
		let u = constant.api('/session/'+constant.user.id+'/profile')
		return ajaxPUT(u, {type: type, content: content})
	},

	listS(cb){
		this.list(list => {
			cb(list.map(user => {
					return {
						id: user.id,
						name: user.name,
						username: user.username
					}
				}
			))
		})
	},

	list(cb){
		ajaxGET(constant.api('/common/user'), {}).then( cb )
	},

	putHistory(c){
	   let json = JSON.stringify({uid:constant.user.id, content:c, ts: new Date().getTime()});
	   return ajaxPUT(constant.api('/users/search_hist'), {row: json})
    },

    getHistory(){
    	var query = JSON.stringify({uid: constant.getUser().id});
    	var sort  = JSON.stringify({ts: -1});
    	var keys  = JSON.stringify({content:1});
    	return ajaxGET(constant.api('/users/search_hist'), {query: query, sort: sort, keys:keys, limit: 30})
    },

    putDict(name, content){
        let query = {w: name};
        let row = {
            w: name,
            c: content,
            tag: 'mj.user',
            uid: constant.getUser().id,
            ts: new Date().getTime()
        }
        return ajaxPOST(constant.api('/users/user_dict/_update'), {
            query: JSON.stringify(query),
            set: JSON.stringify(row),
            upsert: true
        });
    },

    getDict(name, cb){
        var query = JSON.stringify({tag: 'mj.user', w: name});
        return ajaxGET(constant.api('/users/user_dict'), {query: query});
    },

    putComment(type, oid, content){
        let row = {
            content,
            type,
            oid,
            uid: constant.user.id,
            user: constant.user.name,
            ts: new Date().getTime()
        }
        return ajaxPUT(constant.api('/users/user_comment'), {
            row: JSON.stringify(row)
        });
    },

    getComments(type, oid){
        let query = {
            type, oid
        }
        return ajaxGET(constant.api('/users/user_comment'), {
            query: JSON.stringify(query),
        })
    },

    getReadHist(vue, type, id){
    	return ajaxGET(constant.api('/users/read_history/'+id)).then( data => {
          if(!data) return;
          let map = data.userlist || []
          let arr = []
          for(let key in map){
            arr.push(map[key])
          }
          vue.userlist = arr
        })
    },

    putRead(vue, type, id){
    	var record = {
    		name: constant.user.name,
            username: constant.user.username,
          	timestamp: new Date().getTime()
        };
	    var query = JSON.stringify({_id:id, type});
	    var set = {};
	    set['userlist.' + constant.user.id] = record;
	    set = JSON.stringify(set);
	    return ajaxPOST(constant.api('/users/read_history/_update'),
	    	{query:query,set:set,upsert:true});
	},

    getCollectTags(){
    	var query = JSON.stringify({uid: 2});
        var sort = JSON.stringify({time: 1});
        var args = {query: query, sort: sort, limit: 0};

        return ajaxGET(constant.api('/users/user_tag'), args)
    },

    getCollects(tag){
    	var query = {
            type: 'email',
            uid: constant.user.id,
            'collect.tags': {
                '$in': [tag]
            }
        };

        let args = {
            query: JSON.stringify(query),
            keys: JSON.stringify({oid: 1}),
            limit: 10
        }

        return ajaxGET(constant.api('/users/user_action'), args)
    }
}
