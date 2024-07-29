export default {
	getUser(){
		let user = localStorage.getItem("user")
        if(user){
            return JSON.parse(user)
        }
        return null
	},

	site: {
		copyright: 'dbvis &copy; lovfrichen. 2018-2024'
	}
}
