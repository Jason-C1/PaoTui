(function($) {
	$.init({
		swipeBack: false, //关闭右滑关闭功能
	});
	var hostUrl = "http://169.254.136.8/";

	/*
	 *请求
	 * ate:0,1,2,3,4;类别0为推荐,暂时表示全部.
	 * 下拉刷新要cate size
	 * 上拉加载要minid cate size
	 * size:正常请求或下拉加载的请求订单条数;
	 * minid:返回第minid-size条,到第minid条
	 */
	var lastId = [0, 0, 0, 0, 0];
	var minId = '';
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
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
			plus.webview.open('guide.html', 'guide', {}, 'fade-in', 0);
		}
		var self = plus.webview.currentWebview(),
			leftPos = Math.ceil((window.innerWidth - 60) / 2); // 设置凸起大图标为水平居中
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

	$.ready(function() {
		var orders = [
			new Vue({
				el: '#list1',
				data: {
					items: []
				}
			}),
			new Vue({
				el: '#list2',
				data: {
					items: []
				}
			}),
			new Vue({
				el: '#list3',
				data: {
					items: []
				}
			}),
			new Vue({
				el: '#list4',
				data: {
					items: []
				}
			}),
			new Vue({
				el: '#list5',
				data: {
					items: []
				}
			}),
			new Vue({
				el: '#list6',
				data: {
					items: []
				}
			}),
		];

		var pulldownRefresh = function(index, self) {
			if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('似乎已断开与互联网的连接', {
					verticalAlign: 'top'
				});
				return;
			}
			var data = {
				cate: index,
				size: 5,
			};
			//	var ul = self.element.querySelector('.mui-table-view');
			//ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
			$.getJSON(hostUrl + "index.php", data, function(list) {
				if(self) {
					self.endPullDownToRefresh();
				}
				if(list && list.length > 0) {
					if(lastId[index] == list[0].oId) {
						mui.toast("没有新的订单了哟~")
					} else {
						lastId[index] = list[0].oId;
						if(!minId) { //首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
							minId = list[list.length - 1].oId;
						}
						var newItems = [];
						list.forEach(function(item) {
							newItems.push({
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
						orders[index].items = newItems;
					}
				}
			});
		};

		var pullUpToRefresh = function(index, self) {
			var data = {
				cate: index,
				size: 5,
			};
			if(minId) { //说明已有数据，目前处于上拉加载，传递当前minId 返回历史数据
				data.minId = minId;
			}

			$.getJSON(hostUrl + "index.php", data, function(list) {
				self.endPullUpToRefresh();
				if(list && list.length > 0) {
					minId = list[list.length - 1].oId; //保存最后一条消息的id，上拉加载时使用
					var newItems = [];
					list.forEach(function(item) {
						newItems.push({
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
					orders[index].items = newItems.concat(orders[index].items);
				} else {
					mui.toast("没有更多订单了哟~");
				}

			});

		};
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			pulldownRefresh(index); //打开页面是自动加载数据
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						pulldownRefresh(index, self);
					},
				},
				up: {
					contentrefresh: '正在查找更多订单...',
					callback: function() {
						var self = this;
						pullUpToRefresh(index, self);

					}

				}
			});
		});

	});
})(mui);