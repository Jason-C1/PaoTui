	mui.init();
	mui.plusReady(
		function() {

						//			function addlis1() {
						//				var signin=document.getElementById("signin");
						//				signin.innerHTML="已登陆";
						//				var p=document.createElement("p");
						//				p.className="mui-ellipsis";
						//				p.innerHTML="......";
						//				signin.appendChild(p);
						//			}
						/**
						 * 获取本地存储中launchFlag的值
						 * http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getItem
						 * 若存在，说明不是首次启动，直接进入首页；
						 * 若不存在，说明是首次启动，进入引导页；
						 */
						 var launchFlag = plus.storage.getItem("launchFlag");
						 if(!launchFlag) {
						 	mui.openWindow({
						 		url: "guide.html",
						 		id: "guide"
						 	});
						 }
						 document.getElementById("reset_launch").addEventListener("tap", function() {
							/**
							 * 系统确认对话框
							 * http://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.confirm
							 */
							 plus.nativeUI.confirm("是否重置首次打开app？", function(event) {
								/**
								 * 按钮的索引，从0开始；
								 */
								 var index = event.index;
								 if(index == 0) {
									/**
									 * 通过key值删除键值对存储的数据
									 * http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.removeItem
									 */

									 plus.storage.removeItem("launchFlag");
									/**
									 * 自动消失提示，位置为center；
									 * http://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.ToastOption
									 */
									 plus.nativeUI.toast("重置成功，2秒后重启app。", {
									 	verticalAlign: "center"
									 });
									/**
									 * 1秒后重启应用
									 * http://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.restart
									 */
									 setTimeout(function() {
									 	plus.runtime.restart();
									 }, 1000);
									}
								}, "重置启动", ["重置", "放弃"]);
							});
						//按钮功能
						document.getElementById("push").addEventListener("tap", function() {
							/**
							 * 进入发单界面
							 * 
							 */
							 mui.openWindow({
							 	url: "push.html",
							 	id: "push"
							 });
							});
							for(){
								document.getElementById("ddgz"+dd[i].id).addEventListener("tap", function() {
							/**
							 * 进入发单界面
							 * 
							 */
							 mui.openWindow({
							 	url: "ddgz.html/id="+dd[i].id,
							 	id: "ddgz"
							 });
							});
							}
							
						//			document.getElementById("xingfu").addEventListener("tap", function() {
						//				/**
						//				 * 进入聊天界面
						//				 * 
						//				 */
						//				mui.openWindow({
						//					url: "im-chat.html",
						//					id: "im-chat"
						//				});
						//			});
					}
					);