(function($) {
	mui.init({
		swipeBack: true
	});
	var validator = {
		username: new Validator('maxlength:16|minlength:2'),
		password: new Validator('maxlength:16|minlength:6|pattern:^[a-zA-Z0-9]*$'),
	}
	var vue = new Vue({
		el: "#login",
		data: {
			username: "",
			password: "",
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
		}
	});

	$.plusReady(function() {
		var login = function(data) {
			var wd = plus.nativeUI.showWaiting();
			$.ajax(hostUrl + "login.php", {
				data: data,
				dataType: 'json',
				type: 'post',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 60000,
				success: function(data) {
					if(data.message == "登陆成功") {
						wd.close();
						$.alert(data.info.userName+"你好,欢迎登陆", "登陆成功", "关闭");
						localStorage.setItem("token", data.info.token);
						localStorage.setItem("userName", data.info.userName);
						localStorage.setItem("uId", data.info.uId);
						plus.webview.close("index");
						plus.webview.close("guide");
						plus.webview.open("index.html", "index")
						plus.webview.currentWebview().close();

					} else {
						// 如果密码错误，提示一下信息  
						wd.close();
						$.alert(data.message, "登陆失败", "关闭");
					}
				},
				error: function(xhr, type, errorThrown) {
					wd.close();
					$.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
				}
			});
		}
		document.getElementById("toReg").addEventListener("tap", function() {
			plus.webview.open("reg.html", "reg");
		})
		document.getElementById("submit").addEventListener("tap", function(e) {
			var data = {
				userName: vue.username,
				password: md5(vue.password),
			};
			login(data);
		});

	});
})(mui);