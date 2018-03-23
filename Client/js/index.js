mui.init({
	/*pullRefresh: {
		container: "#tabbar-with-chat", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down: {
			style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: '52px', //可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '46px', //可选 默认0px,下拉刷新控件的起始位置
			auto: false, //可选,默认false.首次加载自动上拉刷新一次
			callback: function() {
				//setTimeout(function() {
				location.reload();
				mui('#tabbar-with-chat').pullRefresh().endPulldown();
				//}, 5000);
			} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		up: {　　　　
			contentrefresh: '正在加载...',
			contentnomore: '没有更多数据了',
			callback: function() {

			} //上拉加载下一页
		}
	}*/
});
mui.plusReady(function() {
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
	document.getElementById("chat-sample").addEventListener("tap", function() {
		mui.openWindow({
			url: "chat.html",
			id: "chat1",
			show: {
				aniShow: "slide-in-right",
				duration: 300,
				autoShow: true
			},
			waiting: {
				autoShow: false
			}
		});
	});
});
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
var header = document.getElementById("header");
document.getElementById("index").addEventListener("tap", function() {
	header.innerHTML = null;
	var a = document.createElement("a");
	a.id = "push";
	a.className = "mui-icon mui-icon-plus mui-pull-right mui-a-color";
	header.appendChild(a);
	var button = document.createElement("button");
	button.type = "button";
	button.className = "mui-btn mui-btn-link";
	var span = document.createElement("span");
	span.className = "mui-icon mui-icon-search";
	button.appendChild(span);
	span = document.createElement("span");
	span.innerHTML = "杭州";
	button.appendChild(span);
	header.appendChild(button);
	var div = document.createElement("div");
	div.className = "mui-title title-search";
	span = document.createElement("span");
	span.className = "mui-icon mui-icon-search";
	div.appendChild(span);
	span = document.createElement("span");
	span.innerHTML = " 垃圾街鸭血粉丝";
	div.appendChild(span);
	header.appendChild(div);
});
document.getElementById("order").addEventListener("tap", function() {
	header.innerHTML = null;
	var div = document.createElement("div");
	div.className = "mui-title title-search";
	div.style.left = "10px";
	div.style.right = "10px";
	span = document.createElement("span");
	span.className = "mui-icon mui-icon-search";
	div.appendChild(span);
	span = document.createElement("span");
	span.innerHTML = " 搜索订单";
	div.appendChild(span);
	header.appendChild(div);
});
document.getElementById("message").addEventListener("tap", function() {
	head("消息");
});
document.getElementById("mine").addEventListener("tap", function() {
	head("我的");
});
var head = function(str) {
	header.innerHTML = null;
	header.className = "mui-bar mui-bar-nav";
	var h1 = document.createElement("h1");
	h1.className = "mui-title";
	h1.innerHTML = str;
	header.appendChild(h1);
}
mui('.mui-scroll-wrapper').scroll({
	scrollY: true, //是否竖向滚动
	scrollX: false, //是否横向滚动
	startX: 0, //初始化时滚动至x
	startY: 0, //初始化时滚动至y
	indicators: true, //是否显示滚动条
	deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
	bounce: true, //是否启用回弹
});