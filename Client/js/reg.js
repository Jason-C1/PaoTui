mui.init({
	swipeBack: true
});
var validator ={
	username:new Validator('maxlength:16|minlength:2'),
	password:new Validator('maxlength:16|minlength:6|pattern:^[a-zA-Z0-9]*$'),
}
var vue = new Vue({
	el: "#reg",
	data: {
		username: "",
		password: "",
		check: "",
	},
	computed:{
		usernameError:function () {
			if(!this.username||validator.username.is_valid(this.username))
				return false;
			return true;
		},
		passwordError:function () {
			if(!this.password||validator.password.is_valid(this.password))
				return false;
			return true;
		},
		checkError:function () {
			if(!this.check||this.check == this.password)
				return false;
			return true;
		},
	}
});

