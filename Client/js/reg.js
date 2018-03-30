(function($) {
	$.init({
		swipeBack: true
	});
	var validator = {
		username: new Validator('maxlength:16|minlength:2'),
		password: new Validator('maxlength:16|minlength:6|pattern:^[a-zA-Z0-9]*$'),
		phone: new Validator('pattern:^1\\d{10}$'),
	}
	var vue = new Vue({
		el: "#reg",
		data: {
			username: "",
			password: "",
			check: "",
			phone: "",
		},
		computed: {
			usernameError: function() {
				if(!this.username || validator.username.is_valid(this.username))
					return false;
				return true;
			},
			passwordError: function() {
				if(!this.password || validator.password.is_valid(this.password))
					return false;
				return true;
			},
			checkError: function() {
				if(!this.check || this.check == this.password)
					return false;
				return true;
			},
			phoneError: function() {
				if(!this.phone || validator.phone.is_valid(this.phone))
					return false;
				return true;
			},
		}
	});

	$.plusReady(function() {
		var reg = function(data) {
			var wd = plus.nativeUI.showWaiting();
			$.ajax(hostUrl + "reg.php", {
				data: data,
				dataType: 'json',
				type: 'post',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 60000,
				success: function(data) {
					if(data.message == "注册成功") {
						wd.close();
						$.alert("注册成功,系统将自动登陆", "注册成功", "关闭");
						localStorage.setItem("token", data.info.token);
						localStorage.setItem("userName", data.info.userName);
						localStorage.setItem("uId", data.info.uId);
						plus.webview.close("index");
						plus.webview.close("guide");
						plus.webview.close("login");
						plus.webview.open("index.html", "index")
						plus.webview.currentWebview().close();
					} else {
						// 如果密码错误，提示一下信息  
						wd.close();
						$.alert(data.message, "注册失败", "关闭");
					}
				},
				error: function(xhr, type, errorThrown) {
					wd.close();
					$.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
				}
			});
		}
		document.getElementById("submit").addEventListener("tap", function(e) {
			var data = {
				userName: vue.username,
				password:md5(vue.password),
				check: md5(vue.check),
				phone: vue.phone,
			};
			reg(data);
		});
		document.getElementById("toLogin").addEventListener("tap", function() {
			$.back();
		})
	});

})(mui);