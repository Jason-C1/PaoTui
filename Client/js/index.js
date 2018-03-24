(function() {
	var theurl = "http://10.103.105.55";
	var lastId = '',
		minId = ''; //最新新闻的id 
	mui.init({
		swipeBack: true, //启用右滑关闭功能
		pullRefresh: {
			container: '#dd',
			down: {
				style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
				auto: true, //可选,默认false.首次加载自动上拉刷新一次
				callback: pulldownRefresh,
			},
			up: {
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了',
				callback: pullupRefresh,
			}
		}
	});
	/**
	 *  下拉刷新获取最新列表 
	 */
	function pulldownRefresh() {

		if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
			plus.nativeUI.toast('似乎已断开与互联网的连接', {
				verticalAlign: 'top'
			});
			return;
		}
		if(lastId) { //说明已有数据，目前处于下拉刷新，增加时间戳，触发服务端立即刷新，返回最新数据
			data.lastId = lastId;
			data.time = new Date().getTime() + "";
		}
		mui.getJSON(theurl + "/index.php", {}, function(list) {
			mui('#dd').pullRefresh().endPulldownToRefresh();
			var list0 = list.C0;
			if(list0 && list0.length > 0) {
				lastId = list0[0].id; //保存最新消息的id，方便下拉刷新时使用
				if(!minId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
					minId = list0[list0.length - 1].id;
				}

				list0.forEach(function(item) {
					order.c0.push({
						uId: item.uId,
						title: item.title,
						price: item.price,
						oFrom: item.oFrom,
						oTo: item.oTo,
						oId: item.oId,
						deadline: item.deadline,
						dateTime: item.dateTime,
					});
				});
			}
		});

		//请求最新列表信息流
		//		mui.getJSON("http://spider.dcloud.net.cn/api/news", data, function(rsp) {
		//			mui('#list').pullRefresh().endPulldownToRefresh();
		//		if(rsp && rsp.length > 0) {
		//			lastId = rsp[0].id; //保存最新消息的id，方便下拉刷新时使用
		//
		//			if(!minId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
		//				minId = rsp[rsp.length - 1].id;
		//			}
		//			news.items = convert(rsp).concat(news.items);
		//		}
		//		});

	}

	mui.plusReady(function() {
		/**
		 * 获取本地存储中launchFlag的值
		 * http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getItem
		 * 若存在，说明不是首次启动，直接进入首页；
		 * 若不存在，说明是首次启动，进入引导页；
		 */
		var launchFlag = plus.storage.getItem("launchFlag");
		if(!launchFlag) {
			plus.webview.open('guide.html', 'guide', {}, 'fade-in', 0);
		}
		var self = plus.webview.currentWebview(),
			leftPos = Math.ceil((window.innerWidth - 60) / 2); // 设置凸起大图标为水平居中

		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		/**
		 * drawNativeIcon 绘制带边框的半圆，
		 * 实现原理：
		 *   id为bg的tag 创建带边框的圆
		 *   id为bg2的tag 创建白色矩形遮住圆下半部分，只显示凸起带边框部分
		 * 	 id为iconBg的红色背景图
		 *   id为icon的字体图标
		 *   注意创建先后顺序，创建越晚的层级越高
		 */
		var drawNativeIcon = util.drawNative('icon', {
			bottom: '5px',
			left: leftPos + 'px',
			width: '60px',
			height: '60px'
		}, [{
			tag: 'rect',
			id: 'bg',
			position: {
				top: '1px',
				left: '0px',
				width: '100%',
				height: '100%'
			},
			rectStyles: {
				color: '#fff',
				radius: '50%',
				borderColor: '#ccc',
				borderWidth: '1px'
			}
		}, {
			tag: 'rect',
			id: 'bg2',
			position: {
				bottom: '-0.5px',
				left: '0px',
				width: '100%',
				height: '45px'
			},
			rectStyles: {
				color: '#fff'
			}
		}, {
			tag: 'rect',
			id: 'iconBg',
			position: {
				top: '5px',
				left: '5px',
				width: '50px',
				height: '50px'
			},
			rectStyles: {
				color: '#d74b28',
				radius: '50%'
			}
		}, {
			tag: 'font',
			id: 'icon',
			text: '+', //此为字体图标Unicode码'\e600'转换为'\ue600'
			position: {
				top: '0px',
				left: '0px',
				width: '100%',
				height: '100%'
			},
			textStyles: {
				fontSrc: '_www/fonts/iconfont.ttf',
				align: 'center',
				color: '#fff',
				size: '50px'
			}
		}]);
		// append 到父webview中
		self.append(drawNativeIcon);

		//自定义监听图标点击事件
		var active_color = '#fff';
		drawNativeIcon.addEventListener('click', function(e) {
			//open(url: URIString, id: WebviewIdString, 
			//styles: plus.webview.WebviewStyles, aniShow: DOMString, 
			//duration: Number, showedCB: Function): plus.webview.WebviewObject
			plus.webview.open('push.html', 'push', {}, 'slide-in-bottom', 200);
		});
		// 中间凸起图标绘制及监听点击完毕

		// 创建子webview窗口 并初始化
		var aniShow = {};
		util.initSubpage(aniShow);

		var nview = plus.nativeObj.View.getViewById('tabBar'),
			activePage = plus.webview.currentWebview(),
			targetPage,
			subpages = util.options.subpages,
			pageW = window.innerWidth,
			currIndex = 0;

		/**
		 * 根据判断view控件点击位置判断切换的tab
		 */
		nview.addEventListener('click', function(e) {
			var clientX = e.clientX;
			if(clientX > 0 && clientX <= parseInt(pageW * 0.25)) {
				currIndex = 0;
			} else if(clientX > parseInt(pageW * 0.25) && clientX <= parseInt(pageW * 0.45)) {
				currIndex = 1;
			} else if(clientX > parseInt(pageW * 0.45) && clientX <= parseInt(pageW * 0.8)) {
				currIndex = 2;
			} else {
				currIndex = 3;
			}
			// 匹配对应tab窗口	
			if(currIndex > 0) {
				targetPage = plus.webview.getWebviewById(subpages[currIndex - 1]);
			} else {
				targetPage = plus.webview.currentWebview();
			}

			if(targetPage == activePage) {
				return;
			}

			//底部选项卡切换
			util.toggleNview(currIndex);
			// 子页面切换
			util.changeSubpage(targetPage, activePage, aniShow);
			//更新当前活跃的页面
			activePage = targetPage;
		});

	});

	var order = new Vue({
		el: '#dd',
		data: {
			c0: [],
			c1: [],
			c2: [],
			c3: [],
			c4: [],
		}

	})

	function pullupRefresh() {
		//		var data = {
		//			column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
		//		};
		//
		//		if(minId) { //说明已有数据，目前处于上拉加载，传递当前minId 返回历史数据
		//			data.minId = minId;
		//			data.time = new Date().getTime() + "";
		//			data.pageSize = 10;
		//		}
		//		//请求历史列表信息流
		//		//				mui.getJSON("http://spider.dcloud.net.cn/api/news", data, function(rsp) {
		//		//					mui('#list').pullRefresh().endPullupToRefresh();
		//		//					if(rsp && rsp.length > 0) {
		//		//						minId = rsp[rsp.length - 1].id; //保存最后一条消息的id，上拉加载时使用
		//		//						news.items = news.items.concat(convert(rsp));
		//		//					}
		//		//				});
		//		mui.getJSON("http://172.19.24.199/index.php", data, function(list) {
		//			list.C0.forEach(function(item) {
		//				order.c0.push({
		//					uId: item.uId,
		//					title: item.title,
		//					price: item.price,
		//					oFrom: item.oFrom,
		//					oTo: item.oTo,
		//					oId: item.oId,
		//					deadline: item.deadline,
		//					dateTime: item.dateTime,
		//				});
		//			});
		//		});
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
})();