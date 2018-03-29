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
		el: "#push",
		data: {
			title: "",
			content: "",
			cate: "",
			oFrom: "",
			oTo: "",
			deadline: "",
			money: "",
			price: "",
		},
		computed: {
			total: function() {
				return this.money * 1 + this.price * 1;
			}

		}
	});

	//	$.plusReady(function() {

	var push = function(data) {
		//			var wd = plus.nativeUI.showWaiting();
		$.ajax(hostUrl + "push.php", {
			data: data,
			dataType: 'json',
			type: 'post',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: 60000,
			success: function(data) {
				if(data.message == "注册成功") {
					//						wd.close();
					console.log(data);
					//						$.alert("注册成功,系统将自动登陆", "注册成功", "关闭");
					//						localStorage.setItem("token", data.info.token);
					//						localStorage.setItem("userName", data.info.userName);
					//						localStorage.setItem("uId", data.info.uId);
					//						plus.webview.close("index");
					//						plus.webview.close("guide");
					//						plus.webview.close("login");
					//						plus.webview.open("index.html", "index")
					//						plus.webview.currentWebview().close();

				} else {
					// 如果密码错误，提示一下信息  
//					wd.close();
					$.alert(data.message, "注册失败", "关闭");
				}
			},
			error: function(xhr, type, errorThrown) {
//				wd.close();
				$.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
			}
		});
	}
	document.getElementById("submit").addEventListener("tap", function(e) {
		var data = {
			title: vue.title,
			content: vue.content,
			cate: vue.cate,
			oFrom: vue.oFrom,
			oTo: vue.oTo,
			deadline: vue.deadline,
			money: vue.money,
			price: vue.price,
		}
//			data.uId = localStorage.getItem("uId");
	push(data);
	});


	//	});
	document.getElementById("deadline").addEventListener('tap', function() {
		var dDate = new Date();
		var minDate = new Date();
		minDate.setFullYear(dDate.getFullYear());
		var maxDate = new Date();
		maxDate.setFullYear(dDate.getFullYear());
		maxDate.setYear(maxDate.getYear() + 1);
		var dTime = new Date();
		dTime.setHours(6, 0);
		var deadline = document.getElementById("deadline");
//
//		plus.nativeUI.pickDate(function(e) {
//			var d = e.date;
//			deadline.value = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " ";
//		}, function(e) {
//			plus.nativeUI.pickTime(function(e) {
//				var d = e.date;
//				deadline.value += d.getHours() + ":" + d.getMinutes();
//			}, function(e) {
//
//			}, {
//				title: "请选择时间",
//				is24Hour: true,
//				time: dTime
//			});
//		}, {
//			title: "请选择日期",
//			date: dDate,
//			minDate: minDate,
//			maxDate: maxDate
//		});
	});
})(mui);