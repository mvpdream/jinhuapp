var pageUrl = window.location.pathname;
pageUrl = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.length);
/**
 *贴吧主页 
 */
if(pageUrl == 'post.html') {
	//var currPageIndex = 0;
	var clientWidth = document.body.clientWidth;

	// 添加子页面
	function addSubPages() {

		var self = plus.webview.currentWebview();

		for(var i = 0; i < 1; i++) {
			var tempPage = plus.webview.create(subPages[i], subPages[i], subPagesStyle);
			if(i > 0) {
				tempPage.hide();
			}
			self.append(tempPage);
		}

	}

	/*浏览器的兼容处理方法*/
	var createIframe = function(el, opt) {
		var elContainer = document.querySelector(el);
		var wrapper = document.querySelector(".mui-iframe-wrapper");
		if(!wrapper) {
			// 创建wrapper 和 iframe
			wrapper = document.createElement('div');
			wrapper.className = 'mui-iframe-wrapper';
			for(var i in opt.style) {
				wrapper.style[i] = opt.style[i];
			}
			var iframe = document.createElement('iframe');
			iframe.src = opt.url;
			iframe.id = opt.id || opt.url;
			iframe.name = opt.id;
			wrapper.appendChild(iframe);
			elContainer.appendChild(wrapper);
		} else {
			var iframe = wrapper.querySelector('iframe');
			iframe.src = opt.url;
			iframe.id = opt.id || opt.url;
			iframe.name = iframe.id;
		}
	}

	var subpages = ["postList.html",
		"recommendpostList.html",
		"enterPost.html"
	];
	var subpage_style = {
		top: "91px",
		bottom: "0px"
	};
	var aniShow = {};
	// 当前激活选项
	var activeTab = subpages[0];
	var title = document.getElementById("title");
	if(mui.os.plus) {
		window.addEventListener('show', function(event) {
			// 创建子页面，首个选项卡页面显示，其它均隐藏；
			mui.plusReady(function() {
				//获得事件参数
				var self = plus.webview.currentWebview();
				for(var i = 0; i < 4; i++) {
					var temp = {};
					var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
					if(i > 0) {
						sub.hide();

					} else {
						temp[subpages[i]] = "true";
						mui.extend(aniShow, temp);
					}
					self.append(sub);
				}
			});
		})

	} else {
		// 创建iframe代替子页面
		createIframe('.mui-content', {
			url: activeTab,
			style: subpage_style
		});
	}
	var recommendPost = false;
	var enterPost = false;
	// 选项卡点击事件
	mui('.mui-scroll').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		setlsData('postTab',targetTab)
		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		if(mui.os.plus) {
			var waiting = showWaiting();
			var detailPage = plus.webview.getWebviewById(targetTab);
			closeWaiting(waiting);
			if(detailPage.id == "recommendpostList.html" && !recommendPost) {
				mui.fire(detailPage, 'show', {
					show: true
				})
				recommendPost = true;
			} else if(detailPage.id == "enterPost.html" && !enterPost) {
				mui.fire(detailPage, 'show', {
					show: true
				})
				enterPost = true;
			}
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab);
			} else {
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab, "fade-in", 300);
			}
			//隐藏当前;
			plus.webview.hide(activeTab);
		} else {
			// 创建iframe代替子页面
			createIframe('.mui-content', {
				url: targetTab,
				style: subpage_style
			});
		}
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
		if(defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});
	window.addEventListener('touchstart', function(e) {
		e.preventDefault();
	});
	window.addEventListener('touchmove', function(e) {
		e.preventDefault();
	});
	document.getElementById("search").addEventListener('tap', function() {
		mui.openWindow({
			url: 'search.html?type=post',
			id: 'search.html',
			waiting: {
				options: {
					loading: {
						height: '35px'
					}
				}
			},

		})
	})

	function changeTab(index) {
		var gallery = mui('#sliderSegmentedControl');
		gallery.scroll().gotoPage(index); //跳转到第index张图片，index从0开始；
		mui.trigger(document.getElementById("recommendpostList"), 'tap');
	}
	if(!mui.os.plus){
		var pId=getlsData('postTab');
		switch (pId){
			case 'postList.html':
				changeTab(0)
				break;
			case 'recommendpostList.html':
				changeTab(1)
				break;
			case 'enterPost.html':
				changeTab(2)
				break;
			default:
				changeTab(0)
				break;
		}
		setlsData('postTab','')
	}
}
/**
 *最新的帖子列表 
 */
var newPosts = {
	init: function() {
		(function($) {
			$(document).imageLazyload({
				placeholder: '../images/5-121204193R5-50.gif'
			});
		})(mui);

		var _this = this;

		function login() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				getCode(currUrl)
			} else {
				mui.openWindow({
					url: 'user_login.html',
					id: 'user_login.html',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			}

		}
		window.onload = function() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		var creatimgFragment = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ("<div class='mui-col-xs-4'><img style='width:100px;height:100px' src='" + getImgUrl(data[i].Url) + "' title='" + data[i].FileName + "' alt='" + data[i].FileName + "' /></div>");
				bigContainers += itemContainer;
			}
			return bigContainers;

		}
		var createFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			for(var i = 0; i < data.Data.length; i++) {
				var dis = 'none';
				if(data.Data[i].Attachments && data.Data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatimgFragment(data.Data[i].Attachments)
				} else {
					dis = 'none';
				}
				var userAvatar = data.Data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data.Data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data.Data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data.Data[i].Author + '</li>' +
					'											<li>' + data.Data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data.Data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data.Data[i].CommentCount + '</i></li>' +
					'</div>';

				fragment.appendChild(li);
			}
			return fragment;
		};
		var page = 1;

		function loadData(type, isSpecial) {
			var table = document.body.querySelector('.mui-table-view');
			switch(type) {
				case 0:
					{
						page = 1;
					}
					break;
				case 1:
					{
						page = 1;
					}
					break;
				case 2:
					{
						page++;
					}
					break;
				default:
					break;
			}
			params = {
				isSpecial: isSpecial,
				pageIndex: page,
			}
			if(type == 0) {
				showLoading('', '', '#ffffff');
				document.getElementById("sloading").style.margin = '55% auto'
			}
			getData('Post/GetThreads', params, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', 'refreshContainer');
						if(data.Data.length <= 5) {
							mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
						}
						switch(type) {
							case 0:
								{
									table.innerHTML = "";
									table.appendChild(createFragment(data));
								}
								break;
							case 1:
								{
									table.innerHTML = "";
									table.appendChild(createFragment(data));
								}
								break;
							case 2:
								{
									table.appendChild(createFragment(data));
								}
								break;
							default:
								break;
						}
					} else {
						mui.toast(data.Data);
						if(type != 2) {
							var errForList = showErrForList(data.Data, '', '', 'refreshContainer');
							if(errForList) {
								document.getElementById("refreshContainer").appendChild(showErrForList(data.Data, '', '', 'refreshContainer'))
							}
						}
						mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh(true);
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					var errForList = showErrForList(data.Data, '', '', 'refreshContainer');
					if(errForList) {
						document.getElementById("refreshContainer").appendChild(showErrForList(data.Data, '', '', 'refreshContainer'))
					}
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading();
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF');
					hideLoading()
				}
			})

		}
		mui.plusReady(function() {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html',
					show: {
						autoShow: false
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						threadId: threadId,
						currId: 'postList.html'
					}
				})

			})
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html'
				});
			})
		}

		loadData(0, false)

		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 100, //可选,默认50.触发下拉刷新拖动距离,
					auto: false, //可选,默认false.自动下拉刷新一次
					contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					contentrefresh: "正在刷新数据...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
					callback: downFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				},
				up: {
					height: 50, //可选.默认50.触发上拉加载拖动距离
					auto: false, //可选,默认false.自动上拉加载一次
					contentrefresh: "正在加载数据...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
					callback: upFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		});

		function downFresh() {
			setTimeout(function() {
				loadData(1, false)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, false)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 *推荐的帖子列表 
 */
var recommendPosts = {
	init: function() {

		(function($) {
			$(document).imageLazyload({
				placeholder: '../images/5-121204193R5-50.gif'
			});
		})(mui);

		function login() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				getCode(currUrl)
			} else {
				mui.openWindow({
					url: 'user_login.html',
					id: 'user_login.html',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			}

		}
		window.onload = function() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		var _this = this;
		var creatimgFragment = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ("<div class='mui-col-xs-4'><img style='width:100px;height:100px' src='" + getImgUrl(data[i].Url) + "' title='" + data[i].FileName + "' alt='" + data[i].FileName + "' /></div>");
				bigContainers += itemContainer;
			}
			return bigContainers;

		}
		var createFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			var userAvatar = '';
			for(var i = 0; i < data.Data.length; i++) {
				var dis = 'none';
				if(data.Data[i].Attachments && data.Data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatimgFragment(data.Data[i].Attachments)
				} else {
					dis = 'none';
				}
				userAvatar = data.Data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data.Data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data.Data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data.Data[i].Author + '</li>' +
					'											<li>' + data.Data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data.Data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data.Data[i].CommentCount + '</i></li>' +
					'</div>';
				fragment.appendChild(li);
			}
			return fragment;
		};

		var page = 1;

		function loadData(type, isSpecial) {
			var table = document.body.querySelector('.mui-table-view');
			switch(type) {
				case 0:
					{
						page = 1;
					}
					break;
				case 1:
					{
						page = 1;
					}
					break;
				case 2:
					{
						page++;
					}
					break;
				default:
					break;
			}
			params = {
				isSpecial: isSpecial,
				pageIndex: page,
			}
			var _this = this;
			if(type == 0) {
				showLoading('', '', '#FFFFFF');
				document.getElementById("sloading").style.margin = '55% auto'
			}
			getData('Post/GetThreads', params, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', 'refreshContainer');
						if(data.Data.length <= 5) {
							mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
						}
						switch(type) {
							case 0:
								{
									table.innerHTML = "";
									table.appendChild(createFragment(data));
								}
								break;
							case 1:
								{
									table.innerHTML = "";
									table.appendChild(createFragment(data));
									mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
								}
								break;
							case 2:
								{
									table.appendChild(createFragment(data));

								}
								break;
							default:
								break;
						}
					} else {
						mui.toast(data.Data);
						if(type != 2) {
							var errForList = showErrForList(data.Data, '', '', 'refreshContainer');
							if(errForList) {
								document.getElementById("refreshContainer").appendChild(showErrForList(data.Data, '', '', 'refreshContainer'))
							}
						}
						mui('#refreshContainer').pullRefresh().disablePullupToRefresh();
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh(true);
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					var errForList = showErrForList(data.Data, '', '', 'refreshContainer');
					if(errForList) {
						document.getElementById("refreshContainer").appendChild(showErrForList(data.Data, '', '', 'refreshContainer'))
					}
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF');
					hideLoading()
				}
			})

		}
		if(mui.os.plus) {
			window.addEventListener('show', function(event) {
				loadData(0, true)
			})
		} else {
			loadData(0, true)
		}

		mui.plusReady(function() {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html',
					show: {
						autoShow: false
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						threadId: threadId,
						currId: 'recommendpostList.html'
					}
				})

			})
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html'
				});
			})
		}

		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 100, //可选,默认50.触发下拉刷新拖动距离,
					auto: false, //可选,默认false.自动下拉刷新一次
					contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
					contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
					contentrefresh: "正在刷新数据...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
					callback: downFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				},
				up: {
					height: 50, //可选.默认50.触发上拉加载拖动距离
					auto: false, //可选,默认false.自动上拉加载一次
					contentrefresh: "正在加载数据...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
					contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
					callback: upFresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		});

		function downFresh() {
			setTimeout(function() {
				loadData(1, true)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, true)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 *进贴吧 
 */
if(pageUrl == 'enterPost.html') {}
/**
 *帖子详情 
 */
var threadDetail = {
	init: function() {
		if(!mui.os.plus) {
			creatBanner();
		}
		showLoading('', '', '#FFFFFF', '50px');
		mui.init();
		if(!mui.os.wechat) {
			mui.previewImage();
		}
		if(mui.os.wechat) {
			initWx();
			wx.ready(function() {
				wx.checkJsApi({
					jsApiList: ['previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					success: function(res) {
						// 以键值对的形式返回，可用的api值true，不可用为false
						// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					}
				});
			});
			wx.error(function(res) {

			});
		}
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.querySelector('.jh-detail-content').style.minHeight = height + 'px';
		var SectionName = document.getElementById("SectionName");
		var threadType = document.getElementById("threadType");
		var threadTitle = document.getElementById("threadTitle");
		var Author = document.getElementById("Author");
		var DateCreated = document.getElementById("DateCreated");
		var CategoryName = document.getElementById("CategoryName");
		var EssentialOperation = document.getElementById("EssentialOperation"); //精华
		var StickyOperation = document.getElementById("StickyOperation"); //置顶
		var DeleteThread = document.getElementById("DeleteThread"); //删除
		var commentArea = document.getElementById("commentArea");
		var post_detail = document.getElementById("post_detail");
		var userAvator = document.getElementById("userAvator");
		var attachments = document.getElementById("attachments");
		var threadOpt = document.getElementById("threadOpt");
		var userid = 0;

		var uip = document.getElementById("popover"); //topPopover是popover 的最外层div
		uip.style.position = "absolute";
		var islog = getlsData('isLogin');
		threadOpt.style.display = (islog == 'true') ? 'inherit' : 'none';

		var wximgEl = document.createElement("div");

		function login() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				getCode(currUrl)
			} else {
				mui.openWindow({
					url: 'user_login.html',
					id: 'user_login.html',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			}

		}
		var threadId;
		var currId = "";
		//B页面onload从服务器获取列表数据；
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					threadId = self.threadId;
					currId = self.currId;
					getDetail(threadId)
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				threadId = getUrlParam('threadId');
				getDetail(threadId)
			}
			if(!mui.os.plus) {
				initOpenApp('threadDetail', threadId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
		if(mui.os.wechat) {
			mui("#post_detail").on('tap', 'img', function(e) {
				var imgUrl = e.detail.target.currentSrc;
				var imgs = [];
				var imgels = wximgEl.querySelectorAll('img');
				for(var i = 0; i < imgels.length; i++) {
					imgs.push(imgels[i].src)
				}
				wx.previewImage({
					current: imgUrl,
					urls: imgs
				});
			})
		}
		userAvator.addEventListener('tap', function() {
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid
				}
			})
		})

		mui("#commentArea").on('tap', '.creator_img_comment', function(e) {
			var userid = this.getAttribute('id');
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid
				}
			})

		})

		var creatAttachment = function(data) {
			var fragment = document.createDocumentFragment();
			var div;
			for(var i = 0; i < data.length; i++) {
				var filename = data[i].FriendlyFileName;
				var type = filename.substring(filename.lastIndexOf('.') + 1);
				var typeIcon = '';
				var downloadUrl = '';
				switch(type) {
					case "wps":
					case "doc":
					case "docx":
						typeIcon = '<span class=" fa fa-file-word-o tn-blue-color"></span>';
						break;
					case "pps":
					case "pptx":
					case "ppt":
						typeIcon = '<span class="fa  fa-file-powerpoint-o tn-yellow-color"></span>';
						break;
					case "xls":
					case "xlsx":
						typeIcon = '<span class="fa  fa-file-excel-o tn-green-color"></span>';
						break;
					case "pdf":
						typeIcon = '<span class="fa  fa-file-pdf-o tn-green-color"></span>';
						break;
					case "txt":
						typeIcon = '<span class="fa  fa-file-text-o tn-green-color"></span>';
						break;
					case "jpg":
					case "png":
					case "bmp":
					case "gif":
						typeIcon = '<span class="fa  fa-file-image-o tn-green-color"></span>';
						break;
					case "flv":
					case "rmvb":
					case "mp4":
					case "3gp":
					case "mpeg":
					case "wmv":
					case "mov":
					case "avi":
					case "asf":
						typeIcon = '<span class="fa  fa-file-video-o tn-blue-color"></span>';
						break;
					case "zip":
					case "rar":
						typeIcon = '<span class="fa  fa-file-zip-o tn-red-color"></span>';
						break;
					case "mp3":
					case "wav":
					case "rm":
						typeIcon = '<span class="fa  fa-file-audio-o tn-red-color"></span>';
						break;
					default:
						typeIcon = '<span class="fa  fa-file-o tn-black-color"></span>'
						break;
				}

				div = document.createElement('div');
				div.className = 'mui-row';
				div.innerHTML = '<div class="mui-col-xs-1">' +
					''+typeIcon+''+
					'</div>' +
					'<div class="mui-col-xs-7 mui-ellipsis">' + data[i].FriendlyFileName.substring(0, 15) + '</div>' +
					'<div class="mui-col-xs-2 text-muted mui-text-right">' + data[i].Size + '</div>' +
					'<div class="mui-col-xs-2 mui-text-right">' +
					'<a id=' + data[i].Url + ' title=' + data[i].FriendlyFileName + '>下载</a>' +
					'</div>';
				fragment.appendChild(div);
			}
			return fragment;
		};
		mui("#attachments").on('tap', 'a', function(e) {
			if(mui.os.plus) {
				startDownloadTask(this.getAttribute('id'))
			} else {
				download(this.getAttribute('id'), this.getAttribute('title'), location.href.split('#')[0])
			}

		})
		threadOpt.addEventListener('tap', function() {
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				mui('#popover').popover('toggle');
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}

		})

		function essentialOperation(id) {
			showLoading();
			postDatawithToken('Post/EssentialOperation?threadId=' + id, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					setTimeout(function() {
						mui.back();
					}, 500)
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						document.getElementById("loadmsgtext").innerHTML = '没有网络连接'
					} else {
						mui.toast("错误代码：" + err);
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					mui.toast("错误代码：" + err);
					hideLoading()
				}
			})
		}

		function stickyOperation(id) {
			showLoading();
			postDatawithToken('Post/StickyOperation?threadId=' + id, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					setTimeout(function() {
						mui.back();
					}, 500)
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						document.getElementById("loadmsgtext").innerHTML = '没有网络连接'
					} else {
						mui.toast("错误代码：" + err);
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					mui.toast("错误代码：" + err);
					hideLoading()
				}
			})
		}

		function deleteThread(id) {
			showLoading();
			postDatawithToken('Post/DeleteThread?threadId=' + id, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						mui('#popover').popover('hide');
						var wobj = plus.webview.getWebviewById(currId);
						wobj.reload(true);
						setTimeout(function() {
							mui.back();
						}, 500)
					} else {
						mui.back();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						document.getElementById("loadmsgtext").innerHTML = '没有网络连接'
					} else {
						mui.toast("错误代码：" + err);
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					mui.toast("错误代码：" + err);
					hideLoading()
				}
			})
		}
		var isFavorited = false;

		function getDetail(id) {
			showLoading('', '', '#FFFFFF', '50px');
			getDatawithToken('Post/ThreadDetail', {
				threadId: id
			}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						var data = data.Data;
						setIdandType(threadId, 'Thread', data.CommentCount)
						ii = data.Comments.length;
						userid = data.UserId;
						userAvator.src = data.Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Avatar);
						post_detail.innerHTML = '';
						post_detail.innerHTML = getBodyImgUrl(data.Body);
						wximgEl.innerHTML = data.Body;
						SectionName.innerHTML = data.SectionName.substring(0, 15);
						SectionName.id = data.SectionId;
						var threadType = "";
						if(data.IsSpecial) {
							//精华
							EssentialOperation.innerHTML = '<a><i class="fa fa-star-o" aria-hidden="true"></i>&nbsp;&nbsp取消加精</a>'
						} else {
							//非精华
							EssentialOperation.innerHTML = '<a><i class="fa fa-star" aria-hidden="true"></i>&nbsp;&nbsp加精</a>'
						}
						if(data.IsSticky) {
							//置顶
							threadType = '置顶 ·  ';
							StickyOperation.innerHTML = '<a><i class="fa fa-chevron-down" aria-hidden="true"></i>&nbsp;&nbsp取消置顶</a>';
						} else {
							//非置顶
							StickyOperation.innerHTML = '<a><i class="fa fa-chevron-up" aria-hidden="true"></i>&nbsp;&nbsp置顶</a>';
						}
						threadTitle.innerHTML = '<span id="threadType" class="theme-color">' + threadType + '</span>' + data.Subject;
						Author.innerText = data.Author;
						DateCreated.innerText = data.DateCreated;
						if(data.CategoryName.length > 0) {
							CategoryName.innerHTML = '<i class="fa fa-list-ul" aria-hidden="true">&nbsp;' + data.CategoryName + '</i>'
						}
						if(data.Comments && data.Comments.length < 5) {
							morecomment.style.display = 'none';
						} else {
							morecomment.style.display = 'block';
						}
						if(data.Attachments && data.Attachments.length > 0) {
							attachments.style.display = 'block';
							attachments.appendChild(creatAttachment(data.Attachments));
						} else {
							attachments.style.display = 'none';
						}
						commentArea.appendChild(createComFragment(data.Comments));
						setShareInfo(getlsData('currUrl'), data.Subject, data.Subject);
						com.isFavorited = data.IsFavorited;
						favorThread(data.IsFavorited);
						EssentialOperation.style.display = (data.IsManage) ? 'inherit' : 'none';
						StickyOperation.style.display = (data.IsManage) ? 'inherit' : 'none';
						DeleteThread.style.display = (data.CanDelete) ? 'inherit' : 'none';
						if(!data.IsManage && !data.CanDelete) {
							threadOpt.style.display = 'none';
						}
					} else {
						threadOpt.style.display = 'none';
						showErr(data.Data, '', '#FFFFFF', '50px')
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					threadOpt.style.display = 'none';
					showErr(data.Data, '', '#FFFFFF', '50px')
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '50px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '50px')
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '50px')
					hideLoading()
				}
			})
		}

		mui(".mui-list-unstyled").on('tap', 'li', function(e) {
			if(mui.os.plus) {
				mui('#popover').popover('toggle');
			}
			switch(this.getAttribute('id')) {
				case "EssentialOperation":
					//加精or取消加精
					essentialOperation(threadId)
					break;
				case "StickyOperation":
					//置顶or取消置顶
					stickyOperation(threadId)
					break;
				case "DeleteThread":
					//删除
					mui('#popover').popover('toggle');
					var btnArray = ['取消', '确定'];
					mui.confirm('确认删除？', '贴子', btnArray, function(e) {
						if(e.index == 1) {
							deleteThread(threadId)
						}
					});
					break;
				default:
					break;
			}

		})
		SectionName.addEventListener('tap', function() {
			var sectionId = this.getAttribute("id");
			var baseUrl = 'postDetail.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?sectionId=' + sectionId;
			mui.openWindow({
				url: url,
				id: 'postDetail.html',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					sectionId: sectionId
				}
			})

		})
		var old_back = mui.back;
		mui.back=function(){
			if(!mui.os.plus){
				if(history.length==1){
					history.replaceState(null, "", "../index.html");
					window.location.reload()
				}else{
					history.back(-1)
				}
			}else{
				old_back();
			}
		}

	}
	
}
/**
 *贴吧资料 
 */
var postIntroduce = {
	init: function() {
		var Name = document.getElementById("Name");
		var CategoryName = document.getElementById("CategoryName");
		var Description = document.getElementById("Description");
		var favoritedBtn = document.getElementById("favoritedBtn");
		var featuredImage = document.getElementById("featuredImage");

		function login() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				getCode(currUrl)
			} else {
				mui.openWindow({
					url: 'user_login.html',
					id: 'user_login.html',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			}

		}

		function creatFragment(data) {
			var fragment = document.getElementById('Managers');
			var div;
			for(var i = 0; i < data.Data.Managers.length; i++) {
				var userAvatar = data.Data.Managers[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data.Managers[i].Avatar);
				div = document.createElement('div');
				div.className = 'mui-col-xs-3';
				div.innerHTML = '<img id=' + data.Data.Managers[i].UserId + ' class="user_administer" src=' + userAvatar + '><p>' + data.Data.Managers[i].UserName + '</p>';
				fragment.appendChild(div)
			}
		}

		function getDetail(id) {
			showLoading();
			getDatawithToken('Post/SectionDetail', {
				sectionId: id
			}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					Name.innerText = data.Data.Name;
					featuredImage.src = getImgUrl(data.Data.FeaturedImage);
					CategoryName.innerText = data.Data.CategoryName;
					Description.innerText = data.Data.Description;
					var isFavorited = data.Data.IsFavorited;
					favoritedBtn.innerText = isFavorited ? "取消关注" : "+  关注";
					creatFragment(data)
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					showErr(data.Data, '', '#FFFFFF', '50px');
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '50px');
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '50px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}
		var sectionId;
		//B页面onload从服务器获取列表数据；
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					sectionId = self.sectionId;
					getDetail(sectionId)
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				sectionId = getUrlParam('sectionId');
				getDetail(sectionId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
		mui("#Managers").on('tap', 'img', function(e) {
			var userid = this.getAttribute("id");
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage.html',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid
				}
			})

		})
		favoritedBtn.addEventListener('tap', function() {
			showLoading()
			postDatawithToken('Post/BarFavoriteOperation?sectionId=' + sectionId, {}, function(data) {
				hideLoading()
				if(data.Type == 1) {
					mui.toast(data.Data.Msg);
					favoritedBtn.innerText = data.Data.Type == 1 ? "取消关注" : "+  关注";
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading()
			})
		})
	}
}
/**
 *贴吧详情 
 */
if(pageUrl=='postDetail.html'){
	
		var Name = document.getElementById("Name");
		var UserCount = document.getElementById("UserCount");
		var ThreadCount = document.getElementById("ThreadCount");
		var detailBtn = document.getElementById("detailBtn");
		var favoritedBtn = document.getElementById("favoritedBtn");
		var Sticky = document.getElementById("Sticky");
		var searchBtn = document.getElementById("searchBtn");
		var nomItem = document.getElementById("sliderSegmentedControl");
		var serItem = document.getElementById("searchSegmentedControl");
		var sliderGroup = document.getElementById("sliderGroup");
		var searchGroup = document.getElementById("searchGroup");
		var searchMobile = document.getElementById("searchMobile");
		var closeSearch = document.getElementById("closeSearch");
		var searchInput = document.getElementById("searchInput");
		var searchMsg = document.getElementById("searchMsg");
		var slider = document.getElementById("slider");
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		var featuredImage = document.getElementById("featuredImage")
		var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');

		var postUserCount = 0;
		var serPage = 1;
		var start;
		var end;

		$(document).ready(function() {
			$(window).scroll(function() {
				var top = 50; //获取指定位置
				var scrollTop = $(window).scrollTop(); //获取当前滑动位置
				if(scrollTop > top) { //滑动到该位置时执行代码
					document.querySelector('.mui-action-back').style.color = '#000000';
					document.querySelector('#setting_btn').style.color = '#000000';
				} else {
					document.querySelector('.mui-action-back').style.color = '#FFFFFF';
					document.querySelector('#setting_btn').style.color = '#FFFFFF';
				}
			});
		});
		
		function login() {
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				getCode(currUrl)
			} else {
				mui.openWindow({
					url: 'user_login.html',
					id: 'user_login.html',
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			}

		}

		function enterSearch(e) {
			if(e.keyCode == 13) {
				searchInput.blur();
				var keyword = TrimAll(searchInput.value);
				if(keyword.length != 0) {
					var date = new Date();
					start = date.getMilliseconds();
					GetThreads(sectionId, false, 10, false, keyword)
				}
			}
		}
		searchBtn.addEventListener('tap', function() {
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			nomItem.style.display = 'none';
			serItem.style.display = 'block';
			sliderGroup.style.display = 'none';
			searchGroup.style.display = 'block';
			if(bottomTip[bottomTip.length - 1]) {
				bottomTip[bottomTip.length - 1].style.display = 'none'
			}

		})
		closeSearch.addEventListener('tap', function() {
			nomItem.style.display = 'block';
			serItem.style.display = 'none';
			sliderGroup.style.display = 'block';
			searchGroup.style.display = 'none';
		})

		function getDetail(id) {
			if(id == null) {
				return
			}
			showLoading();
			getDatawithToken('Post/SectionDetail', {
				sectionId: id
			}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					featuredImage.src = getImgUrl(data.Data.FeaturedImage);
					Name.innerText = data.Data.Name.substring(0, 15);
					UserCount.innerText = "用户：" + data.Data.UserCount;
					postUserCount = data.Data.UserCount;
					ThreadCount.innerText = "贴子：" + data.Data.ThreadCount;
					var isFavorited = data.Data.IsFavorited;

					favoritedBtn.innerText = isFavorited ? "取消关注" : "+  关注";
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					showErr(data.Data, '', '#FFFFFF', '50px');
					document.getElementById("setting_btn").style.display = 'none';
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						document.getElementById("loadmsgtext").innerHTML = '没有网络连接'
					} else {
						mui.toast("错误代码：" + err);
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					mui.toast("错误代码：" + err);
					hideLoading()
				}
			})
		}
		var sectionId;
		//B页面onload从服务器获取列表数据；
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					sectionId = self.sectionId;
					getDetail(sectionId)
					GetThreads(sectionId, true, 3, false, "")
					GetThreads(sectionId, false, 10, false, "");
					slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				sectionId = getUrlParam('sectionId');
				getDetail(sectionId)
				GetThreads(sectionId, true, 3, false, "")
				GetThreads(sectionId, false, 10, false, "");
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
			slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';

		}
		document.getElementById("setting_btn").addEventListener('tap', function() {
			var islog = getlsData('isLogin');
			if(islog == 'true') {
				var baseUrl = 'creatThread.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?sectionId=' + sectionId;
				mui.openWindow({
					url: url,
					id: 'creatThread.html',
					show: {
						autoShow: false
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						sectionId: sectionId
					}
				})
			} else {
				mui.toast('请登录后再进行操作');
				login();
			}

		})
		detailBtn.addEventListener('tap', function() {
			var baseUrl = 'postIntroduce.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?sectionId=' + sectionId;
			mui.openWindow({
				url: url,
				id: 'postIntroduce',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					sectionId: sectionId
				}
			})
		})
		favoritedBtn.addEventListener('tap', function() {
			postDatawithToken('Post/BarFavoriteOperation?sectionId=' + sectionId, {}, function(data) {
				if(data.Type == 1) {
					mui.toast(data.Data.Msg);
					if(data.Data.Msg == '关注成功') {
						UserCount.innerText = "用户：" + (postUserCount + 1);
						postUserCount = postUserCount + 1;
						favoritedBtn.innerText = '取消关注';
						document.getElementById("setting_btn").style.display = 'block';
					} else {
						UserCount.innerText = "用户：" + (postUserCount - 1);
						postUserCount = postUserCount - 1;
						favoritedBtn.innerText = '关注';
						document.getElementById("setting_btn").style.display = 'none';
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
			})
		})

		function creatStickyFragment(data) {
			/**
			 * 置顶的贴子
			 */
			var fragment = document.getElementById('Sticky');
			var div;
			for(var i = 0; i < data.Data.length; i++) {
				div = document.createElement('div');
				div.className = 'jh-overflow-h';
				div.innerHTML = '<small class="jh-red-top">置顶</small><span>' + data.Data[i].Subject.substring(0, 15) + '</span>';
				div.id = data.Data[i].ThreadId;
				fragment.appendChild(div)
			}
			slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
		}
		var creatimgFragment = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ("<div class='mui-col-xs-4'><img style='width:100px;height:100px' src='" + getImgUrl(data[i].Url) + "' title='" + data[i].FileName + "' alt='" + data[i].FileName + "' /></div>");
				bigContainers += itemContainer;
			}
			return bigContainers;
			slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
		}
		var createFragment = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(id == 'item1mobile') {
				finel.innerHTML = ''
			}
			var div;
			for(var i = 0; i < data.Data.length; i++) {
				var dis = 'none';
				if(data.Data[i].Attachments && data.Data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatimgFragment(data.Data[i].Attachments)
				} else {
					dis = 'none';
					child = ''
				}
				var userAvatar = data.Data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data.Data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data.Data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data.Data[i].Author + '</li>' +
					'											<li>' + data.Data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data.Data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data.Data[i].CommentCount + '</i></li>' +
					'</div>';
				finel.appendChild(li);

			}
			slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
		};

		mui.plusReady(function() {
			mui(".mui-table-view") && mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html',
					show: {
						autoShow: false
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						threadId: threadId,
						currId: 'postDetail.html'
					}
				})

			})
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html'
				});
			})
		}

		mui('#Sticky') && mui('#Sticky').on('tap', '.jh-overflow-h', function(e) {
			var threadId = this.getAttribute("id");
			var baseUrl = 'threadDetail.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
			var curl = shareUrl + baseUrl + '?threadId=' + threadId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'threadDetail.html',
				show: {
					autoShow: false
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					threadId: threadId,
					currId: "postDetail.html"
				}
			})
		})
		searchMsg.style.display = 'none';
		var page = 1;

		function GetThreads(sectionId, isSticky, pageSize, more, keyword, isSlider) {
			if(sectionId == null) {
				return
			}
			var idName = "";
			if(keyword.length > 0) {
				idName = "searchMobile";
			} else {
				idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			}
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = "";
				page = 1;
			}

			var params = {
				sectionId: sectionId,
				keyword: keyword,
				isSticky: isSticky,
				pageSize: pageSize,
				pageIndex: page
			};
			getData('Post/GetThreads', params, function(data) {
				//hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
				if(data.Type == 1) {
					var date = new Date();
					end = date.getMilliseconds();
					var usertime = (end - start) / 1000;
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						bottomTip[0].style.display = 'inherit';
						slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
						if(!more && data.Data.length < 5) {
							if(serItem.style.display == 'block' && keyword.length > 0) {
								if(bottomTip[bottomTip.length - 1]) {
									bottomTip[bottomTip.length - 1].style.display = 'none'
								}
							}
							if(bottomTip[0]) {
								bottomTip[0].style.display = 'none'
							}
						} else {
							if(serItem.style.display == 'block' && keyword.length > 0) {
								if(bottomTip[bottomTip.length - 1]) {
									bottomTip[bottomTip.length - 1].style.display = 'block'
								}
							}
							if(bottomTip[0]) {
								bottomTip[0].style.display = 'block'
							}
						}
						if(isSticky) {
							creatStickyFragment(data)
							slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
						} else if(keyword != "") {
							searchMsg.style.display = 'block';
							searchMsg.innerHTML = '约有 ' + data.Data.length + ' 个搜索结果（用时 ' + usertime + ' 秒）';
							var fragment = document.getElementById("searchMobile");
							var cfragment = fragment.firstElementChild;
							var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
							finel.innerHTML = "";
							createFragment(data, "searchMobile");
						} else {
							var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
							createFragment(data, idName);
						}

					} else {
						var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
						var fragment = document.getElementById(idName);
						if(isSticky && data.Data == '暂时没有贴子') {
							document.getElementById("Sticky").style.display = 'none';
							document.getElementById("Stickygb").style.display = 'none';
							slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';
						}
						if(keyword != "") {
							var fragment = document.getElementById("searchMobile");
							var cfragment = fragment.firstElementChild;
							var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
							finel.innerHTML = "";
							searchMsg.innerHTML = '约有 ' + 0 + ' 个搜索结果（用时 ' + usertime + ' 秒）';
						}
						if(!isSticky) {
							var height = document.documentElement.clientHeight || document.body.clientHeight;
							fragment.querySelector('.mui-scroll').style.minHeight = (height - (document.getElementById("pxtop").offsetTop + 10) - 40) + 'px'
							if(!more) {
								var errForList = showErrForList(data.Data, '', '50px', idName);
								if(errForList) {
									fragment.appendChild(showErrForList(data.Data, '', '50px', idName))
								}
							}
							bottomTip[0].style.display = 'none';
							mui.toast(data.Data);
						}
						
						slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';

					}
					slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';

				} else if(data.Type == 0) {
					//登录失败
					mui.toast(",请重新登录！");
					return;
				} else {
					//逻辑错误
					if(!more) {
						var errForList = showErrForList(data.Data, '', '50px', idName);
						if(errForList) {
							fragment.appendChild(showErrForList(data.Data, '', '50px', idName))
						}
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				//hideLoading()
			})
			setTimeout(function(){slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';},500)
			
		}
		var pageindex = 1;

		function GetEssentialThreads(sectionId, pageSize, more) {
			if(sectionId == null) {
				return
			}
			//精华贴子
			var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				pageindex++;
			} else {
				finel.innerHTML = '';
				pageindex = 1;
			}
			var params = {
				sectionId: sectionId,
				pageSize: pageSize,
				pageIndex: pageindex
			};
			getData('Post/GetEssentialThreads', params, function(data) {
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
				var fragment = document.getElementById(idName);
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						bottomTip[1].style.display = 'inherit';
						if(!more && data.Data.length < 5) {
							if(bottomTip[1]) {
								bottomTip[1].style.display = 'none'
							}
						} else {
							if(bottomTip[1]) {
								bottomTip[1].style.display = 'block'
							}

						}
						var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
						createFragment(data, idName);

					} else {
						var height = document.documentElement.clientHeight || document.body.clientHeight;
						fragment.querySelector('.mui-scroll').style.minHeight = (height - (document.getElementById("pxtop").offsetTop + 10) - 40) + 'px'
						mui.toast(data.Data);
						if(!more) {
							var errForList = showErrForList(data.Data, '', '50px', idName);
							if(errForList) {
								fragment.appendChild(showErrForList(data.Data, '', '50px', idName))
							}
						}
						bottomTip[1].style.display = 'none';
					}
					slider.style.top = (document.getElementById("pxtop").offsetTop + 10) + 'px';

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					if(!more) {
						var errForList = showErrForList(data.Data, '', '50px', idName);
						if(errForList) {
							fragment.appendChild(showErrForList(data.Data, '', '50px', idName))
						}
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				//hideLoading();
			})
		}


		/**
		 * tab切换
		 */
		(function($) {
			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});

			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
				var index = event.detail.slideNumber;
				if(event.detail.slideNumber == 0) {
					GetThreads(sectionId, false, 10, false, "", true);
				}
				if(event.detail.slideNumber != 0) {
					GetEssentialThreads(sectionId, 10, false)
				}

			})

			$.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
								setTimeout(function() {
									if(idName == "itemmobile") {
										GetThreads(sectionId, false, 10, false, "");
									} else if(idName == "item1mobile") {
										GetEssentialThreads(sectionId, 10, false)
									} else {
										GetThreads(sectionId, false, 10, false, searchInput.value);
									}
									self.endPullDownToRefresh();
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								var idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
								setTimeout(function() {
									if(idName == "itemmobile") {
										GetThreads(sectionId, false, 10, true, "");
									} else if(idName == "item1mobile") {
										GetEssentialThreads(sectionId, 10, true)
									} else {
										GetThreads(sectionId, false, 10, true, searchInput.value);
									}
									self.endPullUpToRefresh();
								}, 1000);
							}
						}
					});
				});

			});
		})(mui);
	
}

/**
 *创建帖子 
 */
if(pageUrl == 'creatThread.html') {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	if(!mui.os.wechat) {
		mui.previewImage();
	}
	creatloadingEL();
	if(mui.os.wechat) {
		initWx();
		wx.ready(function() {
			wx.checkJsApi({
				jsApiList: ['chooseImage', 'uploadImage', 'previewImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				success: function(res) {
					// 以键值对的形式返回，可用的api值true，不可用为false
					// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
				}
			});
		});
		wx.error(function(res) {

		});
	}
	var commenttextarea = document.getElementById("comment-textarea");
	var Category = document.getElementById("Category");
	var selectMenu = document.getElementById("selectMenu");
	var Categorytext = document.getElementById("Categorytext");
	var facePop = document.getElementById("facePop");
	var bottomBar = document.getElementById("bottomBar");
	var creatBtn = document.getElementById("creat_Btn");
	var plusimgArea = document.getElementById("imgPop");
	var imgArea = document.getElementById("demo");
	var files = [];
	var CategoryId = "";
	var hasThreadCategory;
	ZYFILE.url = Http_Url + '/Post/UploadFiles';
	var imgFiles = [];
	var wxIds = [];

	function login() {
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			getCode(currUrl)
		} else {
			mui.openWindow({
				url: 'user_login.html',
				id: 'user_login.html',
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
		}

	}
	window.onload = function() {
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}
//	if(mui.os.plus || mui.os.wechat) {
//		plusimgArea.style.display = 'block'
//		imgArea.style.display = 'none'
//	} else {
//		plusimgArea.style.display = 'none'
//		imgArea.style.display = 'block'
//	}

	// H5 plus事件处理
	function plusReady() {

	}
	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	//拍照 
	function getImage() {
		facePopover.style.display = 'none';
		bottomBar.style.marginBottom = '0px'
		if(mui.os.plus) {
			getImageforCreat();
		} else if(mui.os.wechat) {
			wxChooseImg(5, function(ids) {
				if(wxIds.length != 0) {
					for(var i = 0; i < ids.length; i++) {
						wxIds.push(ids[i])
					}
				} else {
					wxIds = ids;
				}
				for(var i = 0; i < ids.length; i++) {
					var a = new Date().getTime();
					imgFiles.push({
						name: "uploadkey" + a,
						path: ids[i]
					});
				}
				document.getElementById("imgs").innerHTML = "";
				document.getElementById("imgs").appendChild(creatImg(imgFiles))
			}, false, true)
		} else {
			document.getElementById("fileImage").click()
		}
	}

	function galleryImgsMaximum() {
		facePopover.style.display = 'none';
		bottomBar.style.marginBottom = '0px'
		if(mui.os.plus) {
			getImagesforCreat();
		} else if(mui.os.wechat) {
			wxChooseImg(5, function(ids) {
				if(wxIds.length != 0) {
					for(var i = 0; i < ids.length; i++) {
						wxIds.push(ids[i])
					}
				} else {
					wxIds = ids;
				}
				for(var i = 0; i < ids.length; i++) {
					var a = new Date().getTime();
					imgFiles.push({
						name: "uploadkey" + a,
						path: ids[i]
					});
				}
				document.getElementById("imgs").innerHTML = "";
				document.getElementById("imgs").appendChild(creatImg(imgFiles))
			}, true, false)
		} else {
			document.getElementById("fileImage").click()
		}

	}
	document.getElementById("comment-textarea").onfocus = function() {
		document.getElementById("bottomBox").style.display = 'inherit'
	}
	document.getElementById("comment-textarea").onblur = function() {
		//document.getElementById("bottomBox").style.display='none'
	}
	if(mui.os.wechat) {
		mui('#imgPop').on('tap', '.creat-img', function(e) {
			wx.previewImage({
				current: this.getAttribute('src'),
				urls: wxIds
			});
		})
	}

	function creatMenuel(data) {
		var fragment = document.createDocumentFragment();
		var li;
		for(var i = 0; i < data.length; i++) {
			li = document.createElement('li');
			li.className = "mui-table-view-cell";
			li.innerHTML = '<a id=' + data[i].Id + ' href="#">' + data[i].Name + '</a>'
			fragment.appendChild(li);
		}
		return fragment;
	}
	function creatWebImg(data) {
		var fragment = document.createDocumentFragment();
		var a;
		for(var i = 0; i < data.length; i++) {
			div = document.createElement('div');
			div.className = "mui-control-item";
			div.style.width = '150px';
			div.style.height = '200px';
			div.style.paddingTop = '10px';
			div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + data[i] + '"/><img class="closeIcon creat-img-close" src="../img/close.png"/>'
			fragment.appendChild(div);
		}
		return fragment;
	}
	function creatImg(data) {
		var fragment = document.createDocumentFragment();
		var a;
		for(var i = 0; i < data.length; i++) {
			div = document.createElement('div');
			div.className = "mui-control-item";
			div.style.width = '150px';
			div.style.height = '200px';
			div.style.paddingTop = '10px';
			div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + data[i].path + '"/><img class="closeIcon creat-img-close" src="../img/close.png" id="'+data[i].name+'"/>'
			fragment.appendChild(div);
		}
		return fragment;
	}
	mui("#imgs").on('tap', '.closeIcon', function(e) {
		var currImg = e.target.parentElement.querySelector('.creat-img').src;
		var files = jhUpload.files;
		if(!mui.os.plus&&!mui.os.wechat){
			files= zyUpload.webFiles;
		}
		if(mui.os.wechat) {
			files = imgFiles;
			var imageIds = [];
			var wxcurrImg = this.getAttribute('id');
			mui.each(files, function(index, item) {
				imageIds.push(item.name);
			})
			var index = imageIds.indexOf(wxcurrImg);
		} else if(!mui.os.plus&&!mui.os.wechat){
			var index = files && files.indexOf(currImg);
			ZYFILE.uploadFile.splice(index, 1);
		}
		else {
			var filepaths = [];
			mui.each(files, function(index, item) {
				filepaths.push(item.path);
			})
			var index = filepaths && filepaths.indexOf(currImg);
		}
		files.splice(index, 1);
		wxIds.splice(index, 1);
		document.getElementById("imgs").innerHTML = "";
		if(!mui.os.plus&&!mui.os.wechat){
			document.getElementById("imgs").appendChild(creatWebImg(files))
		}else{
			document.getElementById("imgs").appendChild(creatImg(files))
		}
		
	})

	var sectionId;
	var currid = "";
	files = [];
	//获取url中的targetId参数
	if(mui.os.plus) {
		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			sectionId = self.sectionId;
			currid = self.currId;
			getThreadCategory(sectionId)
			//关闭等待框
			plus.nativeUI.closeWaiting();
			//显示当前页面
			mui.currentWebview.show();
		});
	} else {
		sectionId = getUrlParam('sectionId');
		getThreadCategory(sectionId)
	}
	var pickdata = [];
	var picker = new mui.PopPicker();

	function getThreadCategory(id) {
		var waiting = showWaiting();
		getData('Post/GetThreadCategory', {
			sectionId: id
		}, function(data) {
			closeWaiting(waiting);
			if(data.Type == 1) {
				if(data.Data && data.Data.length != 0) {
					hasThreadCategory = true;
					for(var i = 0; i < data.Data.length; i++) {
						pickdata.push({
							value: data.Data[i].Id,
							text: data.Data[i].Name
						})
					}
					picker.setData(pickdata);
					selectMenu.appendChild(creatMenuel(data.Data))
				} else {
					hasThreadCategory = false;
					document.getElementById("postCategory").style.display = 'none';
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(err) {
			closeWaiting(waiting);
		})
	}

	Category.addEventListener('tap', function() {
		picker.show(function(selectItems) {
			CategoryId = selectItems[0].value;
			Categorytext.innerHTML = selectItems[0].text;
		})
	})
	commenttextarea.addEventListener('focus', function() {
		facePopover.style.display = 'none';
		bottomBar.style.marginBottom = '0px'
	})
	creatBtn.addEventListener('tap', function() {
		upload()
	})
	mui.getJSON('../js/faces.json', function(data) {
		var facetest1 = document.getElementById("facetest1");
		var facetest2 = document.getElementById("facetest2");
		var facetest3 = document.getElementById("facetest3");
		var img;
		var data = data.Category.Emotion;
		for(var i = 1; i < data.length; i++) {
			img = document.createElement('img');
			img.src = '../img/Emotions/default/' + i + '.gif';
			img.id = data[i - 1]['-code'];
			img.className = 'face';
			if(i < 37) {
				facetest1.appendChild(img)
			}
			if(i > 37 && i < 74) {
				facetest2.appendChild(img)
			}
			if(i > 74 && i < data.length) {
				facetest3.appendChild(img)
			}
		}

	})
	mui("#facetest1").on('tap', 'img', function(e) {
		var oldValue = commenttextarea.value;
		commenttextarea.value = oldValue + '[' + e.target.id + ']';
	})
	mui("#facetest2").on('tap', 'img', function(e) {
		var oldValue = commenttextarea.value;
		commenttextarea.value = oldValue + '[' + e.target.id + ']';
	})
	mui("#facetest3").on('tap', 'img', function(e) {
		var oldValue = commenttextarea.value;
		commenttextarea.value = oldValue + '[' + e.target.id + ']';
	})

	function CreateThread(title, body, attachmentIds) {
		var params = {
			SectionId: sectionId,
			Subject: title,
			Body: body,
			CategoryId: !hasThreadCategory ? 0 : CategoryId,
			AttachmentIds: attachmentIds
		};
		var waitings = showWaiting();
		postDatawithToken('Post/CreateThread', params, function(data) {
			closeWaiting(waitings);
			mui('#creat_Btn').button('reset');
			if(data.Type == 1) {
				mui.toast(data.Data);
				if(mui.os.plus) {
					var wobj = plus.webview.getWebviewById("postDetail.html");
					wobj.reload(true);
					setTimeout(function() {
						mui.back();
					}, 1000)
				} else {
					window.history.go(-1); //返回上一页
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(data) {
			mui('#creat_Btn').button('reset');
			closeWaiting(waitings);
		});
	}

	var title = "";
	var body = "";
	var newListTouch = [];
	// 上传文件
	function upload() {
		if(hasThreadCategory && CategoryId == "") {
			mui.toast("请选择贴子分类")
			return
		}
		title = TrimAll(document.getElementById("title").value);
		body = TrimAll(commenttextarea.value);
		if(title == "") {
			mui.toast("贴子标题不能为空")
			return
		}
		if(body == "") {
			mui.toast("贴子内容不能为空")
			return
		}
		if(mui.os.plus) {
			filesUploadforApp('/Post/UploadFiles', function(e) {
				if(e == '') {
					CreateThread(title, body, "");
				} else {
					CreateThread(title, body, e);
				}
			})
		} else if(mui.os.wechat) {
			if(imgFiles.length == 0) {
				CreateThread(title, body, "");
			} else {
				var attachmentIds = [];
				var i = 0;
				syncUpload(wxIds, 'Post/WeChatUploadFiles', function(e) {
					i++;
					attachmentIds.push(e)
					if(wxIds.length == 0) {
						CreateThread(title, body, attachmentIds.join(';'));
					}
				})
			}
		} else {
			var lengthList = zyUpload.webFiles.length;
			var touchArray = [];
			for(var i=0;i<lengthList;i++){
				touchArray.push(document.getElementsByClassName('creat-img')[i]);
			}
			if(touchArray.length > 0){
				appendFileTouch('/Post/UploadFiles',0,touchArray,function(e){
					CreateThread(title, body, e);
				})
			}else{
				CreateThread(title, body, "");
			}					

		}

	}

	function onCompletes(response) {
		setTimeout(function() {
			hideLoading()
		}, 500)

		CreateThread(title, body, attachmentIds.join(';'));
	}

	function onFailures() {
		mui.toast('文件上传失败，请重试！');
		return
	}

}