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
				}else{
					mui.alert(JSON.stringify(data), "成功", "关闭");
				}
				plus.webview.close("guide");
				plus.webview.currentWebview().close();
			}
			,
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
}(mui, window.app = {}));