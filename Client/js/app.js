(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		// 显示一个等待的对话框  
		var wd = plus.nativeUI.showWaiting();
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		postData("http://sjk06.cn/chatphp/signin.php", loginInfo,
			function(data) {
				wd.close(); // 调用成功，先关闭等待的对话框  
				if(data.result != "checkOK") {
					// 如果密码错误，提示一下信息  
					mui.alert("用户名或密码错误", "登录错误", "关闭");
					return;
				} else {
					mui.alert(JSON.stringify(data), "成功", "关闭");
				}
				plus.webview.close("guide");
				plus.webview.currentWebview().close();
			},
			wd //传递给postData的最后一个参数，失败的时候关闭等待对话框  
		);
	};

	function postData(url, data, callback, waitingDialog) {
		mui.ajax(url, {
			data: 'userInfo=' + JSON.stringify(data),
			dataType: 'json',
			type: 'post',
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			timeout: 60000,
			success: callback,
			error: function(xhr, type, errorThrown) {
				waitingDialog.close();
				mui.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
			}
		});
	}

	/**
	 * 格式化时间的辅助类，将一个时间转换成x小时前、y天前等
	 */
	var dateUtils = {
		UNITS: {
			'年': 31557600000,
			'月': 2629800000,
			'天': 86400000,
			'小时': 3600000,
			'分钟': 60000,
			'秒': 1000
		},
		humanize: function(milliseconds) {
			var humanize = '';
			mui.each(this.UNITS, function(unit, value) {
				if(milliseconds >= value) {
					humanize = Math.floor(milliseconds / value) + unit + '前';
					return false;
				}
				return true;
			});
			return humanize || '刚刚';
		},
		format: function(dateStr) {
			var date = this.parse(dateStr)
			var diff = Date.now() - date.getTime();
			if(diff < this.UNITS['天']) {
				return this.humanize(diff);
			}

			var _format = function(number) {
				return(number < 10 ? ('0' + number) : number);
			};
			return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
		},
		parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
			var a = str.split(/[^0-9]/);
			return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
		}
	};
}(mui, window.app = {}));