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

	$.plusReady(function() {

		var push = function(data) {
			var wd = plus.nativeUI.showWaiting();
			$.ajax(hostUrl + "push.php", {
				data: data,
				dataType: 'json',
				type: 'post',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 60000,
				success: function(data) {
					if(data.message == "发布订单成功") {
						wd.close();
						$.alert("发布订单成功", "发布成功", "关闭");
						plus.webview.close("push");
						plus.webview.show("index");
						plus.webview.currentWebview().close();
					} else {
						// 如果密码错误，提示一下信息  
						wd.close();
						$.alert(data.message, "提交失败", "关闭");

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
				title: vue.title,
				content: vue.content,
				cate: vue.cate,
				oFrom: vue.oFrom,
				oTo: vue.oTo,
				deadline: vue.deadline,
				money: vue.money,
				price: vue.price,
			}
			data.uId = localStorage.getItem("uId") || "";
			push(data);
		});

	});
	document.getElementById("deadline").addEventListener('tap', function() {
		var dDate = new Date();
		var minDate = new Date();
		minDate.setFullYear(dDate.getFullYear());
		var maxDate = new Date();
		maxDate.setFullYear(dDate.getFullYear());
		maxDate.setYear(maxDate.getYear() + 1);
		var dTime = new Date();
		dTime.setHours(6, 0);
		
		
		plus.nativeUI.pickDate(function(e) {
			var d = e.date;
			vue.deadline = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " ";
			plus.nativeUI.pickTime(function(e) {
				var d = e.date;
				vue.deadline += d.getHours() + ":" + d.getMinutes();
			}, function(e) {

			}, {
				title: "请选择时间",
				is24Hour: true,
				time: dTime
			});
		}, function(e) {

		}, {
			title: "请选择日期",
			date: dDate,
			minDate: minDate,
			maxDate: maxDate
		});
	});
})(mui);