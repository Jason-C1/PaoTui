(function($) {
	//预加载详情页

	open_detail = function(item) {
		console.log(JSON.stringify(item));
		mui.fire(webview_detail, 'get_detail', item);
		console.log(webview_detail);
		setTimeout(function() {
			webview_detail.show("slide-in-right", 300);
		}, 150);
	}
	$.init({
		swipeBack: true, //关闭右滑关闭功能
	});
	var ordertpl = {
		template: orderComponent,
		props: ['item'],
	};
	/*
	 *请求
	 * ate:0,1,2,3,4;类别0为推荐,暂时表示全部.
	 * 下拉刷新要cate size
	 * 上拉加载要minid cate size
	 * size:正常请求或下拉加载的请求订单条数;
	 * minid:返回第minid-size条,到第minid条
	 */
	var lastId = [0, 0, 0, 0, 0];
	var minId = [0, 0, 0, 0, 0];
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	mui.plusReady(function() {
		webview_detail = mui.preload({
			url: 'detail.html',
			id: 'news_detail',
			styles: {
				"render": "always",
				"popGesture": "hide",
				"bounce": "vertical",
				"bounceBackground": "#efeff4",
			}
		});
	});

	$.ready(function() {
		var orders = [
			new Vue({
				el: '#list1',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
			new Vue({
				el: '#list2',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
			new Vue({
				el: '#list3',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
			new Vue({
				el: '#list4',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
			new Vue({
				el: '#list5',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
			new Vue({
				el: '#list6',
				data: {
					items: []
				},
				components: {
					'order': ordertpl,
				}
			}),
		];

		function convert(items) {
			var newItems = [];
			items.forEach(function(item) {
				newItems.push({
					uId: item.uId,
					userName: item.userName,
					title: item.title,
					price: item.price,
					oFrom: item.oFrom,
					oTo: item.oTo,
					oId: item.oId,
					deadline: item.deadline,
					dateTime: dateUtils.format(item.dateTime),
					state:item.state
				});
			});
			return newItems;
		}
		var pulldownRefresh = function(index, self) {
			if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
				plus.nativeUI.toast('似乎已断开与互联网的连接', {
					verticalAlign: 'top'
				});
				return;
			}
			var data = {
				state: index,
				token: "yantao",
				id: 1,
			};
			//	var ul = self.element.querySelector('.mui-table-view');
			//ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
			$.getJSON(hostUrl + "myForm.php", data, function(list) {
				if(self) {
					self.endPullDownToRefresh();
				}
				if(list && list.length > 0) {
					if(lastId[index] == list[0].oId) {
						mui.toast("没有新的订单了哟~")
					} else {
						lastId[index] = list[0].oId;
						orders[index].items = convert(list);
					}
				}
			});
		};
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
		//循环初始化所有下拉刷新，上拉加载。
		$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
			pulldownRefresh(index); //打开页面是自动加载数据
			$(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						pulldownRefresh(index, self);
					},
				}
			});
		});
	});
})(mui);