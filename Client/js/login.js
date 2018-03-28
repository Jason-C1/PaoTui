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
		var data ={
			userName:"zhang",
			password:"123456"
		}
		
		var login = function() {
			$.ajax(hostUrl+"login.php", {
				data: data,
				dataType: 'json',
				type: 'get',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 60000,
				success: function(data) {
					if(data.message) {
						// 如果密码错误，提示一下信息  
						$.alert("用户名或密码错误", "登录错误", "关闭");
					} else {
						$.rm(JSON.stringify(data), "成功", "关闭");
					}
				},
				error: function(xhr, type, errorThrown) {
//					wd.close();
					$.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
				}
			});
		}
		document.getElementById("submin").addEventListener("tap", function(e) {
			login();
		});
	$.plusReady(function() {
//		var data ={
//			userName:"zhang",
//			password:"123456"
//		}
//		
//		var login = function() {
//			var wd = plus.nativeUI.showWaiting();
//			$.ajax(hostUrl+"login.php", {
//				data: data,
//				dataType: 'json',
//				type: 'post',
//				contentType: "application/x-www-form-urlencoded; charset=utf-8",
//				timeout: 60000,
//				success: function(data) {
//					wd.close(); // 调用成功，先关闭等待的对话框  
//					if(data.result == "checkOK") {
//						// 如果密码错误，提示一下信息  
//						$.alert("用户名或密码错误", "登录错误", "关闭");
//						return;
//					} else {
//						$.alert(JSON.stringify(data), "成功", "关闭");
//					}
//
//					plus.webview.close("guide");
//					plus.webview.currentWebview().close();
//				},
//				error: function(xhr, type, errorThrown) {
//					wd.close();
//					$.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
//				}
//			});
//		}
//		document.getElementById("submin").addEventListener("tap", function(e) {
//			login();
//		});

	});
})(mui);