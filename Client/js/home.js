(function($) {
	//预加载详情页
	$.init({
		swipeBack: true, //关闭右滑关闭功能
		id: "index",
	});
	var ordertpl = {
		template: orderComponent,
		props: ['item'],
	};
	open_detail = function(oId) {
		var webview = mui.openWindow({
			url: 'detail.html?oId='+oId,
			id: 'detail',
		});
	}

	/*
	 *请求
	 * ate:0,1,2,3,4;类别0为推荐,暂时表示全部.
	 * 下拉刷新要cate size
	 * 上拉加载要minid cate size
	 * size:正常请求或下拉加载的请求订单条数;
	 * minid:返回第minid-size条,到第minid条
	 */
	var lastId = [0, 0, 0, 0, 0],
		minId = [0, 0, 0, 0, 0];
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	window.orders = [
		new Vue({
			el: '#list1',
			data: {
				items: [{
					uId: NaN,
					userName: "加载中..",
					title: "加载中..",
					price: NaN,
					oFrom: "加载中..",
					oTo: "加载中..",
					oId: NaN,
					deadline: NaN,
					dateTime: NaN,
				}, ]
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
	];
	$.ready(function() {

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
					dateTime: app.dateUtils.format(item.dateTime),
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
				cate: index,
				size: 5,
			};
			//	var ul = self.element.querySelector('.mui-table-view');
			//ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
			$.ajax(hostUrl + "index.php", {
				data: data,
				dataType: 'json',
				type: 'get',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 60000,
				success: function(list) {
					if(self) {
						self.endPullDownToRefresh();
					}
					if(list && list.length > 0) {
						if(lastId[index] == list[0].oId) {
							mui.toast("没有新的订单了哟~")
						} else {
							lastId[index] = list[0].oId;
							minId[index] = list[list.length - 1].oId;
							orders[index].items = convert(list);
						}
					}

				},
				error: function(xhr, type, errorThrown) {
					mui.toast("<网络连接出错,请重试>");
				}
			});

		};

		var pullUpToRefresh = function(index, self) {
			var data = {
				cate: index,
				size: 5,
			};
			if(minId[index] != 0) { //说明已有数据，目前处于上拉加载，传递当前minId 返回历史数据
				data.minId = minId[index];
			}
			$.ajax(hostUrl + "index.php", {
				data: data,
				dataType: 'json',
				type: 'get',
				contentType: "application/x-www-form-urlencoded; charset=utf-8",
				timeout: 10000,
				success: function(list) {
					self.endPullUpToRefresh(!list || list.length <= 0);
					if(list && list.length > 0) {
						minId[index] = list[list.length - 1].oId; //保存最后一条消息的id，上拉加载时使用
						orders[index].items = orders[index].items.concat(convert(list));
					} else {
						mui.toast("没有更多订单了哟~");
					}

				},
				error: function(xhr, type, errorThrown) {
					mui.toast("<网络连接出错,请重试>");
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
					contentdown: '暂时没有更多订单了呢~',
					contentnomore: '没有更多订单了',
					callback: function() {
						var self = this;
						pullUpToRefresh(index, self);
					}

				}
			});
		});
	});
})(mui);