var pageUrl = window.location.pathname;
pageUrl = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.length);
/**
 * 个人主页
 */
if(pageUrl == 'mine.html') {

}
/**
 * 我的资讯
 */
var myNews = {
	init: function() {
		var userId = 0;
		var username = "";
		var creatnew = document.getElementById("creatnew");
		creatnew.addEventListener('tap', function() {
			mui.openWindow({
				url: 'creatNew.html',
				id: 'creatNew.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				}
			})
		})
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					GetmyNews(false, userId)
					//mynews(userId);
					username = self.username;
					username = (username == "me") ? "我" : username
					creatnew.style.display = (username == "我") ? 'block' : 'none';
					document.getElementById("navtil").innerHTML = username + '的文章';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				GetmyNews(false, userId)
				//mynews(userId);
				username = getUrlParam('username');
			}
			username = (username == "me") ? "我" : username
			creatnew.style.display = (username == "我") ? 'block' : 'none';
			document.getElementById("navtil").innerHTML = username + '的文章';
		}
		var ids = [];
		var GetEssentialQuestions;

		function login() {
			if(mui.os.wechat) {
				getCode('', true)
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
		mui.init({
			gestureConfig: {
				tap: true, //默认为true
				longtap: true, //默认为false
			}
		})

		function creatfavPop() {
			var div = document.createElement('div');
			div.id = 'favpopover';
			div.style.display = "none"
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
				'<li class="mui-table-view-cell popover-item" id="fav"><a href="#">取消收藏</a></li>' +
				'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
				'<li class="mui-table-view-cell popover-item"id="favqu"><a href="#">取消</a></li>' +
				'</ul>';
			bigContainer.appendChild(div);
		}
		creatfavPop();
		var newsFavId;
		var fav = document.getElementById("fav");
		fav.addEventListener("tap", function(e) {
			mui('#favpopover').popover('toggle');
			var content = document.getElementById("refreshContainer1").getElementsByTagName("ul")[0];
			content.innerHTML = "";
			NewFavoriteOperation(newsFavId);
			mui('#refreshContainer1').scroll().scrollTo(0, 0);
		})
		var favqu = document.getElementById("favqu")
		favqu.addEventListener("tap", function(e) {
			mui('#favpopover').popover('hide');
		})
		mui("#item0mobile").on('longtap', '.favnewslongtap', function(e) {
			mui('#favpopover').popover('toggle');
			newsFavId = this.getAttribute("id");
		})

		function NewFavoriteOperation(id) {
			var path = 'CMS/FavoriteContentItem?contentItemId=';
			//var waiting = showWaiting();
			postDatawithToken(path + id, {}, function(data) {
				//closeWaiting(waiting);				
				if(data.Type == 1) {
					mui.toast("取消收藏成功")
					GetfavNews(false, false)
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
				//closeWaiting(waiting);
			})
		}

		function creatmyPop() {
			var div = document.createElement('div');
			div.id = 'mypopover';
			div.style.display = "none"
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
				'<li class="mui-table-view-cell popover-item" id="mydelete"><a href="#">删除</a></li>' +
				'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
				'<li class="mui-table-view-cell popover-item"id="myqu"><a href="#">取消</a></li>' +
				'</ul>';
			bigContainer.appendChild(div);
		}
		creatmyPop();
		var newsDelId;
		var mydelete = document.getElementById("mydelete");
		mydelete.addEventListener("tap", function(e) {
			deleteNews(newsDelId);
			mui('#mypopover').popover('toggle');
			var content = document.getElementById("refreshContainer").getElementsByTagName("ul")[0];
			content.innerHTML = "";
			mui('#refreshContainer').scroll().scrollTo(0, 0);
		})
		var myqu = document.getElementById("myqu")
		myqu.addEventListener("tap", function(e) {
			mui('#mypopover').popover('hide');
		})
		mui("#itemmobile").on('longtap', '.mynewslongtap', function(e) {
			mui('#mypopover').popover('toggle');
			newsDelId = this.getAttribute("id");
		})

		function deleteNews(id) {
			var path = 'CMS/DeleteContentItem?contentItemId=' + id;
			postDatawithToken('CMS/DeleteContentItem?contentItemId=' + id, {}, function(data) {
				if(data.Type == 1) {
					mui.toast("删除成功")
					if(mui.os.plus) {
						mui.plusReady(function() {
							var self = plus.webview.currentWebview();
							userId = self.userId;
							//关闭等待框                                                                                                               
							plus.nativeUI.closeWaiting();
							//显示当前页面                                                                                                              
							mui.currentWebview.show();
						});
					} else {
						userId = getUrlParam('userId');
					}
					//mynews(userId);
					GetmyNews(false, userId)
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
			}, function(err) {})
		}
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		mui('.mui-slider').slider();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			deceleration: deceleration,
			snap: '.mui-control-item'
		});
		var tabIndex = 0;
		document.querySelector('.mui-slider').addEventListener('slide', function(event) {
			tabIndex = event.detail.slideNumber;
			if(event.detail.slideNumber != 0) {
				var index = event.detail.slideNumber - 1;
				var item = document.getElementById("item" + index + "mobile");
				item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
				if(item.querySelector('.mui-loading')) {
					if(index == 0) {
						GetfavNews(false, false)
					}
				}
			}
		});
		var pageindex = 1;
		(function($) {
			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			$.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetmyNews(false, userId);
								}
								if(selel[0].id == '1') {
									GetfavNews(false, false)
								}
								setTimeout(function() {
									self.endPullDownToRefresh();
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetmyNews(true, userId);
								}
								if(selel[0].id == '1') {
									GetfavNews(true, false)
								}
								setTimeout(function() {
									self.endPullUpToRefresh();
								}, 1000);
							}
						}
					});
				});
			});
		})(mui);
		mui.plusReady(function() {
			mui("#itemmobile").on('tap', '.mynewstap', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType = parseInt(this.getAttribute("title"));
					var urlId = 'newsDetail.html';
					var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
					switch(contentItemType) {
						case 1:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
						case 2:
							urlId = 'videoDetail.html';
							baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
							break;
						case 3:
							urlId = 'imgsDetail.html';
							baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
							break;
						default:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
					}
					var curl = shareUrl + baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: baseUrl,
						id: urlId,
						show: {
							autoShow: true
						},
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							ContentItemId: contentItemId
						}
					})
				}),
				mui("#item0mobile").on('tap', '.favnewstap', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType = parseInt(this.getAttribute("title"));
					var urlId = 'newsDetail.html';
					var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
					switch(contentItemType) {
						case 1:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
						case 2:
							urlId = 'videoDetail.html';
							baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
							break;
						case 3:
							urlId = 'imgsDetail.html';
							baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
							break;
						default:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
					}
					var curl = shareUrl + baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: baseUrl,
						id: urlId,
						show: {
							autoShow: true
						},
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							ContentItemId: contentItemId
						}
					})
				})
		})
		if(!mui.os.plus) {
			mui("#itemmobile").on('tap', '.mynewstap', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType = parseInt(this.getAttribute("title"));
					var urlId = 'newsDetail.html';
					var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
					switch(contentItemType) {
						case 1:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
						case 2:
							urlId = 'videoDetail.html';
							baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
							break;
						case 3:
							urlId = 'imgsDetail.html';
							baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
							break;
						default:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
					}
					var curl = shareUrl + baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: baseUrl,
						id: urlId
					});
				}),
				mui("#item0mobile").on('tap', '.favnewstap', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType = parseInt(this.getAttribute("title"));
					var urlId = 'newsDetail.html';
					var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
					switch(contentItemType) {
						case 1:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
						case 2:
							urlId = 'videoDetail.html';
							baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
							break;
						case 3:
							urlId = 'imgsDetail.html';
							baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
							break;
						default:
							urlId = 'newsDetail.html';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
					}
					var curl = shareUrl + baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: baseUrl,
						id: urlId
					});
				})
		}
		var creatmyNewsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var li;
			var userAvatar = "";
			for(var i = 0; i < data.length; i++) {
				if(data[i].ApprovalStatus == 20 || data[i].ApprovalStatus == 30) { //"ApprovalStatus:审核状态：10=未通过，20=待审核，30=需再审核，40=通过"
					ApprovalStatus = data[i].ApprovalStatus == 20 ? '<li style="color: #FF9900;">' + "待审核" + '</li>' : '<li style="color: #FF9900;">' + "需再审核" + '</li>'
				}
				if(data[i].ApprovalStatus == 10) {
					ApprovalStatus = '<li style="color: #FF0000;">' + "审核未通过" + '</li>'
				}
				if(data[i].ApprovalStatus == 40) {
					ApprovalStatus = '<li style="color: #008000;">' + "审核通过" + '</li>'
				}
				var dis = 'none';
				var imgUrl = '';
				if(data[i].FeaturedImage.length > 0) {
					dis = 'block'
					imgUrl = getImgUrl(data[i].FeaturedImage);
				} else {
					if(data[i].ContentModel == 3) {
						//组图
						if(data[i].FirstImage) {
							dis = 'block'
							imgUrl = getImgUrl(data[i].FirstImage);
						} else {
							dis = 'none'
						}
					} else {
						dis = 'none'
					}

				}
				userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : data[i].Avatar;
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list mynewstap  mynewslongtap';
				li.id = data[i].ContentItemId;
				li.title = data[i].ContentModel;
				li.innerHTML = '<div class="divImg" style="display:' + dis + ';padding: 5px 0 5px 0"><img style="display:' + dis + '" src=' + imgUrl + '  ></div>' +
					'										<h5 class="listTitle">' + data[i].Subject + '</h5>' +
					'										<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					ApprovalStatus +
					'											<li>' + data[i].DatePublished + '</li>' +
					'										</ul>' +
					'	<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-thumbs-up" aria-hidden="true">&nbsp;' + data[i].Attitude + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-commenting" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				finel.appendChild(li);
			}
		};
		var creatfavNewsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var Essential;
			var a1 = [];
			var li;
			var bigContainer;
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				var imgUrl = '';
				if(data[i].FeaturedImage.length > 0) {
					dis = 'block'
					imgUrl = getImgUrl(data[i].FeaturedImage);
				} else {
					if(data[i].ContentModel == 3) {
						//组图
						if(data[i].FirstImage) {
							dis = 'block'
							imgUrl = getImgUrl(data[i].FirstImage);
						} else {
							dis = 'none'
						}
					} else {
						dis = 'none'
					}

				}
				userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list favnewslongtap favnewstap';
				li.id = data[i].ContentItemId;
				li.title = data[i].ContentModel;
				li.innerHTML = '<div class="divImg" style="display:' + dis + '"><img style="display:' + dis + '" src=' + imgUrl + '  ></div>' +
					'										<h5 class="listTitle">' + data[i].Subject + '</h5>' +
					'										<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data[i].Author + '</li>' +
					'											<li>' + data[i].DatePublished + '</li>' +
					'										</ul>' +
					'	<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-thumbs-up" aria-hidden="true">&nbsp;' + data[i].Attitude + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-commenting" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				finel.appendChild(li);
			}
		};
		var page = 1;
		var idName = "";
		var bool;

		function GetmyNews(more, userId) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				userId: userId,
				pageSize: 10,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserContentItems', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatmyNewsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList('暂无文章', '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList('暂无文章', '', '', idName))
							}
						}
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						fragment.appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}

		function GetfavNews(more, isThread) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var cfragment = document.getElementById("refreshContainer1")
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				isThread: isThread,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserFavorite', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatfavNewsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								document.getElementById(idName).appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						document.getElementById(idName).appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}

		function changeTab(index) {
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index);
			gallerys.slider().gotoItem(index);
			if(index == 1) {
				GetfavNews(false, false)
				mui('#refreshContainer1').scroll().scrollTo(0, 0);
			}
			if(index == 0) {
				if(mui.os.plus) {
					mui.plusReady(function() {
						var self = plus.webview.currentWebview();
						userId = self.userId;
						//关闭等待框                                                                                                               
						plus.nativeUI.closeWaiting();
						//显示当前页面                                                                                                              
						mui.currentWebview.show();
					});
				} else {
					userId = getUrlParam('userId');
				}
				GetmyNews(false, userId)
				//mynews(userId);
				mui('#refreshContainer').scroll().scrollTo(0, 0);
			}
		}
		mui.init({
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			}
		});

	}
}
/**
 * 我的帖子
 */
var myThreads = {
	init: function() {
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					GetmyThreads(false, userId)
					//myThreads(userId);
					username = self.username;
					username = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = username + '的贴子';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				GetmyThreads(false, userId)
				//myThreads(userId);
				username = getUrlParam('username');
			}
			username = (username == "me") ? "我" : username
			document.getElementById("navtil").innerHTML = username + '的贴子';
		}
		var ids = [];
		var GetEssentialQuestions;

		function login() {
			if(mui.os.wechat) {
				getCode('', true)
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
		mui.init({
			gestureConfig: {
				tap: true, //默认为true
				longtap: true, //默认为false
			}
		})

		function creatfavPop() {
			var div = document.createElement('div');
			div.id = 'favpopover';
			div.style.display = "none"
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
				'<li class="mui-table-view-cell popover-item" id="fav"><a href="#">取消收藏</a></li>' +
				'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
				'<li class="mui-table-view-cell popover-item"id="favqu"><a href="#">取消</a></li>' +
				'</ul>';
			bigContainer.appendChild(div);
		}
		creatfavPop();
		var threadsFavId;
		var fav = document.getElementById("fav");
		fav.addEventListener("tap", function(e) {
			threadsFavoriteOperation(threadsFavId);
			mui('#favpopover').popover('toggle');
			var content = document.getElementById("refreshContainer1").getElementsByTagName("ul")[0];
			content.innerHTML = "";
			mui('#refreshContainer1').scroll().scrollTo(0, 0);
		})
		var favqu = document.getElementById("favqu")
		favqu.addEventListener("tap", function(e) {
			mui('#favpopover').popover('hide');
		})
		mui("#item0mobile").on('longtap', '.favthreadslongtap', function(e) {
			mui('#favpopover').popover('toggle');
			threadsFavId = this.getAttribute("id");
		})

		function threadsFavoriteOperation(id) {
			var path = 'Post/ThreadFavoriteOperation?threadId=';
			var waiting = showWaiting();
			postDatawithToken(path + id, {}, function(data) {
				closeWaiting(waiting);
				if(data.Type == 1) {
					mui.toast("取消收藏成功")
					GetfavThreads(false, true)
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

		function creatmyPop() {
			var div = document.createElement('div');
			div.id = 'mypopover';
			div.style.display = "none"
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
				'<li class="mui-table-view-cell popover-item" id="mydelete"><a href="#">删除</a></li>' +
				'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
				'<li class="mui-table-view-cell popover-item"id="myqu"><a href="#">取消</a></li>' +
				'</ul>';
			bigContainer.appendChild(div);
		}
		creatmyPop();
		var threadsDelId;
		var mydelete = document.getElementById("mydelete");
		mydelete.addEventListener("tap", function(e) {
			deleteThreads(threadsDelId)
			mui('#mypopover').popover('toggle');
			var content = document.getElementById("refreshContainer").getElementsByTagName("ul")[0];
			content.innerHTML = "";
			mui('#refreshContainer').scroll().scrollTo(0, 0);
		})
		var myqu = document.getElementById("myqu")
		myqu.addEventListener("tap", function(e) {
			mui('#mypopover').popover('hide');
		})
		mui("#itemmobile").on('longtap', '.mythreadslongtap', function(e) {
			mui('#mypopover').popover('toggle');
			threadsDelId = this.getAttribute("id");
		})

		function deleteThreads(id) {
			var path = 'Post/DeleteThread?threadId=' + id;
			postDatawithToken('Post/DeleteThread?threadId=' + id, {}, function(data) {
				if(data.Type == 1) {
					mui.toast("删除成功")
					if(mui.os.plus) {
						mui.plusReady(function() {
							var self = plus.webview.currentWebview();
							userId = self.userId;
							//关闭等待框                                                                                                               
							plus.nativeUI.closeWaiting();
							//显示当前页面                                                                                                              
							mui.currentWebview.show();
						});
					} else {
						userId = getUrlParam('userId');
					}
					//myThreads(userId);
					GetmyThreads(false, userId)
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
			}, function(err) {})
		}
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		mui('.mui-slider').slider();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			deceleration: deceleration,
			snap: '.mui-control-item'
		});
		var tabIndex = 0;
		document.querySelector('.mui-slider').addEventListener('slide', function(event) {
			tabIndex = event.detail.slideNumber;
			if(event.detail.slideNumber != 0) {
				var index = event.detail.slideNumber - 1;
				var item = document.getElementById("item" + index + "mobile");
				item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
				if(item.querySelector('.mui-loading')) {
					if(index == 0) {
						GetfavThreads(false, true)
					}
				}
			}
		});
		var pageindex = 1;
		(function($) {
			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			$.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetmyThreads(false, userId);
								}
								if(selel[0].id == '1') {
									GetfavThreads(false, true)
								}
								setTimeout(function() {
									self.endPullDownToRefresh();
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetmyThreads(true, userId);
								}
								if(selel[0].id == '1') {
									GetfavThreads(true, true)
								}
								setTimeout(function() {
									self.endPullUpToRefresh();
								}, 1000);
							}
						}
					});
				});
			});
		})(mui);
		mui.plusReady(function() {
			mui("#itemmobile").on('tap', '.mythreadstap', function(e) {
					var threadId = this.getAttribute('id');
					var baseUrl = 'threadDetail.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
					var curl = shareUrl + baseUrl + '?threadId=' + threadId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'threadDetail.html',
						show: {
							autoShow: true
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
							currId: 'myThreads.html'
						}
					})
				}),
				mui("#item0mobile").on('tap', '.favthreadstap', function(e) {
					var threadId = this.getAttribute('id');
					var baseUrl = 'threadDetail.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
					var curl = shareUrl + baseUrl + '?threadId=' + threadId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'threadDetail.html',
						show: {
							autoShow: true
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
							currId: 'myThreads.html'
						}
					})
				})
		})
		if(!mui.os.plus) {
			mui("#itemmobile").on('tap', '.mythreadstap', function(e) {
					var threadId = this.getAttribute('id');
					var baseUrl = 'threadDetail.html';
					var url = baseUrl + '?threadId=' + threadId;
					var curl = shareUrl + baseUrl + '?threadId=' + threadId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'threadDetail.html'
					});
				}),
				mui("#item0mobile").on('tap', '.favthreadstap', function(e) {
					var threadId = this.getAttribute('id');
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
		var creatimgFragment = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ("<div class='mui-col-xs-4'><img style='width:100px;height:100px' src='" + getImgUrl(data[i].Url) + "' title='" + data[i].FileName + "' alt='" + data[i].FileName + "' /></div>");
				bigContainers += itemContainer;
			}
			return bigContainers;

		}
		var creatmyThreadsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			for(var i = 0; i < data.length; i++) {
				if(data[i].ApprovalStatus == 20 || data[i].ApprovalStatus == 30) { //"ApprovalStatus:审核状态：10=未通过，20=待审核，30=需再审核，40=通过"

					ApprovalStatus = data[i].ApprovalStatus == 20 ? '<li style="color: #FF9900;">' + "待审核" + '</li>' : '<li style="color: #FF9900;">' + "需再审核" + '</li>'
				}
				if(data[i].ApprovalStatus == 10) {
					ApprovalStatus = '<li style="color: #FF0000;">' + "审核未通过" + '</li>'
				}
				if(data[i].ApprovalStatus == 40) {
					ApprovalStatus = '<li style="color: #008000;">' + "审核通过" + '</li>'
				}
				var dis = 'none';
				if(data[i].Attachments && data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatimgFragment(data[i].Attachments)
				} else {
					dis = 'none';
				}
				var userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : data[i].Avatar;
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list mythreadstap mythreadslongtap';
				li.id = data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					ApprovalStatus +
					'											<li>' + data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				finel.appendChild(li);
			}

		};
		var creatfavimgFragment = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ("<div class='mui-col-xs-4'><img style='width:100px;height:100px' src='" + getImgUrl(data[i].Url) + "' title='" + data[i].FileName + "' alt='" + data[i].FileName + "' /></div>");
				bigContainers += itemContainer;
			}
			return bigContainers;
		}
		var creatfavThreadsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				if(data[i].Attachments && data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatfavimgFragment(data[i].Attachments);
				} else {
					dis = 'none';
				}
				var userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list favthreadstap favthreadslongtap';
				li.id = data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data[i].Author + '</li>' +
					'											<li>' + data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				finel.appendChild(li);
			}
		};
		var page = 1;
		var idName = "";
		var bool;

		function GetmyThreads(more, userId) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				userId: userId,
				pageSize: 10,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserThreads', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatmyThreadsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						fragment.appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}

		function GetfavThreads(more, isThread) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var cfragment = document.getElementById("refreshContainer1")
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				isThread: isThread,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserFavorite', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatfavThreadsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								document.getElementById(idName).appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						document.getElementById(idName).appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}

		function changeTab(index) {
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index);
			gallerys.slider().gotoItem(index);
			if(index == 1) {
				GetfavThreads(false, true)
				mui('#refreshContainer1').scroll().scrollTo(0, 0);
			}
			if(index == 0) {
				if(mui.os.plus) {
					mui.plusReady(function() {
						var self = plus.webview.currentWebview();
						userId = self.userId;
						//关闭等待框                                                                                                               
						plus.nativeUI.closeWaiting();
						//显示当前页面                                                                                                              
						mui.currentWebview.show();
					});
				} else {
					userId = getUrlParam('userId');
				}
				mynews(userId);
				mui('#refreshContainer').scroll().scrollTo(0, 0);
			}
		}

	}
}
/**
 * 我的评论
 */
var userComments = {
	init: function() {
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					GetreceivedComments(false)
					//receivedComments();
					username = self.username;
					username = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = username + '的评论';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				GetreceivedComments(false)
				//receivedComments();
				username = getUrlParam('username');
			}
			username = (username == "me") ? "我" : username
			document.getElementById("navtil").innerHTML = username + '的评论';
		}
		var ids = [];

		function login() {
			if(mui.os.wechat) {
				getCode('', true)
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
		mui.init({
			gestureConfig: {
				tap: true, //默认为true
				longtap: true, //默认为false
			}
		})

		function creatsendPop() {
			var div = document.createElement('div');
			div.id = 'mypopover';
			div.style.display = "none"
			div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
			div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
				'<li class="mui-table-view-cell popover-item" id="mydelete"><a href="#">删除</a></li>' +
				'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
				'<li class="mui-table-view-cell popover-item"id="myqu"><a href="#">取消</a></li>' +
				'</ul>';
			bigContainer.appendChild(div);
		}
		creatsendPop();
		var commentDelId;
		var mydelete = document.getElementById("mydelete");
		mydelete.addEventListener("tap", function(e) {
			deleteComment(commentDelId)
			mui('#mypopover').popover('toggle');
			var content = document.getElementById("refreshContainer1").getElementsByTagName("ul")[0];
			content.innerHTML = "";
			GetsendComments();
			mui('#refreshContainer1').scroll().scrollTo(0, 0);
		})
		var myqu = document.getElementById("myqu")
		myqu.addEventListener("tap", function(e) {
			mui('#mypopover').popover('hide');
		})
		mui("#item0mobile").on('longtap', '.sendlongtap', function(e) {
			mui('#mypopover').popover('toggle');
			commentDelId = this.getAttribute("id");
		})

		function deleteComment(id) {
			var path = 'Comment/DeleteComment?commentId=' + id;
			postDatawithToken('Comment/DeleteComment?commentId=' + id, {}, function(data) {
				if(data.Type == 1) {
					mui.toast("删除成功")
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
			}, function(err) {})
		}
		var selel = document.getElementsByClassName("mui-control-item mui-active");
		mui('.mui-slider').slider();
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
			scrollY: false,
			scrollX: true,
			indicators: false,
			deceleration: deceleration,
			snap: '.mui-control-item'
		});
		var tabIndex = 0;
		document.querySelector('.mui-slider').addEventListener('slide', function(event) {
			tabIndex = event.detail.slideNumber;
			if(event.detail.slideNumber != 0) {
				var index = event.detail.slideNumber - 1;
				var item = document.getElementById("item" + index + "mobile");
				item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
				if(item.querySelector('.mui-loading')) {
					if(index == 0) {
						GetsendComments(false)
					}
				}
			}
		});
		var pageindex = 1;
		(function($) {
			//阻尼系数
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			$('.mui-scroll-wrapper').scroll({
				bounce: false,
				indicators: true, //是否显示滚动条
				deceleration: deceleration
			});
			$.ready(function() {
				//循环初始化所有下拉刷新，上拉加载。
				$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
					$(pullRefreshEl).pullToRefresh({
						down: {
							callback: function() {
								var self = this;
								document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetreceivedComments(false);
								}
								if(selel[0].id == '1') {
									GetsendComments(false)
								}
								setTimeout(function() {
									self.endPullDownToRefresh();
								}, 1000);
							}
						},
						up: {
							callback: function() {
								var self = this;
								if(selel[0].id == '0') {
									if(mui.os.plus) {
										mui.plusReady(function() {
											var self = plus.webview.currentWebview();
											userId = self.userId;
											//关闭等待框                                                                                                               
											plus.nativeUI.closeWaiting();
											//显示当前页面                                                                                                              
											mui.currentWebview.show();
										});
									} else {
										userId = getUrlParam('userId');
									}
									GetreceivedComments(true);
								}
								if(selel[0].id == '1') {
									GetsendComments(true)
								}
								setTimeout(function() {
									self.endPullUpToRefresh();
								}, 1000);
							}
						}
					});
				});
			});
		})(mui);
		mui.plusReady(function() {
			mui("#itemmobile").on('tap', 'a', function(e) {
					//此处首先要判断资讯/帖子，其次还要判断资讯（文章、组图、视频）
					var itemId = this.getAttribute('id');
					if(e.target.parentElement.id == '100002') {
						//帖子
						var baseUrl = 'threadDetail.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + itemId;
						var curl = shareUrl + baseUrl + '?threadId=' + threadId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'threadDetail.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								threadId: itemId,
								currId: 'userComments.html'
							}
						})
					} else if(e.target.parentElement.id == '101301' || e.target.parentElement.id == '101302') {
						var questionId = itemId;
						var baseUrl = 'question-solved.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
						var curl = shareUrl + baseUrl + '?questionId=' + questionId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'question-solved.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								questionId: questionId,
								tabIndex: 0,
								type: 'ask',
								currId: 'question-solved.html'
							}
						})
					} else {
						//文章
						switch(this.getAttribute('title')) {
							case 'Article':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Video':
								urlId = 'videoDetail.html';
								baseUrl = 'videoDetail.html?ContentItemId=' + itemId;
								break;
							case 'Image':
								urlId = 'imgsDetail.html';
								baseUrl = 'imgsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Contribution':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							default:
								break;
						}
						var curl = shareUrl + baseUrl;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: baseUrl,
							id: urlId,
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								ContentItemId: itemId
							}
						})
					}
				}),
				mui("#item0mobile").on('tap', 'a', function(e) {
					//此处首先要判断资讯/帖子，其次还要判断资讯（文章、组图、视频）
					var itemId = this.getAttribute('id');
					var itemId = e.target.id;
					if(e.target.parentElement.id == '100002') {
						//帖子
						var baseUrl = 'threadDetail.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + itemId;
						var curl = shareUrl + baseUrl + '?threadId=' + itemId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'threadDetail.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								threadId: itemId,
								currId: 'userComments.html'
							}
						})
					} else if(e.target.parentElement.id == '101301' || e.target.parentElement.id == '101302') {
						var questionId = itemId;
						var baseUrl = 'question-solved.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
						var curl = shareUrl + baseUrl + '?questionId=' + questionId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'question-solved.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								questionId: questionId,
								tabIndex: 0,
								type: 'ask',
								currId: 'question-solved.html'
							}
						})
					} else {
						//文章
						switch(this.getAttribute("title")) {
							case 'Article':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Video':
								urlId = 'videoDetail.html';
								baseUrl = 'videoDetail.html?ContentItemId=' + itemId;
								break;
							case 'Image':
								urlId = 'imgsDetail.html';
								baseUrl = 'imgsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Contribution':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							default:
								break;
						}
						var curl = shareUrl + baseUrl;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: baseUrl,
							id: urlId,
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							},
							extras: {
								ContentItemId: itemId
							}
						})
					}
				})
		})
		if(!mui.os.plus) {
			mui("#itemmobile").on('tap', 'a', function(e) {
					//此处首先要判断资讯/帖子，其次还要判断资讯（文章、组图、视频）
					var itemId = this.getAttribute('id');
					if(e.target.parentElement.id == '100002') {
						//帖子
						var baseUrl = 'threadDetail.html';
						var url = baseUrl + '?threadId=' + itemId;
						var curl = shareUrl + baseUrl + '?threadId=' + itemId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'threadDetail.html'
						})
					} else if(e.target.parentElement.id == '101301' || e.target.parentElement.id == '101302') {
						var questionId = itemId;
						var baseUrl = 'question-solved.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
						var curl = shareUrl + baseUrl + '?questionId=' + questionId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'question-solved.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							}
						})
					} else {
						//文章
						switch(this.getAttribute('title')) {
							case 'Article':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Video':
								urlId = 'videoDetail.html';
								baseUrl = 'videoDetail.html?ContentItemId=' + itemId;
								break;
							case 'Image':
								urlId = 'imgsDetail.html';
								baseUrl = 'imgsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Contribution':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							default:
								break;
						}
						var curl = shareUrl + baseUrl;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: baseUrl,
							id: urlId
						})
					}
				}),
				mui("#item0mobile").on('tap', 'a', function(e) {
					//此处首先要判断资讯/帖子，其次还要判断资讯（文章、组图、视频）
					var itemId = this.getAttribute('id');
					if(e.target.parentElement.id == '100002') {
						//帖子
						var baseUrl = 'threadDetail.html';
						var url = baseUrl + '?threadId=' + itemId;
						var curl = shareUrl + baseUrl + '?threadId=' + itemId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'threadDetail.html'
						})
					} else if(e.target.parentElement.id == '101301' || e.target.parentElement.id == '101302') {
						var questionId = itemId;
						var baseUrl = 'question-solved.html';
						var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
						var curl = shareUrl + baseUrl + '?questionId=' + questionId;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: url,
							id: 'question-solved.html',
							show: {
								autoShow: true
							},
							waiting: {
								options: {
									loading: {
										height: '35px'
									}
								}
							}
						})
					} else {
						//文章
						switch(this.getAttribute("title")) {
							case 'Article':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Video':
								urlId = 'videoDetail.html';
								baseUrl = 'videoDetail.html?ContentItemId=' + itemId;
								break;
							case 'Image':
								urlId = 'imgsDetail.html';
								baseUrl = 'imgsDetail.html?ContentItemId=' + itemId;
								break;
							case 'Contribution':
								urlId = 'newsDetail.html';
								baseUrl = 'newsDetail.html?ContentItemId=' + itemId;
								break;
							default:
								break;
						}
						var curl = shareUrl + baseUrl;
						setlsData('currUrl', curl);
						mui.openWindow({
							url: baseUrl,
							id: urlId
						})
					}
				});
		}
		var creatreceivedCommentsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var div;
			for(var i = 0; i < data.length; i++) {
				div = document.createElement('div');
				div.className = 'comment_body receivedtap';
				var child;
				var dis = 'none';
				if(data[i].ParentComment != null) {
					var sdata = data[i].ParentComment;
					dis = 'block';
					child = '<p>回复' + sdata.UserName + '： ' + sdata.Body + '</p>'
				} else {
					dis = 'none';
				}
				var type = "";
				if(data[i].CommentedObject != null) {
					if(data[i].CommentedObject.TenantTypeId == '100002') {
						//帖子
						type = "贴子"
					} else if(data[i].CommentedObject.TenantTypeId == '101301') {
						type = "问题"
					} else if(data[i].CommentedObject.TenantTypeId == '101302') {
						type = "回答"
					} else {
						var newtype = data[i].CommentedObject.ModelKey;
						switch(newtype) {
							case 'Article':
								type = "文章"
								break;
							case 'Video':
								type = "视频"
								break;
							case 'Image':
								type = "组图"
								break;
							case 'Contribution':
								type = "文章"
								break;
							default:
								break;
						}

					}
				}
				var id = 0;
				var title = '';
				var hasItem = 'none';
				var newType = '';
				if(data[i].CommentedObject != null) {
					hasItem = 'none';
					title = data[i].CommentedObject.Subject
					if(data[i].CommentedObject.TenantTypeId == '100002') {
						//帖子
						id = data[i].CommentedObject.ThreadId;
					} else {
						id = data[i].CommentedObject.ContentItemId;
						newType = data[i].CommentedObject.ModelKey;
					}
				} else {
					hasItem = 'inline';
				}
				var shenglue = data[i].Body.length > 15 ? "..." : "";
				var userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				div.innerHTML = '<div class="comment_img">' +
					'		    		<img class="creator_img_comment " src=' + userAvatar + '>' +
					'			    	</div>' +
					'			    	<div class="comment_content">' +
					'			    		<div class="comment_top">' +
					'			    			<h5 class="comment_top_left">' + data[i].UserName + '</h5>' +
					'							<h5 class="comment_top_right">' + data[i].DateCreated + '</h5>' +
					'				</div>' +
					'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
					'				<p>' +
					'					' + data[i].Body.substring(0, 20) + shenglue + '' +
					'				</p>' +
					'				<p id=' + (data[i].CommentedObject && data[i].CommentedObject.TenantTypeId != null && data[i].CommentedObject.TenantTypeId) + '>' +
					'					评论我的' + type + '：' +
					'                  <span style="color:#007aff;display:' + hasItem + '">该内容已被删除</span>' +
					'					<a id=' + id + ' title=' + newType + '>' + title + '</a>' +
					'				</p>' +
					'			</div>';
				finel.appendChild(div);
			}
		};
		var creatsendCommentsElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var fragment = document.createDocumentFragment();
			var div;
			for(var i = 0; i < data.length; i++) {
				if(data[i].ApprovalStatus == 20 || data[i].ApprovalStatus == 30) { //"ApprovalStatus:审核状态：10=未通过，20=待审核，30=需再审核，40=通过"

					ApprovalStatus = data[i].ApprovalStatus == 20 ? '<li style="color: #FF9900;">' + "待审核" + '</li>' : '<li style="color: #FF9900;">' + "需再审核" + '</li>'
				}
				if(data[i].ApprovalStatus == 10) {
					ApprovalStatus = '<li style="color: #FF0000;">' + "审核未通过" + '</li>'
				}
				if(data[i].ApprovalStatus == 40) {
					ApprovalStatus = '<li style="color: #008000;">' + "审核通过" + '</li>'
				}
				div = document.createElement('div');
				div.className = 'comment_body sendtap sendlongtap';
				div.id = data[i].Id;
				var child;
				var dis = 'none';
				if(data[i].ParentComment != null) {
					var sdata = data[i].ParentComment;
					dis = 'block';
					child = '<p>回复' + sdata.UserName + '： ' + sdata.Body + '</p>'
				} else {
					dis = 'none';
				}
				var type = "";
				if(data[i].CommentedObject != null) {
					if(data[i].CommentedObject.TenantTypeId == '100002') {
						//帖子
						type = "贴子"
					} else if(data[i].CommentedObject.TenantTypeId == '101301') {
						type = "问题"
					} else if(data[i].CommentedObject.TenantTypeId == '101302') {
						type = "回答"
					} else {
						var newtype = data[i].CommentedObject.ModelKey;
						switch(newtype) {
							case 'Article':
								type = "文章"
								break;
							case 'Video':
								type = "视频"
								break;
							case 'Image':
								type = "组图"
								break;
							case 'Contribution':
								type = "文章"
								break;
							default:
								break;
						}
					}
				}
				var id = 0;
				var title = '';
				var hasItem = 'none';
				var newType = '';
				if(data[i].CommentedObject != null) {
					hasItem = 'none';
					title = data[i].CommentedObject.Subject
					if(data[i].CommentedObject.TenantTypeId == '100002') {
						//帖子
						id = data[i].CommentedObject.ThreadId;
					} else {
						id = data[i].CommentedObject.ContentItemId;
						newType = data[i].CommentedObject.ModelKey;
					}
				} else {
					hasItem = 'inline';
				}
				var shenglue = data[i].Body.length > 15 ? "..." : "";
				var userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				div.innerHTML = '<div class="comment_img">' +
					'		    		<img class="creator_img_comment " src=' + userAvatar + '>' +
					'			    	</div>' +
					'			    	<div class="comment_content">' +
					'			    		<div class="comment_top">' +
					'			    			<h5 class="comment_top_left">' + data[i].UserName + '（被我评论）</h5>' +

					'				</div>' +
					'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
					'				<p>' +
					'					' + data[i].Body.substring(0, 20) + shenglue + '' +
					'				</p>' +
					'				<p id=' + (data[i].CommentedObject && data[i].CommentedObject.TenantTypeId != null && data[i].CommentedObject.TenantTypeId) + '>' +
					'					我评论的' + type + '：' +
					'                  <span style="color:#007aff;display:' + hasItem + '">该内容已被删除</span>' +
					'					<a id=' + id + ' title=' + newType + '>' + title + '</a>' +
					'				</p>' +
					'<ul class="status">' +
					ApprovalStatus +
					'               <li>' + data[i].DateCreated + '</li>' +
					'</ul>' +
					'			</div>';
				finel.appendChild(div);
			}
		};
		var page = 1;
		var idName = "";
		var bool;

		function GetreceivedComments(more) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				isSend: false,
				pageSize: 10,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserComments', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatreceivedCommentsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						fragment.appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}

		function GetsendComments(more) {
			if(!more) {
				showLoading('', '', '#FFFFFF', '90px', '1');
			}
			idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
			var fragment = document.getElementById(idName);
			var cfragment = document.getElementById("refreshContainer1")
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			if(more) {
				page++;
			} else {
				finel.innerHTML = '';
				page = 1;
			}
			var params = {
				isSend: true,
				pageSize: 10,
				pageIndex: page,
			};
			getDatawithToken('User/GetUserComments', params, function(data) {
				hideLoading()
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						if(data.Data.length <= 10) {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
						} else {
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
						}
						creatsendCommentsElement(data.Data, idName);
					} else {
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					var errForList = showErrForList(data.Data, '', '', idName);
					if(errForList) {
						fragment.appendChild(showErrForList(data.Data, '', '', idName))
					}
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '90px')
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '90px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
		}
		/*function receivedComments() {
			showLoading();
			getDatawithToken('User/GetUserComments', {userId:userId}, function(data) {
				hideLoading()
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data.length > 0) {
							GetreceivedComments(false)
						}
						mui('#SectionType .mui-control-item').each(function(index, element) {
							ids.push(element.id)
						})
					} else {
						mui.toast(data.Data);
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
				hideLoading()
			})
		}*/
		function changeTab(index) {
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index);
			gallerys.slider().gotoItem(index);
			if(index == 1) {
				GetfavNews(false, false)
				mui('#refreshContainer1').scroll().scrollTo(0, 0);
			}
			if(index == 0) {
				if(mui.os.plus) {
					mui.plusReady(function() {
						var self = plus.webview.currentWebview();
						userId = self.userId;
						//关闭等待框                                                                                                               
						plus.nativeUI.closeWaiting();
						//显示当前页面                                                                                                              
						mui.currentWebview.show();
					});
				} else {
					userId = getUrlParam('userId');
				}
				mynews(userId);
				mui('#refreshContainer').scroll().scrollTo(0, 0);
			}
		}
		mui.init({
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			}
		});
	}
}
/**
 * 我的问答
 */
if(pageUrl == 'userQuestions.html') {

	var userId = 0;
	var username = "";
	window.onload = function() {
		//获取url中的targetId参数                                                                                                           
		if(mui.os.plus) {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				userId = self.userId;
				username = self.username;
				GetanswerQuestion(false)
				username = (username == "me") ? "我" : username
				document.getElementById("navtil").innerHTML = username + '的问答';
				//关闭等待框                                                                                                               
				plus.nativeUI.closeWaiting();
				//显示当前页面                                                                                                              
				mui.currentWebview.show();
			});
		} else {
			userId = getUrlParam('userId');
			username = getUrlParam('username');
			GetanswerQuestion(false)
		}
		username = (username == "me") ? "我" : username
		document.getElementById("navtil").innerHTML = username + '的问答';
	}
	var ids = [];
	var GetEssentialQuestions;

	function login() {
		if(mui.os.wechat) {
			getCode('', true)
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
	mui.init({
		gestureConfig: {
			tap: true, //默认为true
			longtap: true, //默认为false
		}
	})

	function creatfavPop() {
		var div = document.createElement('div');
		div.id = 'favpopover';
		div.style.display = "none"
		div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
		div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
			'<li class="mui-table-view-cell popover-item" id="fav"><a href="#">取消收藏</a></li>' +
			'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
			'<li class="mui-table-view-cell popover-item"id="favqu"><a href="#">取消</a></li>' +
			'</ul>';
		bigContainer.appendChild(div);
	}
	creatfavPop();
	var questionFavId;
	var fav = document.getElementById("fav");
	fav.addEventListener("tap", function(e) {
		QuestionFavoriteOperation(questionFavId)
		mui('#favpopover').popover('toggle');
		mui('#refreshContainer2').scroll().scrollTo(0, 0);
	})
	var favqu = document.getElementById("favqu")
	favqu.addEventListener("tap", function(e) {
		mui('#favpopover').popover('hide');
	})
	mui("#item1mobile").on('longtap', '.favquestionlongtap', function(e) {
		mui('#favpopover').popover('toggle'); //floatWebview();																									
		questionFavId = this.getAttribute("id");
	})

	function QuestionFavoriteOperation(id) {
		var path = 'Ask/FavoriteQuestion?questionId=';
		var waiting = showWaiting();
		postDatawithToken(path + id, {}, function(data) {
			closeWaiting(waiting);
			if(data.Type == 1) {
				mui.toast("取消收藏成功")
				GetfavQuestion(false)
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

	function creatraisedPop() {
		var div = document.createElement('div');
		div.id = 'raisedpopover';
		div.style.display = "none"
		div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
		div.innerHTML = ' <ul class="mui-table-view popover-all" style="margin:0px;border-radius:0">' +
			'<li class="mui-table-view-cell popover-item" id="raiseddelete"><a href="#">删除</a></li>' +
			'<li style="height:10px;background-color: rgba(0,0,0,.2);"></li>' +
			'<li class="mui-table-view-cell popover-item"id="raisedqu"><a href="#">取消</a></li>' +
			'</ul>';
		bigContainer.appendChild(div);
	}
	creatraisedPop();
	var questionDelId;
	var raiseddelete = document.getElementById("raiseddelete");
	raiseddelete.addEventListener("tap", function(e) {
		deleteQuestion(questionDelId)
		mui('#raisedpopover').popover('toggle');
		mui('#refreshContainer1').scroll().scrollTo(0, 0);
	})
	var raisedqu = document.getElementById("raisedqu")
	raisedqu.addEventListener("tap", function(e) {
		mui('#raisedpopover').popover('hide');
	})
	mui("#item0mobile").on('longtap', '.raisedquestionlongtap', function(e) {
		mui('#raisedpopover').popover('toggle'); //floatWebview();																									
		questionDelId = this.getAttribute("id");
	})

	function deleteQuestion(id) {
		var path = 'Ask/DeleteQuestion?questionId=' + id;
		postDatawithToken('Ask/DeleteQuestion?questionId=' + id, {}, function(data) {
			if(data.Type == 1) {
				mui.toast("删除成功")
				GetraisedQuestion(false)
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
		}, function(err) {})
	}
	var selel = document.getElementsByClassName("mui-control-item mui-active");
	mui('.mui-slider').slider();
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
		scrollY: false,
		scrollX: true,
		indicators: false,
		deceleration: deceleration,
		snap: '.mui-control-item'
	});
	var tabIndex = 0;
	document.querySelector('.mui-slider').addEventListener('slide', function(event) {
		tabIndex = event.detail.slideNumber;
		if(event.detail.slideNumber != 0) {
			var index = event.detail.slideNumber - 1;
			var item = document.getElementById("item" + index + "mobile");
			item.querySelector('.mui-pull-bottom-tips').style.display = 'none';
			if(item.querySelector('.mui-loading')) {
				if(index == 1) {
					GetfavQuestion(false)
				}
				if(index == 0) {
					GetraisedQuestion(false)
				}
			}
		}
	});
	var pageindex = 1;
	(function($) {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		$('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		$.ready(function() {
			//循环初始化所有下拉刷新，上拉加载。
			$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				$(pullRefreshEl).pullToRefresh({
					down: {
						callback: function() {
							var self = this;
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
							if(selel[0].id == '1') {
								GetraisedQuestion(false)
							}
							if(selel[0].id == '0') {
								GetanswerQuestion(false)
							}
							if(selel[0].id == '2') {
								GetfavQuestion(false)
							}
							setTimeout(function() {
								self.endPullDownToRefresh();
							}, 1000);
						}
					},
					up: {
						callback: function() {
							var self = this;
							if(selel[0].id == '0') {
								GetanswerQuestion(true)
							}
							if(selel[0].id == '1') {
								GetraisedQuestion(true)
							}
							if(selel[0].id == '2') {
								GetfavQuestion(true)
							}
							setTimeout(function() {
								self.endPullUpToRefresh();
							}, 1000);
						}
					}
				});
			});
		});
	})(mui);
	mui.plusReady(function() {
		mui("#itemmobile").on('tap', '.answerquestiontap', function(e) {
				var questionId = this.getAttribute('id');
				var baseUrl = 'question-solved.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
				var curl = shareUrl + baseUrl + '?questionId=' + questionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-solved.html',
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						questionId: questionId,
						tabIndex: tabIndex,
						type: 'user',
						currId: 'question-solved.html'
					}
				})
			}),
			mui("#item0mobile").on('tap', '.raisedquestiontap', function(e) {
				var questionId = this.getAttribute('id');
				var baseUrl = 'question-solved.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
				var curl = shareUrl + baseUrl + '?questionId=' + questionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-solved.html',
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						questionId: questionId,
						tabIndex: tabIndex,
						type: 'user',
						currId: 'question-solved.html'
					}
				})
			}),
			mui("#item1mobile").on('tap', '.favquestiontap', function(e) {
				var questionId = this.getAttribute('id');
				var baseUrl = 'question-solved.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
				var curl = shareUrl + baseUrl + '?questionId=' + questionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'question-solved.html',
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						questionId: questionId,
						tabIndex: tabIndex,
						type: 'user',
						currId: 'question-solved.html'
					}
				})
			})
	})
	if(!mui.os.plus) {
		mui("#itemmobile").on('tap', '.answerquestiontap', function(e) {
			var questionId = this.getAttribute('id');
			var baseUrl = 'question-solved.html';
			var url = baseUrl + '?questionId=' + questionId;
			var curl = shareUrl + baseUrl + '?questionId=' + questionId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'question-solved.html'
			});
			return false;
		})
		mui("#item0mobile").on('tap', '.raisedquestiontap', function(e) {
			var questionId = this.getAttribute('id');
			var baseUrl = 'question-solved.html';
			var url = baseUrl + '?questionId=' + questionId;
			var curl = shareUrl+ baseUrl+ '?questionId=' + questionId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'question-solved.html'
			});
			return false;
		}),
		mui("#item1mobile").on('tap', '.favquestiontap', function(e) {
			var questionId = this.getAttribute('id');
			var baseUrl = 'question-solved.html';
			var url = baseUrl + '?questionId=' + questionId;
			var curl = shareUrl+ baseUrl+ '?questionId=' + questionId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'question-solved.html'
			});
			return false;
		})
	}
	var creatanswerquestionElement = function(data, id) {
		var fragment = document.getElementById(id);
		var cfragment = fragment.firstElementChild;
		var bardiv = document.createElement('div');
		bardiv.className = 'jh-gray-bar'
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		finel.appendChild(bardiv);
		var fragment = document.createDocumentFragment();
		var Essential;
		var a1 = [];
		var li;
		var bigContainer;
		for(var i = 0; i < data.length; i++) {
			span = document.createElement('span');
			var resolved = "";
			classn = data[i].IsResolved ? 'jh-green-border' : 'jh-red-border';
			text1 = data[i].IsResolved ? "已解决" : "未解决";
			resolved = '<span class=' + classn + '>' + text1 + '</span>'
			var dis = 'none';
			bigContainer = "";
			a1 = [];
			if(data[i].IsEssential) {
				Essential = '<span class="jh-red-border">' + "精华" + '</span>'
			} else {
				Essential = ''
			}
			for(var r = 0; r < a1.length; r++) {
				bigContainers = "";
				itemContainer = '<a  class="tagname" id=' + a1[r] + '><span class="label label-default">' + a1[r] + '</span></a>'
				bigContainer += itemContainer;
			}
			var shenglue = data[i].Subject.length > 15 ? "..." : ""; //.substring(0, 15) +shenglue
			div = document.createElement('div');
			div.className = 'mui-content question-list';
			div.id = data[i].Id;
			div.innerHTML =
				'    <div class="mui-content-padded answerquestiontap answerquestionlongtap" id=' + data[i].Id + '>' +
				'<div class="subject">' +
				'                                              <p class="content" id=' + data[i].Id + '>' +
				data[i].Subject +
				'<span class="status">' +
				resolved +
				Essential +
				'</span>' +
				'                                              </p></div>' +
				'                                              <div class="mui-row"> ' +

				'                                              <ul class="mui-list-inline text-muted" >' +

				'                                              <li>' + data[i].DateCreated + '</li>' +
				'                                              <li>' + data[i].HitTimes + '浏览' + '</li>' +
				'                                              <li>' + data[i].AnswerCount + '回答' + '</li>' +

				'                                              </ul>' +
				'                                              </div>' +
				'                                              </div>' +
				'           <div class="jh-gray-bar"></div></div>';
			finel.appendChild(div);
		}
	};
	var creatraisedquestionElement = function(data, id) {
		var fragment = document.getElementById(id);
		var cfragment = fragment.firstElementChild;
		var bardiv = document.createElement('div');
		bardiv.className = 'jh-gray-bar'
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		finel.appendChild(bardiv);
		var fragment = document.createDocumentFragment();
		var Essential;
		var a1 = [];
		var li;
		var bigContainer;
		for(var i = 0; i < data.length; i++) {
			switch(data[i].ApprovalStatus) {
				case 20:
					var ApprovalStatus = '<li style="color: #FF9900;">' + "待审核" + '</li>';
					break;
				case 30:
					var ApprovalStatus = '<li style="color: #FF9900;">' + "需再审核" + '</li>';
					break;
				case 10:
					var ApprovalStatus = '<li style="color: #FF0000;">' + "审核未通过" + '</li>';
					break;
				case 40:
					var ApprovalStatus = '<li style="color: #008000;">' + "审核通过" + '</li>'
					break;
				default:
					break;
			}
			span = document.createElement('span');
			var resolved = "";
			classn = data[i].IsResolved ? 'jh-green-border' : 'jh-red-border';
			text1 = data[i].IsResolved ? "已解决" : "未解决";
			resolved = '<span class=' + classn + '>' + text1 + '</span>'
			var dis = 'none';
			bigContainer = "";
			a1 = [];
			Essential = data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
			for(var r = 0; r < a1.length; r++) {
				bigContainers = "";
				itemContainer = '<a  class="tagname" id=' + a1[r] + '><span class="label label-default">' + a1[r] + '</span></a>'
				bigContainer += itemContainer;
			}
			var shenglue = data[i].Subject.length > 15 ? "..." : ""; //.substring(0, 15) +shenglue
			div = document.createElement('div');
			div.className = 'mui-content question-list';
			div.id = data[i].Id;
			div.innerHTML =
				' <div class="mui-content-padded raisedquestiontap raisedquestionlongtap" id=' + data[i].Id + '>' +
				'<div class="subject">' +
				'                                              <p class="content" id=' + data[i].Id + '>' +
				data[i].Subject +
				'<span class="status">' +
				resolved +
				Essential +
				'</span>' +
				'                                              </p></div>' +
				'                                              <div class="mui-row"> ' +

				'                                              <ul class="mui-list-inline text-muted" >' +
				ApprovalStatus +
				'                                              <li>' + data[i].DateCreated + '</li>' +
				'                                              <li>' + data[i].HitTimes + '浏览' + '</li>' +
				'                                              <li>' + data[i].AnswerCount + '回答' + '</li>' +

				'                                              </ul>' +
				'                                              </div>' +
				'                                              </div>' +
				'                                         <div class="jh-gray-bar"></div></div>';
			finel.appendChild(div);
		}
	};
	var creatfavquestionElement = function(data, id) {
		var fragment = document.getElementById(id);
		var cfragment = fragment.firstElementChild;
		var bardiv = document.createElement('div');
		bardiv.className = 'jh-gray-bar'
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		finel.appendChild(bardiv);
		var fragment = document.createDocumentFragment();
		var Essential;
		var a1 = [];
		var li;
		var bigContainer;
		for(var i = 0; i < data.length; i++) {
			span = document.createElement('span');
			var resolved = "";
			classn = data[i].IsResolved ? 'jh-green-border' : 'jh-red-border';
			text1 = data[i].IsResolved ? "已解决" : "未解决";
			resolved = '<span class=' + classn + '>' + text1 + '</span>'
			var dis = 'none';
			bigContainer = "";
			a1 = [];
			var Author;
			Author = data[i].IsAnonymous ? '<li>' + "匿名用户 " + '</li>' : '<li>' + data[i].Author + '</li>';
			Essential = data[i].IsEssential == true ? '<span class="jh-red-border">' + "精华" + '</span>' : '';
			for(var r = 0; r < a1.length; r++) {
				bigContainers = "";
				itemContainer = '<a  class="tagname" id=' + a1[r] + '><span class="label label-default">' + a1[r] + '</span></a>'
				bigContainer += itemContainer;
			}
			var shenglue = data[i].Subject.length > 15 ? "..." : ""; //.substring(0, 15) +shenglue
			div = document.createElement('div');
			div.className = 'mui-content question-list';
			div.id = data[i].Id;
			div.innerHTML =
				'<div class="mui-content-padded favquestiontap favquestionlongtap" id=' + data[i].Id + '>' +
				'<div class="subject">' +
				'                                              <p class="content" id=' + data[i].Id + '>' +
				data[i].Subject +
				'<span class="status">' +
				resolved +
				Essential +
				'</span>' +
				'                                              </p></div>' +
				'                                              <div class="mui-row"> ' +

				'                                              <ul class="mui-list-inline text-muted" >' +
				Author +
				'                                              <li>' + data[i].DateCreated + '</li>' +
				'                                              <li>' + data[i].HitTimes + '浏览' + '</li>' +
				'                                              <li>' + data[i].AnswerCount + '回答' + '</li>' +

				'                                              </ul>' +
				'                                              </div>' +
				'                                              </div>' +
				'                                  <div class="jh-gray-bar"></div></div>';
			finel.appendChild(div);
		}
	};
	var page = 1;
	var idName = "";
	var bool;

	function GetanswerQuestion(more) {
		if(!more) {
			showLoading('', '', '#FFFFFF', '90px', '1');
		}
		idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
		var fragment = document.getElementById(idName);
		var cfragment = fragment.firstElementChild;
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		if(more) {
			page++;
		} else {
			finel.innerHTML = '';
			page = 1;
		}
		var params = {
			pageSize: 10,
			pageIndex: page,
		};
		getDatawithToken('Ask/GetMyAnsweredQuestion', params, function(data) {
			hideLoading()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				if(data.Data && typeof(data.Data) == 'object') {
					hideErrForList('', idName);
					if(data.Data.length <= 10) {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
					} else {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
					}
					creatanswerquestionElement(data.Data, idName);
				} else {
					if(!more) {
						var errForList = showErrForList(data.Data, '', '', idName);
						if(errForList) {
							fragment.appendChild(showErrForList(data.Data, '', '', idName))
						}
					}
					mui.toast(data.Data);
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				var errForList = showErrForList(data.Data, '', '', idName);
				if(errForList) {
					fragment.appendChild(showErrForList(data.Data, '', '', idName))
				}
				mui.toast(data.Data);
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function() {
				if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接', '', '#FFFFFF', '90px')
				} else {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
			if(!mui.os.plus) {
				showErr('错误代码：' + err, '', '#FFFFFF', '90px');
				hideLoading()
			}
		})
	}

	function GetraisedQuestion(more) {
		if(!more) {
			showLoading('', '', '#FFFFFF', '90px', '1');
		}
		idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
		var fragment = document.getElementById(idName);
		var cfragment = document.getElementById("refreshContainer1");
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		if(more) {
			page++;
		} else {
			finel.innerHTML = '';
			page = 1;
		}
		var params = {
			pageSize: 10,
			pageIndex: page,
		};
		getDatawithToken('Ask/GetMyQuestion', params, function(data) {
			hideLoading()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				if(data.Data && typeof(data.Data) == 'object') {
					hideErrForList('', idName);
					if(data.Data.length == 0) {
						if(!more) {
							var errForList = showErrForList('暂无数据', '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList('暂无数据', '', '', idName))
							}
						}
					}
					if(data.Data.length <= 10) {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
					} else {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
					}
					creatraisedquestionElement(data.Data, idName);
				} else {
					if(!more) {
						var errForList = showErrForList(data.Data, '', '', idName);
						if(errForList) {
							fragment.appendChild(showErrForList(data.Data, '', '', idName))
						}
					}
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				var errForList = showErrForList(data.Data, '', '', idName);
				if(errForList) {
					fragment.appendChild(showErrForList(data.Data, '', '', idName))
				}
				mui.toast(data.Data);
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function() {
				if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接', '', '#FFFFFF', '90px')
				} else {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
			if(!mui.os.plus) {
				showErr('错误代码：' + err, '', '#FFFFFF', '90px');
				hideLoading()
			}
		})
	}

	function GetfavQuestion(more) {
		if(!more) {
			showLoading('', '', '#FFFFFF', '90px', '1');
		}
		idName = selel[0].href.substring(selel[0].href.lastIndexOf("#") + 1, selel[0].href.length);
		var fragment = document.getElementById(idName);
		var cfragment = document.getElementById("refreshContainer2")
		var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
		if(more) {
			page++;
		} else {
			finel.innerHTML = '';
			page = 1;
		}
		var params = {
			pageSize: 10,
			pageIndex: page,
		};
		getDatawithToken('Ask/GetMyFavoriteQuestion', params, function(data) {
			hideLoading()
			var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
			if(data.Type == 1) {
				if(data.Data && typeof(data.Data) == 'object') {
					hideErrForList('', idName);
					if(data.Data.length <= 10) {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
					} else {
						document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
					}
					creatfavquestionElement(data.Data, idName);
				} else {
					if(!more) {
						var errForList = showErrForList('暂无数据', '', '', idName);
						if(errForList) {
							fragment.appendChild(showErrForList('暂无数据', '', '', idName))
						}
					}
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				login();
				return;
			} else {
				//逻辑错误
				var errForList = showErrForList(data.Data, '', '', idName);
				if(errForList) {
					fragment.appendChild(showErrForList(data.Data, '', '', idName))
				}
				mui.toast(data.Data);
				return;
			}
		}, function(err) {
			hideLoading();
			mui.plusReady(function() {
				if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
					mui.toast('网络异常，请检查网络设置!');
					showErr('没有网络连接', '', '#FFFFFF', '90px')
				} else {
					showErr('错误代码：' + err, '', '#FFFFFF', '90px');
					hideLoading()
				}
			})
			if(!mui.os.plus) {
				showErr('错误代码：' + err, '', '#FFFFFF', '90px');
				hideLoading()
			}
		})
	}

	function changeTab(index) {
		var gallery = mui('#sliderSegmentedControl');
		var gallerys = mui('#slider');
		gallery.scroll().gotoPage(index);
		gallerys.slider().gotoItem(index);
		if(index == 1) {
			GetraisedQuestion(false)
			mui('#refreshContainer1').scroll().scrollTo(0, 0);
		}
		if(index == 2) {
			GetfavQuestion(false)
			mui('#refreshContainer2').scroll().scrollTo(0, 0);
		}
		if(index == 0) {
			GetanswerQuestion(false)
			mui('#refreshContainer').scroll().scrollTo(0, 0);
		}
	}
	mui.init({
		gestureConfig: {
			swipeBack: true //启用右滑关闭功能
		},
	});

}

/**
 * 他人主页
 */
var userHomePage = {
	init: function() {
		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#bf0a10', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					callback: function() {
						setTimeout(function() {
							getUserData(userid, true);
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						}, 1500);
					}
				}
			}
		});
		var user;
		var userid = 0;
		var userName = '';
		var gendername = '他';
		var userAvatorimg = document.getElementById("userAvatorimg");
		var notice = document.getElementById("notice");
		var loguser = document.getElementById("loguser");
		var nologuser_content = document.getElementById("nologuser_content");
		var loguser_content = document.getElementById("loguser_content");
		var rank = document.getElementById("rank");
		var username = document.getElementById("username");
		var gender = document.getElementById("gender");
		var followerCount = document.getElementById("followerCount"); //粉丝
		var followedCount = document.getElementById("followedCount"); //关注
		var introduce = document.getElementById("user_introduce");
		var mytz = document.getElementById("mytz");
		var mywz = document.getElementById("mywz");
		var userwz = document.getElementById("userwz");
		var usertz = document.getElementById("usertz");
		var coverImg = document.getElementById("coverImg");
		var favUser = document.getElementById("favUser");
		var fav = document.getElementsByClassName("fav");

		function login() {
			if(mui.os.wechat) {
				getCode('', true)
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

		$(document).ready(function() {
			$(window).scroll(function() {
				var top = 50; //获取指定位置
				var scrollTop = $(window).scrollTop(); //获取当前滑动位置
				if(scrollTop > top) { //滑动到该位置时执行代码
					document.querySelector('.mui-action-back').style.color = '#000000';
				} else {
					document.querySelector('.mui-action-back').style.color = '#FFFFFF';
				}
			});
		});

		favUser.addEventListener("tap", function(e) {
			var userId = this.parentElement.id;
			var path = 'User/FollowUserOperation?userId=';
			postDatawithToken(path + userId, {}, function(data) {
				if(data.Type == 1) {
					if(data.Data.Message == '关注成功') {
						mui.toast(data.Data.Message);
						favUser.innerHTML = data.Data.IsMutualFollowed == true ? "相互关注" : "已关注";
						favUser.className = data.Data.IsMutualFollowed == true ? "mui-btn mui-btn-outlined " : "mui-btn mui-btn-outlined"
					} else {
						if(data.Data == "取消关注成功") {
							mui.toast(data.Data);
						} else {
							mui.toast(data.Data.Message);
						}
						favUser.innerHTML = data.Data == "关注成功" ? 　"取消关注"　 : 　"关注";
						favUser.className = favUser.innerHTML == "关注" ? "mui-btn mui-btn-danger " : "mui-btn mui-btn-outlined";
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
				//closeWaiting(waiting);
			})
		});

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
			var userAvatar = "";
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				if(data[i].Attachments && data[i].Attachments.length > 0) {
					dis = 'block';
					child = creatimgFragment(data[i].Attachments)
				} else {
					dis = 'none';
				}
				userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data[i].ThreadId;
				li.innerHTML = '<h5 class="listTitle">' + data[i].Subject + '</h5><div style="display:' + dis + '" class="mui-row">' + child + '</div>' +
					'<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + getImgUrl(userAvatar) + '></li>' +
					'											<li>' + data[i].Author + '</li>' +
					'											<li>' + data[i].DateCreated + '发布</li>' +
					'										</ul>' +
					'<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-eye" aria-hidden="true">&nbsp;' + data[i].HitTimes + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-comment" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				fragment.appendChild(li);
			}
			return fragment;
		};
		var createNewsFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			var userAvatar = "";
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				var imgUrl = '';
				if(data[i].FeaturedImage.length > 0) {
					dis = 'block'
					imgUrl = getImgUrl(data[i].FeaturedImage);
				} else {
					if(data[i].ContentModel == 3) {
						//组图
						if(data[i].FirstImage) {
							dis = 'block'
							imgUrl = getImgUrl(data[i].FirstImage);
						} else {
							dis = 'none'
						}
					} else {
						dis = 'none'
					}

				}
				userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data[i].ContentItemId;
				li.title = data[i].ContentModel;
				li.innerHTML = '<div class="divImg" style="display:' + dis + ';padding: 5px 0 5px 0"><img style="display:' + dis + '" src=' + imgUrl + '  ></div>' +
					'										<h5 class="listTitle">' + data[i].Subject + '</h5>' +
					'										<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data[i].Author + '</li>' +
					'											<li>' + data[i].DatePublished + '</li>' +
					'										</ul>' +
					'	<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-thumbs-up" aria-hidden="true">&nbsp;' + data[i].Attitude + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-commenting" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				fragment.appendChild(li);
			}
			return fragment;
		};

		getDatawithToken('User/GetCurrentUser', {}, function(data) {
			if(data.Type == 1) {
				setlsData('isLogin', true);
				user = data.Data;
			} else if(data.Type == 0) {
				//登录失败
				//mui.toast("请登录后再进行操作");
				setlsData('isLogin', false);
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(data) {
			closeWaiting(waitings);
		});
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			}
			userid = getUrlParam('userId');
			getUserData(userid, false)
		}

		function getUserData(id, isRefresh) {
			document.getElementById("userhead").style.top = 200 - 50 + 'px';
			if(!isRefresh) {
				showLoading();
			}
			getDatawithToken('User/GetCurrentUser', {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					setlsData('isLogin', true);
					user = data.Data;
					getDatawithToken('User/GetUserSpace', {
						userId: id
					}, function(data) {
						hideLoading();
						if(data.Type == 1) {
							favUser.innerHTML = data.Data.IsMutualFollowed == true ? "相互关注" : "已关注";
							favUser.className = data.Data.IsMutualFollowed == true ? "mui-btn mui-btn-outlined" : "mui-btn mui-btn-danger mui-btn-outlined";
							//favUser.innerHTML = data.Data.IsFollowed == true ? "取消关注"	: "关注";
							if(favUser.innerHTML == "已关注" && data.Data.IsFollowed != null) { //mui-btn-mini  mui-btn-primary
								favUser.className = (!data.Data.IsFollowed) ? 'mui-btn-primary' : 'mui-btn-mini';
								favUser.innerHTML = (!data.Data.IsFollowed) ? '关注' : '已关注'
							}
							fav[0].id = data.Data.UserId;
							userid = data.Data.UserId;
							userName = data.Data.UserName
							username.innerHTML = data.Data.UserName.substring(0,5);
							document.getElementById("userhead").src = (data.Data.Avatar == '') ? '../img/avatar.jpg' : getImgUrl(data.Data.Avatar);
							if(user.UserId == userid) {
								gendername = '我';
								fav[0].style.display = 'none';
							}
							if(data.Data.Introduction == null) {
								document.getElementById("allintroduce").style.display = 'none';
							} else {
								document.getElementById("allintroduce").style.display = 'block';
							}
							coverImg.src = data.Data.Cover.length > 0 ? getImgUrl(data.Data.Cover) : "../img/minebanner.png";
							switch(data.Data.Gender) {
								case 1:
									gender.className = 'fa fa-male';
									gendername == '我' ? gendername == '我' : gendername = '他';
									break;
								case 2:
									gender.className = 'fa fa-female';
									gendername == '我' ? gendername == '我' : gendername = '她';
									break;
								default:
									gender.className = 'fa fa-male';
									gendername == '我' ? gendername == '我' : gendername = '他';
									break;
							}
							document.getElementById("mynewtil").innerHTML = gendername + '的文章';
							document.getElementById("mythrtil").innerHTML = gendername + '的贴子';
							followerCount.innerHTML = '粉丝 ' + data.Data.FollowerCount;
							followedCount.innerHTML = '关注 ' + data.Data.FollowedCount;
							introduce.innerHTML = data.Data.Introduction;
							rank.innerHTML = data.Data.Rank;
							mywz.querySelector('.text-muted').innerHTML = data.Data.CMSCount;
							mytz.querySelector('.text-muted').innerHTML = data.Data.ThreadCount;
							if(data.Data.CMS && data.Data.CMS.length > 0) {
								userwz.innerHTML = '';
								userwz.appendChild(createNewsFragment(data.Data.CMS))
							}
							if(data.Data.Threads && data.Data.Threads.length > 0) {
								usertz.innerHTML = '';
								usertz.appendChild(createFragment(data.Data.Threads))
							}
							document.getElementById("userhead").style.top = (coverImg.height == 0 ? 200 : coverImg.height) - 50 + 'px';
							document.getElementById("userinfo").style.top = (coverImg.height == 0 ? 200 : coverImg.height) - 50 + 'px';
							document.querySelector('.fav').style.top = (coverImg.height == 0 ? 200 : coverImg.height) - 50 + 'px';
						} else if(data.Type == 0) {
							//登录失败
							//mui.toast("请登录后再进行操作");
							login();
							setlsData('isLogin', false);
							return;
						} else {
							//逻辑错误
							mui.toast(data.Data);
							return;
						}
					}, function(data) {
						hideLoading();
					});
				} else if(data.Type == 0) {
					//登录失败
					getDatawithToken('User/GetUserSpace', {
						userId: id
					}, function(data) {
						hideLoading();
						if(data.Type == 1) {
							userid = data.Data.UserId;
							userName = data.Data.UserName
							username.innerHTML = data.Data.UserName.substring(0,5);
							document.getElementById("userhead").src = (data.Data.Avatar == '') ? '../img/avatar.jpg' : getImgUrl(data.Data.Avatar);

							coverImg.src = isHasImg(data.Data.Cover) ? getImgUrl(data.Data.Cover) : "../img/minebanner.png";
							switch(data.Data.Gender) {
								case 1:
									gender.className = 'fa fa-male';
									gendername == '我' ? gendername == '我' : gendername = '他';
									break;
								case 2:
									gender.className = 'fa fa-female';
									gendername == '我' ? gendername == '我' : gendername = '她';
									break;
								default:
									gender.className = 'fa fa-male';
									gendername == '我' ? gendername == '我' : gendername = '他';
									break;
							}
							document.getElementById("mynewtil").innerHTML = gendername + '的文章';
							document.getElementById("mythrtil").innerHTML = gendername + '的贴子';
							followerCount.innerHTML = '粉丝 ' + data.Data.FollowerCount;
							followedCount.innerHTML = '关注 ' + data.Data.FollowedCount;
							introduce.innerHTML = data.Data.Introduction;
							rank.innerHTML = data.Data.Rank;
							mywz.querySelector('.text-muted').innerHTML = data.Data.CMSCount;
							mytz.querySelector('.text-muted').innerHTML = data.Data.ThreadCount;
							if(data.Data.CMS && data.Data.CMS.length > 0) {
								userwz.appendChild(createNewsFragment(data.Data.CMS))
							}
							if(data.Data.Threads && data.Data.Threads.length > 0) {
								usertz.appendChild(createFragment(data.Data.Threads))
							}
						} else if(data.Type == 0) {
							//登录失败
							//mui.toast("请登录后再进行操作");
							setlsData('isLogin', false);
							return;
						} else {
							//逻辑错误
							mui.toast(data.Data);
							return;
						}
					}, function(data) {
						hideLoading();
					});
					//mui.toast("请登录后再进行操作");
					setlsData('isLogin', false);
					return;
				} else {
					//逻辑错误
					mui.toast(data.Data);
					return;
				}
			}, function(data) {
				hideLoading();
			});

		}
		document.getElementById("allintroduce").addEventListener('tap', function() {
			introduce.className == "introduce" ? introduce.classList.remove('introduce') : introduce.classList.add('introduce')
			introduce.parentElement.querySelector('.mui-icon-arrowdown') ?
				introduce.parentElement.querySelector('.mui-icon-arrowdown').className = 'mui-icon mui-icon-arrowup' :
				introduce.parentElement.querySelector('.mui-icon-arrowup').className = 'mui-icon mui-icon-arrowdown'
		})
		mywz.addEventListener('tap', function() {
			usernews()
		})

		function usernews() {
			var baseUrl = 'userNews_main.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=' + userName;
			mui.openWindow({
				url: url,
				id: 'userNews_main.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid,
					username: userName
				}
			})
		}
		mytz.addEventListener('tap', function() {
			userthreads()
		})

		function userthreads() {
			var baseUrl = 'userThreads_main.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=' + userName;
			mui.openWindow({
				url: url,
				id: 'userThreads_main.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid,
					username: userName
				}
			})
		}

		followerCount.addEventListener('tap', function() {
			//粉丝
			userFollows('userfollower');
		})
		followedCount.addEventListener('tap', function() {
			//关注
			userFollows('userfollowed')
		})

		function userFollows(type) {
			var baseUrl = 'usersFollows_main.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=' + userName + '&type=' + type;
			mui.openWindow({
				url: url,
				id: 'usersFollows_main.html',
				show: {
					autoShow: true
				},
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: {
					userId: userid,
					username: userName,
					type: type
				}
			})
		}

		mui.plusReady(function() {
			mui("#usertz").on('tap', '.jh-news-list', function(e) {
				var threadId = this.getAttribute("id");
				var baseUrl = 'threadDetail.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html',
					show: {
						autoShow: true
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
						currId: 'userHomepage.html'
					}
				})

			});
			mui("#userwz").on('tap', '.jh-news-list', function(e) {
				var contentItemId = this.getAttribute('id');
				var contentItemType = parseInt(this.getAttribute("title"));
				var urlId = 'newsDetail.html';
				var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
				switch(contentItemType) {
					case 1:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
					case 2:
						urlId = 'videoDetail.html';
						baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
						break;
					case 3:
						urlId = 'imgsDetail.html';
						baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
						break;
					default:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
				}
				var curl = shareUrl + baseUrl;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: baseUrl,
					id: urlId,
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						ContentItemId: contentItemId
					}
				})

			});
		})
		if(!mui.os.plus) {
			mui("#usertz").on('tap', '.jh-news-list', function(e) {
				var threadId = this.getAttribute('id');
				var baseUrl = 'threadDetail.html';
				var url = baseUrl + '?threadId=' + threadId;
				var curl = shareUrl + baseUrl + '?threadId=' + threadId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: url,
					id: 'threadDetail.html'
				});
			});
			mui("#userwz").on('tap', '.jh-news-list', function(e) {
				var contentItemId = this.getAttribute('id');
				var contentItemType = parseInt(this.getAttribute("title"));
				var urlId = 'newsDetail.html';
				var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
				switch(contentItemType) {
					case 1:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
					case 2:
						urlId = 'videoDetail.html';
						baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
						break;
					case 3:
						urlId = 'imgsDetail.html';
						baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
						break;
					default:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
				}
				var curl = shareUrl + baseUrl;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: baseUrl,
					id: urlId
				});
			})
		}

	}
}
/**
 * 关注/粉丝(父)
 */
var userFollows_main = {
	init: function() {
		var userId = 0;
		var username = "";
		var type = '';
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					type = self.type;
					var tilName = (type == 'userfollower') ? '的粉丝' : '的关注';
					var usernames = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = usernames + tilName;
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');
				type = getUrlParam('type');
				var tilName = (type == 'userfollower') ? '的粉丝' : '的关注';
				var usernames = (username == "me") ? "我" : username
				document.getElementById("navtil").innerHTML = usernames + tilName;
			}
			var baseUrl = 'userFollows_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userId + '&type=' + type + '&username=' + username;
			mui.init({
				subpages: [{
					url: url,
					id: 'userFollows_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						userId: userId,
						username: username,
						type: type
					}
				}]

			});

		}
	}
}
/**
 * 关注/粉丝(子)
 */
var userFollows_sub = {
	init: function() {
		mui.init();
		var userId = 0;
		var username = '';
		var type = '';

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
		//B页面onload从服务器获取列表数据；                                                                                                            
		window.onload = function() {
			page = 1;
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.getWebviewById('userFollows_main.html');
					userId = self.userId;
					type = self.type;
					username = self.username;
					loadData(0, userId)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				type = getUrlParam('type');
				username = getUrlParam('username');
				loadData(0, userId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
		var createFragment = function(data) {
			//console.log(JSON.stringify(data));
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			for(var i = 0; i < data.Data.length; i++) {
				var dis = 'none';
				if(username == 'me') {
					dis = 'block';
				} else {
					dis = 'none';
				}
				var btnclass = 'mui-btn-mini';
				var btnTil = '关注';
				var introduction = '';
				var userAvatar = '';
				btnTil = data.Data[i].IsMutualFollowed == true ? "相互关注" : "已关注";
				if(btnTil == "已关注" && data.Data[i].IsFollowed != null) { //mui-btn-mini  mui-btn-primary
					btnclass = (!data.Data[i].IsFollowed) ? 'mui-btn-primary' : 'mui-btn-mini';
					btnTil = (!data.Data[i].IsFollowed) ? '关注' : '取消关注'
				}
				/*if(type == 'userfollowed') {
					btnclass = 'mui-btn-primary';
					btnTil = '取消关注'
				} else {
					btnclass = (!data.Data[i].IsFollowed) ? 'mui-btn-mini' : 'mui-btn-primary';
					btnTil = (!data.Data[i].IsFollowed) ? '关注' : '取消关注'
				}*/
				introduction = data.Data[i].Introduction ? (data.Data[i].Introduction).substring(0, 15) : '';
				userAvatar = data.Data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.id = data.Data[i].UserId;
				li.innerHTML = '<div class="mui-row jh-follow-user">' +
					'							<div class="mui-col-xs-3">' +
					'								<img class="jh-follow-userimg" src=' + userAvatar + '>' +
					'							</div>' +
					'							<div class="mui-col-xs-9">' +
					'								<h4 class="mui-ellipsis" style="word-break:break-all;margin-right:60px;line-height:20px">' + data.Data[i].UserName + '</h4>' +
					'								<p class="text-muted mui-ellipsis" style="margin-right:60px">' + introduction + '</p>' +
					'							</div>' +
					'						</div>' +
					'						<button type="button" class="mui-btn ' + btnclass + '" style="display:' + dis + '" >' +
					'							' + btnTil + '' +
					'						</button>';
				fragment.appendChild(li);
			}
			return fragment;
		};
		var page = 1;

		function loadData(types, id) {
			var table = document.body.querySelector('.mui-table-view');
			switch(types) {
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
			var path = '';
			if(type == 'userfollower') {
				//粉丝
				path = 'User/GetUserFollower';
			}
			if(type == 'userfollowed') {
				//关注
				path = 'User/GetUserFollows';
			}
			params = {
				userId: id,
				pageIndex: page,
			}
			showLoading('', '', '#FFFFFF');
			getData(path, params, function(data) {
				//console.log(JSON.stringify(data));
				hideLoading()
				hideErr()
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						switch(types) {
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
						if(types != 2) {
							showErr(data.Data, '', '#FFFFFF');
						}
						mui.toast(data.Data);
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					mui.toast('暂无更多数据');
					if(types != 2) {
						showErr('暂无更多数据', '', '#FFFFFF');
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
						showErr('没有网络连接', '', '#FFFFFF');
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF');
						hideLoading(1)
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF');
					hideLoading(1)
				}
			})

		}
		mui(".mui-table-view").on('tap', 'img', function(e) {
			var userid = e.target.parentElement.parentElement.parentElement.id;
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
		var btnel;
		mui(".mui-table-view").on('tap', 'button', function(e) {
			btnel = e.target;
			var userid = e.target.parentElement.id;
			showLoading();
			postDatawithToken('User/FollowUserOperation?userId=' + userid, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					//mui.toast(data.Data);
					if(data.Data == '关注成功') {
						mui.toast(data.Data.Message);
						var table = document.body.querySelector('.mui-table-view');
						table.innerHTML = "";
						loadData(1, userId)
						//btnel.innerHTML = '取消关注';
						//btnel.className = 'mui-btn mui-btn-primary'
					} else {
						if(data.Data == "取消关注成功") {
							mui.toast(data.Data);
							var table = document.body.querySelector('.mui-table-view');
							table.innerHTML = "";
							loadData(1, userId)
							//btnel.innerHTML = '关注';
							//btnel.className = 'mui-btn mui-btn-primary'
						} else {
							mui.toast(data.Data.Message);
							var table = document.body.querySelector('.mui-table-view');
							table.innerHTML = "";
							loadData(1, userId)
							//btnel.innerHTML = '相互关注';
							//btnel.className = 'mui-btn mui-btn-mini'
						}
						//var table = document.body.querySelector('.mui-table-view');

						//table.innerHTML ="";
						//loadData(1, userId)
						//btnel.innerHTML = '关注';
						//btnel.className = 'mui-btn mui-btn-mini'
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
				hideLoading()
			});
		})
		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
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
				loadData(1, userId)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, userId)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 * 关注/粉丝(子)
 */
var userFollows = {
	init: function() {
		mui.init();
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					username = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = username + '的收藏';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');
			}
			username = (username == "me") ? "我" : username
			document.getElementById("navtil").innerHTML = username + '的收藏';
		}
	}
}
/**
 * 他人文章
 */
var userNews_main = {
	init: function() {
		var userId = 0;
		var username = "";
		var creatnew = document.getElementById("creatnew");

		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					username = (username == "me") ? "我" : username;
					creatnew.style.display = (username == "我") ? 'block' : 'none';
					document.getElementById("navtil").innerHTML = username + '的文章';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');

			}
			username = (username == "me") ? "我" : username
			creatnew.style.display = (username == "我") ? "block" : "none"
			document.getElementById("navtil").innerHTML = username + '的文章';
			var baseUrl = 'userNews_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userId;
			mui.init({
				subpages: [{
					url: url,
					id: 'userNews_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						userId: userId
					}
				}]

			});
			creatnew.addEventListener('tap', function() {
				mui.openWindow({
					url: 'creatNew.html',
					id: 'creatNew.html',
					show: {
						autoShow: false
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					}
				})
			})

		}

	}
}
var userNews_sub = {
	init: function() {
		var userId = 0;

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
		//B页面onload从服务器获取列表数据；                                                                                                            
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.getWebviewById('userNews_main.html');
					userId = self.userId;
					loadData(0, userId)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				loadData(0, userId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
		var createFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			var userAvatar = "";
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				var imgUrl = '';
				if(data[i].FeaturedImage.length > 0) {
					dis = 'block'
					imgUrl = getImgUrl(data[i].FeaturedImage);
				} else {
					if(data[i].ContentModel == 3) {
						//组图
						if(data[i].FirstImage) {
							dis = 'block'
							imgUrl = getImgUrl(data[i].FirstImage);
						} else {
							dis = 'none'
						}
					} else {
						dis = 'none'
					}

				}
				userAvatar = data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data[i].ContentItemId;
				li.title = data[i].ContentModel;
				li.innerHTML = '<div class="divImg" style="display:' + dis + ';padding: 5px 0 5px 0"><img style="display:' + dis + '" src=' + imgUrl + '  ></div>' +
					'										<h5 class="listTitle">' + data[i].Subject + '</h5>' +
					'										<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
					'											<li>' + data[i].Author + '</li>' +
					'											<li>' + data[i].DatePublished + '</li>' +
					'										</ul>' +
					'	<div class="jh-itemBottm-right text-muted">' +
					'											<li class="mui-pull-right" style="float:left"><i class="fa fa-thumbs-up" aria-hidden="true">&nbsp;' + data[i].Attitude + '</i></li>' +
					'											<li class="mui-pull-right" style="float:right"><i class="fa fa-commenting" aria-hidden="true">&nbsp;' + data[i].CommentCount + '</i></li>' +
					'</div>';
				fragment.appendChild(li);
			}
			return fragment;
		};
		var page = 1;

		function loadData(type, id) {
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
				userId: id,
				pageIndex: page,
			}
			if(type != 2) {
				showLoading('', '', '#FFFFFF');
			}
			getDatawithToken('User/GetUserContentItems', params, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data.length > 0) {
							switch(type) {
								case 0:
									{
										table.innerHTML = "";
										table.appendChild(createFragment(data.Data));
									}
									break;
								case 1:
									{
										table.innerHTML = "";
										table.appendChild(createFragment(data.Data));
									}
									break;
								case 2:
									{
										table.appendChild(createFragment(data.Data));
									}
									break;
								default:
									break;
							}
						}

					} else {
						if(type != 2) {
							showErr(data.Data, '', '#FFFFFF', '0');
						}
						mui.toast(data.Data);
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					//mui.toast('暂无更多数据');
					if(type != 2) {
						showErr(data.Data, '', '#FFFFFF', '0');
					}
					mui.toast(data.Data);
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading()
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '0');
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '0');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '0');
					hideLoading()
				}
			})

		}

		mui.plusReady(function() {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var contentItemId = this.getAttribute('id');
				var contentItemType = parseInt(this.getAttribute("title"));
				var urlId = 'newsDetail.html';
				var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
				switch(contentItemType) {
					case 1:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
					case 2:
						urlId = 'videoDetail.html';
						baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
						break;
					case 3:
						urlId = 'imgsDetail.html';
						baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
						break;
					default:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
				}
				var curl = shareUrl + baseUrl;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: baseUrl,
					id: urlId,
					show: {
						autoShow: true
					},
					waiting: {
						options: {
							loading: {
								height: '35px'
							}
						}
					},
					extras: {
						ContentItemId: contentItemId
					}
				})

			});
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var contentItemId = this.getAttribute('id');
				var contentItemType = parseInt(this.getAttribute("title"));
				var urlId = 'newsDetail.html';
				var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
				switch(contentItemType) {
					case 1:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
					case 2:
						urlId = 'videoDetail.html';
						baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
						break;
					case 3:
						urlId = 'imgsDetail.html';
						baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
						break;
					default:
						urlId = 'newsDetail.html';
						baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
						break;
				}
				var curl = shareUrl + baseUrl;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: baseUrl,
					id: urlId
				});
			})
		}

		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
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
				loadData(1, userId)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, userId)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 * 通知列表
 */
var userNotice_main = {
	init: function() {
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					//					userId = self.userId;
					//					username=self.username
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				//				userId = getUrlParam('userId');
				//				username=getUrlParam('username');
			}
			var baseUrl = 'userNotice_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userId;
			mui.init({
				subpages: [{
					url: url,
					id: 'userNotice_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						userId: userId
					}
				}]

			});

		}
	}
}
var userNotice_sub = {
	init: function() {
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
		//B页面onload从服务器获取列表数据；                                                                                                            
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					loadData(0)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				loadData(0)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
		var createFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			for(var i = 0; i < data.length; i++) {
				var body = data[i].Body.length != 0 ? data[i].Body : '暂无内容';
				li = document.createElement('li');
				li.className = 'mui-table-view-cell jh-news-list';
				li.id = data[i].RelativeObjectId;
				li.title = data[i].NoticeTypeKey;
				li.name = data[i].ReceiverId;
				li.innerHTML = '<div class="mui-slider-right mui-disabled" id=' + data[i].Id + '>' +
					'							<a class="mui-btn mui-btn-grey" id="deleteNotice">删除</a>' +
					'							<a class="mui-btn mui-btn-yellow" id="setIsHandled">知道了</a>' +
					'						</div>' +
					'						<div class="mui-slider-handle" id=' + data[i].Id + '>' +
					'							<h5 class="NlistTitle">' + body + '</h5>' +
					'							<ul class="mui-list-inline text-muted">' +
					'								<li>' + data[i].DateCreated + '</li>' +
					'							</ul>' +
					'						</div>';
				fragment.appendChild(li);
			}
			return fragment;
		};
		var page = 1;
		getDatawithToken('User/GetCurrentUser', {}, function(data) {
			if(data.Type == 1) {
				setlsData('isLogin', true);
				var user = data.Data;

			} else if(data.Type == 0) {
				//登录失败

				setlsData('isLogin', false);
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(data) {
			if(!mui.os.plus) {
				if(data == 'abort') {
					window.location.reload();
				} else {
					errFun(type);
				}
			} else {
				errFun(type);
			}
			hideLoading();
		});

		function loadData(type) {
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
			if(type != 2) {
				showLoading();
			}
			getDatawithToken('User/GetMyNotice?pageIndex=' + page, {}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data.NoticeList && typeof(data.Data.NoticeList) == 'object') {
						if(data.Data.NoticeList.length != 0) {
							switch(type) {
								case 0:
									{
										table.innerHTML = "";
										table.appendChild(createFragment(data.Data.NoticeList));
									}
									break;
								case 1:
									{
										table.innerHTML = "";
										table.appendChild(createFragment(data.Data.NoticeList));
									}
									break;
								case 2:
									{
										table.appendChild(createFragment(data.Data.NoticeList));
									}
									break;
								default:
									break;
							}
						} else {
							if(type != 2) {
								showErr('暂无更多数据', '', '#FFFFFF');
							}
							mui.toast('暂无更多数据');
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						}

					} else {
						if(types != 2) {
							showErr(data.Data, '', '#FFFFFF');
						}
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					if(types != 2) {
						showErr('暂无更多数据', '', '#FFFFFF');
					}
					mui.toast(data.Data);
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading();
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF');
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
		mui('#notices').on('tap', '.mui-btn', function(e) {
			var noticeId = e.target.parentElement.getAttribute('id');
			var type = this.getAttribute('id');
			switch(type) {
				case 'deleteNotice': //删除
					{
						deleteNotice(noticeId)
					}
					break;
				case 'setIsHandled': //接受
					{
						setIsHandled(noticeId, 2)
					}
					break;
				default:
					break;
			}
		})
		mui('#notices').on('tap', '.mui-table-view-cell', function(e) {
			var objId = this.getAttribute('id');
			var objType = this.getAttribute('title');
			var userid = document.getElementById(objId).name;
			setIsHandled(e.target.parentElement.getAttribute('id'), 2);
			switch(objType) {
				case 'NewThreadReply':
					var baseUrl = 'threadDetail.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + objId;
					var curl = shareUrl + baseUrl + '?threadId=' + objId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: baseUrl,
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
							threadId: objId,
							currId: 'home.html'
						}
					})
					break;
				case 'NewArticleReply':
				case 'NewCMSReply':
					urlId = 'newsDetail.html';
					baseUrl = 'newsDetail.html?ContentItemId=' + objId;
					newsDetail(urlId, baseUrl, objId);
					break;
				case 'NewVideoReply':
					urlId = 'videoDetail.html';
					baseUrl = 'videoDetail.html?ContentItemId=' + objId;
					newsDetail(urlId, baseUrl, objId);
					break;
				case 'NewImageReply':
					urlId = 'imgsDetail.html';
					baseUrl = 'imgsDetail.html?ContentItemId=' + objId;
					newsDetail(urlId, baseUrl, objId);
					break;
				case 'ThreadApproved':
				case 'ThreadDisApproved':
					var baseUrl = 'myThreads.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me';
					userNewsandThread(baseUrl, url, userid)
					break;
				case 'CMSArticleApproved':
				case 'CMSArticleDisApproved':
					var baseUrl = 'myNews.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me';
					userNewsandThread(baseUrl, url, userid)
					break;
				case 'FollowUser':
					var baseUrl = 'userFollows_main.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me&type=userfollower';
					mui.openWindow({
						url: url,
						id: 'userFollows_main.html',
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
							userId: userid,
							username: 'me',
							type: 'userfollower'
						}
					})
					break;
				case 'NewComment':
					var baseUrl = 'userComments.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + objId + '&username=me';
					mui.openWindow({
						url: url,
						id: 'userComments.html',
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
							userId: objId,
							username: 'me'
						}
					})
					break;
				case 'NewAnswer':
				case 'NewAskQuestionComment':
				case 'NewAskAnswerComment':
				case 'NewAskComment':
				case 'SetBestAnswer':
				case 'AskQuestionApproved':
				case 'AskAnswerApproved':
				case 'AskUser':
					var questionId = objId;
					var baseUrl = 'question-solved.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
					var curl = shareUrl + baseUrl + '?questionId=' + questionId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: url,
						id: 'question-solved.html',
						show: {
							autoShow: true
						},
						waiting: {
							options: {
								loading: {
									height: '35px'
								}
							}
						},
						extras: {
							questionId: questionId,
							tabIndex: 0,
							type: 'ask',
							currId: 'question-solved.html'
						}
					})
					break;
				default:

					break;
			}
					
				

		})

		function newsDetail(urlId, baseUrl, id) {
			debugger
			var curl = shareUrl + baseUrl;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: baseUrl,
				id: urlId,
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
					ContentItemId: id
				}
			})
		}

		function userNewsandThread(urlId, baseUrl, id) {
			mui.openWindow({
				url: baseUrl,
				id: urlId,
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
					userId: id,
					username: 'me'
				}
			})
		}

		function deleteNotice(noticeId) {
			showLoading();
			postDatawithToken('User/DeleteNotice?noticeId=' + noticeId, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					loadData(0);
					changeNum();
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
				hideLoading()
			});
		}

		function setIsHandled(noticeid, noticeType) {
			showLoading();
			postDatawithToken('User/SetIsHandled?noticeId=' + noticeid + '&type=' + noticeType, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					loadData(0);
					changeNum();
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
				hideLoading()
			});
		}

		function changeNum() {
			if(mui.os.plus) {
				var homePage = plus.webview.getWebviewById('mine.html');
				var mainPage = plus.webview.getWebviewById('main');
				var sysPage = plus.webview.getWebviewById('sysetting.html');
				mainPage && mainPage.evalJS("getNoticeNum()");
				homePage && homePage.evalJS('getNoticeNum()');
				sysPage && sysPage.evalJS('getNoticeNum()');
			} else {

			}
		}
		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
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
				loadData(1)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
var usersFollows_main = {
	init: function() {
		var userId = 0;
		var username = "";
		var type = '';
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					type = self.type;
					var tilName = (type == 'userfollower') ? '的粉丝' : '的关注';
					var usernames = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = usernames + tilName;
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');
				type = getUrlParam('type');
				var tilName = (type == 'userfollower') ? '的粉丝' : '的关注 ';
				var usernames = (username == "me") ? "我" : username
				document.getElementById("navtil").innerHTML = usernames + tilName;
			}
			var baseUrl = 'usersFollows_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userId + '&type=' + type + '&username=' + username;
			mui.init({
				subpages: [{
					url: url,
					id: 'usersFollows_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						userId: userId,
						username: username,
						type: type
					}
				}]
			});　

		}
	}
}
var usersFollows_sub = {
	init: function() {
		mui.init();
		var userId = 0;
		var username = '';
		var type = '';

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
		//B页面onload从服务器获取列表数据；                                                                                                            
		window.onload = function() {
			page = 1;
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.getWebviewById('usersFollows_main.html');
					userId = self.userId;
					type = self.type;
					username = self.username;
					loadData(0, userId)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				type = getUrlParam('type');
				username = getUrlParam('username');
				loadData(0, userId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}
		}
		var createFragment = function(data) {
			var fragment = document.createDocumentFragment();
			var li;
			var child;
			for(var i = 0; i < data.Data.length; i++) {
				var dis = 'none';
				if(username == 'me') {
					dis = 'block';
				} else {
					dis = 'none';
				}
				var btnclass = 'mui-btn-mini';
				var btnTil = '关注';
				var introduction = '';
				var userAvatar = '';
				if(type == 'userfollowed') {
					btnclass = 'mui-btn-primary';
					btnTil = '取消关注'
				} else {
					btnclass = (!data.Data[i].IsFollowed) ? 'mui-btn-mini' : 'mui-btn-primary';
					btnTil = (!data.Data[i].IsFollowed) ? '关注' : '取消关注'
				}
				introduction = data.Data[i].Introduction ? (data.Data[i].Introduction).substring(0, 15) : '';
				userAvatar = data.Data[i].Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Data[i].Avatar);
				li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.id = data.Data[i].UserId;
				li.innerHTML = '<div class="mui-row jh-follow-user">' +
					'							<div class="mui-col-xs-3">' +
					'								<img class="jh-follow-userimg" src=' + userAvatar + '>' +
					'							</div>' +
					'							<div class="mui-col-xs-9">' +
					'								<h4 class="mui-ellipsis" style="word-break:break-all;margin-right:60px;line-height:20px">' + data.Data[i].UserName + '</h4>' +
					'								<p class="text-muted mui-ellipsis" style="margin-right:60px">' + introduction + '</p>' +
					'							</div>' +
					'						</div>' +
					'						<button type="button" class="mui-btn ' + btnclass + '" style="display:' + dis + '" >' +
					'							' + btnTil + '' +
					'						</button>';
				fragment.appendChild(li);
			}
			return fragment;
		};
		var page = 1;

		function loadData(types, id) {
			var table = document.body.querySelector('.mui-table-view');
			switch(types) {
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
			var path = '';
			if(type == 'userfollower') {
				//粉丝
				path = 'User/GetUserFollower';
			}
			if(type == 'userfollowed') {
				//关注
				path = 'User/GetUserFollows';
			}
			params = {
				userId: id,
				pageIndex: page,
			}
			if(type != 2) {
				showLoading('', '', '#FFFFFF');
			}
			getData(path, params, function(data) {　　　
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						switch(types) {
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
						if(types != 2) {
							showErr(data.Data, '', '#FFFFFF');
						}
						mui.toast(data.Data);
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					if(types != 2) {
						showErr(data.Data, '', '#FFFFFF');
					}
					mui.toast(data.Data);
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading();
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF');
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF');
						hideLoading(1)
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF');
					hideLoading(1)
				}
			})

		}
		mui(".mui-table-view").on('tap', 'img', function(e) {
			var userid = e.target.parentElement.parentElement.parentElement.id;
			var baseUrl = 'userHomepage.html';
			var url = baseUrl + '?userId=' + userid;
			mui.openWindow({
				url: url,
				id: 'userHomepage',
				show: {
					autoShow: true
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
		var btnel;
		mui(".mui-table-view").on('tap', 'button', function(e) {
			btnel = e.target;
			var userid = e.target.parentElement.id;
			showLoading();
			postDatawithToken('User/FollowUserOperation?userId=' + userid, {}, function(data) {
				hideLoading();
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(data.Data == '关注成功') {
						btnel.innerHTML = '取消关注';
						btnel.className = 'mui-btn mui-btn-primary'
					} else {
						btnel.innerHTML = '关注';
						btnel.className = 'mui-btn mui-btn-mini'
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
				hideLoading()
			});
		})
		mui.init({
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
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
				loadData(1, userId)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, userId)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 * 他人帖子
 */
var userThreads_main = {
	init: function() {
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					username = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = username + '的贴子';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');

			}
			username = (username == "me") ? "我" : username
			document.getElementById("navtil").innerHTML = username + '的贴子';
			var baseUrl = 'userThreads_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userId;
			mui.init({
				subpages: [{
					url: url,
					id: 'userThreads_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						userId: userId
					}
				}]

			});

		}
	}
}
var userThreads_sub = {
	init: function() {
		var userId = 0;

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
		//B页面onload从服务器获取列表数据；                                                                                                            
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.getWebviewById('userThreads_main.html');
					userId = self.userId;
					loadData(0, userId)
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				loadData(0, userId)
			}
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

		function loadData(type, id) {
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
				userId: id,
				pageIndex: page,
			}
			if(type != 2) {
				showLoading('', '', '#FFFFFF');
			}
			getDatawithToken('User/GetUserThreads', params, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
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
						if(type != 2) {
							showErr(data.Data, '', '#FFFFFF', '0');
						}
						mui.toast(data.Data);
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}

				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					login();
					return;
				} else {
					//逻辑错误
					showErr(data.Data, '', '#FFFFFF', '0');
					mui.toast(data.Data);
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					return;
				}
			}, function(err) {
				hideLoading()
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#FFFFFF', '0');
					} else {
						showErr('错误代码：' + err, '', '#FFFFFF', '0');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '0');
					hideLoading()
				}
			})

		}

		mui.plusReady(function() {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute('id');
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
						currId: 'userThreads_main.html'
					}
				})

			})
		})
		if(!mui.os.plus) {
			mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
				var threadId = this.getAttribute('id');
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
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
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
				loadData(1, userId)
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
			}, 1500);

		}

		function upFresh() {
			setTimeout(function() {
				loadData(2, userId)
				mui('#refreshContainer').pullRefresh().endPullupToRefresh();
			}, 1500);

		}
	}
}
/**
 * 设置
 */
if(pageUrl == 'sysetting.html') {}
/**
 * 个人资料
 */
if(pageUrl == 'personalData.html') {
	mui.init({
		beforeback: function() {
			if(mui.os.plus) {
				var wobj = plus.webview.getWebviewById('mine.html');
				wobj.reload(true);
				return true;
			} else {
				return true;
			}
		}
	});
	creatloadingEL();
	if(mui.os.wechat) {
		initWx();
		wx.ready(function() {
			wx.checkJsApi({
				jsApiList: ['chooseImage', 'uploadImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
				success: function(res) {
					// 以键值对的形式返回，可用的api值true，不可用为false
					// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
				}
			});
		});
		wx.error(function(res) {

		});
	}

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
	var userAvatar = document.getElementById("userhead");
	$("#file").on('change', function() {
		var iMaxFilesize = 2097152; //2M
		var oFile = document.getElementById('file').files[0]; //读取文件 
		if(oFile) {
			var reader = new FileReader();
			reader.onload = function() {
				appendFileFeaturedTouch('User/UpdateAvatar', 0, reader.result, function() {
					location.reload()
				}, oFile.name)
			}
		}
		reader.readAsDataURL(oFile);
	})

	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}

	function plusReady() {

	}
	document.getElementById('userNamecell').addEventListener('tap', function(e) {
		
		settingDetails('userName', document.getElementById("userName").innerHTML)
	});
	document.getElementById('accountMobilecell').addEventListener('tap', function(e) {
		settingDetails('accountMobile', document.getElementById("accountMobile").innerHTML)
	});
	document.getElementById('accountEmailcell').addEventListener('tap', function(e) {
		settingDetails('accountEmail', document.getElementById("accountEmail").innerHTML)
	});
	document.getElementById('introductioncell').addEventListener('tap', function(e) {
		settingDetails('introduction', allintroduction)
	});
	document.getElementById('truenamecell').addEventListener('tap', function(e) {
		settingDetails('truename', document.getElementById("truename").innerHTML)
	});
	//		mui(".mui-table-view-cell").on("tap", "#accountMobile", function(e) {
	//			settingDetail('accountMobile', document.getElementById("accountMobile").innerHTML)
	//		});
	//		mui(".mui-table-view-cell").on("tap", "#accountEmail", function(e) {
	//			settingDetail('accountEmail', document.getElementById("accountEmail").innerHTML)
	//		});
	//		mui(".mui-table-view-cell").on("tap", "#introduction", function(e) {
	//			settingDetail('introduction', allintroduction)
	//		});
	//		mui(".mui-table-view-cell").on("tap", "#truename", function(e) {
	//			settingDetail('truename', document.getElementById("truename").innerHTML)
	//		});
	//		mui(".mui-table-view-cell").on("tap", "#userName", function(e) {
	//			settingDetail('userName', document.getElementById("userName").innerHTML)
	//		});

	function settingDetails(type, value) {
		var baseUrl = 'settingDetail.html';
		if(type == 'accountEmail' || type == 'accountMobile') {
			baseUrl = 'setPhonemail.html'
		}
		var url = mui.os.plus ? baseUrl : baseUrl + '?type=' + type + '&value=' + value;
		if(mui.os.wechat && mui.os.ios) {
			if(document.getElementById("settingDetailif")) {
				document.getElementById("settingDetailif").src = url;
				document.getElementById("settingDetailif").style.display = 'inherit'
			} else {
				var iframe = document.createElement('iframe');
				iframe.id = 'settingDetailif';
				iframe.style.height = '100%';
				iframe.style.width = '100%';
				iframe.style.position = 'absolute';
				iframe.style.zIndex = '999';
				iframe.style.border = 'none';
				iframe.style.top = '0';
				iframe.src = url;
				document.body.appendChild(iframe);
			}
		} else {
			mui.openWindow({
				url: url,
				id: baseUrl,
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
					type: type,
					value: value
				}
			})
		}

	}
	//弹出菜单 
	document.getElementById("userheadcell").addEventListener('tap', function(e) {
		if(mui.os.plus) {
			changeAvator()
		} else if(mui.os.wechat) {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					userAvatar.src = localIds[0];
					wx.uploadImage({
						localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function(res) {
							var serverId = res.serverId; // 返回图片的服务器端ID
							postDatawithToken('User/WeChatUpdateAvatar?localId=' + serverId, {}, function(data) {
								userAvatar.src = localIds[0];
								mui.toast(data.Data)
							}, function(data) {
								alert(data)
							});
						}
					});
				}
			});
		} else {
			$("#file").click();
		}
	})

	function changeAvator() {
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}, {
				title: "取消"
			}];
			plus.nativeUI.actionSheet({
				title: "修改头像",
				buttons: a
			}, function(b) {
				switch(b.index) {
					case 0:
						break;
					case 1:
						getImage('/User/UpdateAvatar', function(e) {
							userAvatar.src = e;
						});
						break;
					case 2:
						galleryImg('/User/UpdateAvatar', function(e) {
							userAvatar.src = e;
						});
						break;
					default:
						break
				}
			})
		}
	}

	window.onload = function() {
		files = [];
		//获取url中的targetId参数
		if(mui.os.plus) {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview()
				//关闭等待框
				plus.nativeUI.closeWaiting();
				//显示当前页面
				mui.currentWebview.show();
			});
		} else {

		}
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}

	}
	var userName = document.getElementById("userName");
	var accountMobile = document.getElementById("accountMobile");
	var accountEmail = document.getElementById("accountEmail");
	var truename = document.getElementById("truename");
	var gender = document.getElementById("gender");
	var areaName = document.getElementById("areaName");
	var introduction = document.getElementById("introduction");
	var genders = "";
	var areaCodes = "";
	var allintroduction = "";

	function getUserProfile() {
		showLoading();
		getDatawithToken('User/GetUserProfile', {}, function(data) {
			hideLoading()
			if(data.Type == 1) {
				var data = data.Data;
				switch(data.Gender) {
					case 1:
						genders = "男";
						break;
					case 2:
						genders = "女";
						break;
					default:
						genders = "";
						break;
				}
				userAvatar.src = (data.Avatar == '') ? '../img/avatar.jpg' : getImgUrl(data.Avatar);
				changeStatus(data.UserName, userName);
				changeStatus(data.AccountMobile, accountMobile);
				changeStatus(data.AccountEmail, accountEmail);
				changeStatus(data.TrueName, truename);
				changeStatus(genders, gender);
				changeStatus(data.AreaName, areaName);
				changeStatus(data.Introduction && data.Introduction.substring(0, 15), introduction);
				allintroduction = data.Introduction && data.Introduction;
				areaCodes = data.AreaCode;
				var codes = areaCodes.split(';');
				for(var i = 0; i < codes.length; i++) {
					cityPicker.pickers[i].setSelectedValue(codes[i])
				}
			} else if(data.Type == 0) {
				//登录失败
				mui.toast("请登录后再进行操作");
				setlsData('isLogin', false);
				login();
				return;
			} else {
				//逻辑错误
				mui.toast(data.Data);
				return;
			}
		}, function(data) {
			hideLoading()
		});
	}
	getUserProfile();

	function changeStatus(value, id) {
		if(!isEmpty(value)) {
			id.innerHTML = value;
			id.classList && id.classList.add('mui-confirm')
		} else {
			id.innerHTML = '未填写';
			id.classList && id.classList.remove('mui-confirm')
		}
	}
	document.getElementById("gender_btn").addEventListener('tap', function() {
		mui('#selgender').popover('toggle');
	})
	var cityPicker = new mui.PopPicker({
		layer: 3
	});
	cityPicker.setData(cityData);
	document.getElementById("area_btn").addEventListener('tap', function(event) {
		cityPicker.show(function(items) {
			var areaname = "";
			for(var i = 0; i < items.length; i++) {
				if(!isEmpty(items[i])) {
					areaname += (items[i].text) + '-';
				}
			}
			changeStatus(areaname.substring(0, areaname.length - 1), areaName)
			postDatawithToken('User/UpdateAddress?areaCode=' + items[items.length - 1].value, {}, function(data) {
				if(data.Type == 1) {
					var data = data.Data;
					mui.toast(data);
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

			});

		});
	}, false);
	for(var i = 0; i < document.querySelectorAll('.mui-poppicker-btn-ok').length; i++) {
		document.querySelectorAll('.mui-poppicker-btn-ok')[i].style.backgroundColor = '#dd524d';
		document.querySelectorAll('.mui-poppicker-btn-ok')[i].style.borderColor = '#dd524d'
	}
	mui("#selgender").on('tap', '.mui-table-view-cell', function(e) {
		var text = e.target.innerText;
		var id = e.target.parentElement.id;
		if(id != "0") {
			mui('#selgender').popover('toggle');
		}
		changeStatus(text, gender)
		postDatawithToken('User/UpdateGender?type=' + id, {}, function(data) {
			if(data.Type == 1) {
				var data = data.Data;
				mui.toast(data);
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

		});

	})
	if(mui.os.wechat && mui.os.ios) {
		pushHistory();

		function pushHistory() {
			window.addEventListener("popstate", function(e) {
				var settingDetail = document.getElementById("settingDetailif");
				if(settingDetail == null) {
					window.history.go(-1);
				} else {
					if(document.getElementById("settingDetailif").style.display != 'none') {
						document.getElementById("settingDetailif").style.display = 'none';
					} else {
						window.history.go(-1);
					}
				}
			}, false);
			var state = {
				title: "",
				url: "#"
			};
			if(window.history.state != state) {
				window.history.pushState(state, "", "#");
			}
		};
	}

}

var settingDetail = {
	init: function() {
		var type = "";
		var value = "";
		var msg = "";
		var navtil = document.getElementById("navtil");
		var title = document.getElementById("title");
		var introductionval = document.getElementById("introductionval");
		var confirmBtn = document.getElementById("confirmBtn");
		//		pushHistory();
		//		function pushHistory(){
		//		window.addEventListener("popstate", function(e){
		//		    alert("回退！");
		//			parent.document.getElementById('settingDetail').style.display='none'
		//		//      //window.history.back();
		//		//      //在历史记录中后退,这就像用户点击浏览器的后退按钮一样。
		//		//
		//		//      //window.history.go(-1);
		//		//      //你可以使用go()方法从当前会话的历史记录中加载页面（当前页面位置索引值为0，上一页就是-1，下一页为1）。
		//		//
		//		//      self.location=document.referrer;
		//		//      //可以获取前一页面的URL地址的方法,并返回上一页。
		//		    }, false); 
		//		  var state = {
		//		      title:"",
		//		      url: "#"
		//		  }; 
		//		  window.history.replaceState(state, "", "#"); 
		//		};
		if(mui.os.wechat && mui.os.ios) {
			mui.back = function() {
				parent.document.getElementById('settingDetailif').style.display = 'none'
			}
		}

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
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					type = self.type;
					value = self.value;
					setType(type, value)
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				type = getUrlParam('type');
				value = getUrlParam('value');
				setType(type, value)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}

		function setType(type, value) {
			switch(type) {
				case 'userName':
					document.getElementById("nomCantainer").style.display = 'block';
					navtil.innerHTML = '设置昵称';
					title.placeholder = '用户昵称';
					title.value = value == '未填写' ? '' : value;
					break;
				case 'truename':
					document.getElementById("nomCantainer").style.display = 'block';
					navtil.innerHTML = '真实姓名';
					title.placeholder = '真实姓名';
					title.value = value == '未填写' ? '' : value;
					break;
				case 'introduction':
					document.getElementById("introductionval").style.display = 'block';
					navtil.innerHTML = '自我介绍';
					introductionval.value = value == '未填写' ? '自我介绍' : value;
					break;
				default:
					break;
			}
		}
		confirmBtn.addEventListener('tap', function() {
			document.activeElement.blur();
			var name = TrimAll(title.value);
			if(type == 'introduction') {
				name = TrimAll(introductionval.value);
				title.placeholder = '自我介绍';
			}
			if(name == "") {
				mui.toast(title.placeholder + "不能为空")
				return
			}
			var params = {};
			var path = '';
			if(type == 'userName') {
				path = 'User/UpdateUserName?userName=' + name;
				params = {}
			}
			if(type == 'truename') {
				path = 'User/UpdateTrueName?trueName=' + name;
				params = {}
			}
			if(type == 'introduction') {
				path = 'User/UpdateIntroduction?introduction=' + name;
				params = {}
			}

			var _this = this;
			mui('#confirmBtn').button('loading'); //切换为loading状态
			postDatawithToken(path, params, function(data) {
				mui('#confirmBtn').button('reset');
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						var wobj = plus.webview.getWebviewById('personalData.html');
						wobj.reload(true);
						setTimeout(function() {
							mui.back();
						}, 800)
					} else {
						if(mui.os.wechat && mui.os.ios) {
							parent.location.reload();
							parent.document.getElementById('settingDetailif').style.display = 'none'
						} else {
							window.history.go(-1);
						}

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
				mui('#confirmBtn').button('reset');
			});

		});
	}
}
var setPhonemail = {
	init: function() {
		var confirmBtn = document.getElementById('confirmBtn'); //完成按钮
		var codeBtn = document.getElementById('codeBtn'); //获取验证码按钮
		var code = document.getElementById('code'); //验证码文本框
		var emailMsg = document.getElementById("emailMsg"); //邮箱验证码提示语
		var phonereg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //判断手机号的正则
		var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/; //判断邮箱的正则
		var type = "";
		var value = "";
		var navtil = document.getElementById("navtil");
		var title = document.getElementById("title");

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
		if(mui.os.wechat && mui.os.ios) {
			mui.back = function() {
				parent.document.getElementById('settingDetailif').style.display = 'none'
			}
		}
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					type = self.type;
					value = self.value;
					setType(type, value);
					//关闭等待框
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				type = getUrlParam('type');
				value = getUrlParam('value');
				setType(type, value)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}

		function setType(type, value) {
			switch(type) {
				case 'accountEmail':
					navtil.innerHTML = '邮箱';
					title.placeholder = '邮箱号';
					title.value = value == '未填写' ? '' : value;
					break;
				case 'accountMobile':
					navtil.innerHTML = '手机号';
					title.placeholder = '手机号';
					title.value = value == '未填写' ? '' : value;
					break;
				default:
					break;
			}
		}

		var timer;
		//获取验证码函数
		function countdown(s, sendObj) {
			if(s == 0) {
				sendObj.innerHTML = '重新获取';
				sendObj.removeAttribute("disabled");
				window.clearTimeout(timer);
			} else {
				sendObj.innerHTML = s + '秒后重新获取';
				sendObj.setAttribute("disabled", "disabled");
				s--;
				timer = window.setTimeout(function() {
					countdown(s, sendObj)
				}, 1000)
			}
		}
		codeBtn.addEventListener('tap', function() {
			var username = TrimAll(title.value);
			if(username == "") {
				mui.toast(title.placeholder + "不能为空")
				return
			}
			if(phonereg.test(username)) {
				emailMsg.style.display = "none";
			}
			if(emailreg.test(username)) {
				emailMsg.style.display = "block";
			}
			countdown(60, codeBtn);
			var params = {
				bindName: username,
				isMobile: (type == 'accountEmail') ? false : true
			};
			getDatawithToken('User/GetUpdateValidateCode', params, function(data) {
				if(data.Type == 1) {
					mui.toast(data.Data);
				} else if(data.Type == 0) {
					//登录失败
				} else {
					//逻辑错误
					mui.toast(data.Data);
				}
			}, function() {
				closeWaiting(waiting)
			})
		})
		confirmBtn.addEventListener('tap', function() {
			var name = TrimAll(title.value);
			var phonecode = TrimAll(code.value);
			if(name == "") {
				mui.toast(title.placeholder + "不能为空")
				return
			}
			if(phonecode == "") {
				mui.toast("验证码不能为空")
				return
			}
			var params = {};
			var path = '';
			if(type == 'accountEmail') {
				path = 'User/UpdateAccountEmail';
				params = {
					Email: name,
					ValidateCode: phonecode
				}
			} else {
				path = 'User/UpdateAccountMobile';
				params = {
					Mobile: name,
					ValidateCode: phonecode
				}
			}
			var _this = this;
			mui('#confirmBtn').button('loading'); //切换为loading状态
			postDatawithToken(path, params, function(data) {
				mui('#confirmBtn').button('reset');
				if(data.Type == 1) {
					mui.toast(data.Data);
					if(mui.os.plus) {
						var wobj = plus.webview.getWebviewById('personalData.html');
						wobj.reload(true);
						setTimeout(function() {
							mui.back();
						}, 800)
					} else {
						if(mui.os.wechat && mui.os.ios) {
							parent.location.reload();
							parent.document.getElementById('settingDetailif').style.display = 'none'
						} else {
							window.history.go(-1);
						}
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
				mui(_this).button('reset');
			});

		});
	}
}
/**
 * 修改密码
 */
var update_password = {
	init: function() {
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
		var confirmBtn = document.getElementById('confirmBtn'); //确定按钮
		var oldpas = document.getElementById('oldpas');
		var newpas = document.getElementById('newpas');
		var confirmpas = document.getElementById('confirmpas');

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

		function Verification(variable) {
			var reg = /^[A-Za-z0-9]+$/;
			if(!reg.test(variable) || variable.length < 6 || variable.length > 12) {
				return false;
			} else {
				return true;
			}
		}
		confirmBtn.addEventListener('tap', function() {
			var oldpass = TrimAll(oldpas.value);
			var newpass = TrimAll(newpas.value);
			var confirmpass = TrimAll(confirmpas.value);
			if(oldpass == "") {
				mui.toast("原密码不能为空")
				return
			}
			if(newpass == "") {
				mui.toast("新密码不能为空")
				return
			}
			if(confirmpass != newpass) {
				mui.toast("两次输入的密码不一致，请重新输入")
				return
			}
			if(!Verification(oldpass) || !Verification(newpass) || !Verification(confirmpass)) {
				mui.toast('密码必须为6-12位的数字和字母的组合');
				return
			}
			var params = {
				OldPassword: oldpass,
				Password: newpass,
				configPassword: confirmpass
			};
			showLoading();
			var _this = this;
			mui('#confirmBtn').button('loading'); //切换为loading状态
			postDatawithToken('User/UpdatePassword', params, function(data) {
				mui('#confirmBtn').button('reset');
				hideLoading()
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
			}, function(data) {
				mui('#confirmBtn').button('reset');
				hideLoading()
			});

		});
	}
}
/**
 * 收藏
 */
var userCollections = {
	init: function() {
		var userId = 0;
		var username = "";
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					userId = self.userId;
					username = self.username;
					username = (username == "me") ? "我" : username
					document.getElementById("navtil").innerHTML = username + '的收藏';
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				userId = getUrlParam('userId');
				username = getUrlParam('username');
			}
			username = (username == "me") ? "我" : username
			document.getElementById("navtil").innerHTML = username + '的收藏';
		}
	}
}
/**
 * 关于近乎
 */
var aboutJinhu = {
	init: function() {

	}
}
if(pageUrl == 'creatNew.html') {
	var height = document.documentElement.clientHeight || document.body.clientHeight;
	document.getElementById('detail').style.minHeight = height + 'px';
	if(!mui.os.wechat) {
		mui.previewImage();
	}
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
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
	var Categorytext = document.getElementById("Categorytext");
	var facePop = document.getElementById("facePop");
	var bottomBar = document.getElementById("bottomBar");
	var creatBtn = document.getElementById("creat_Btn");
	var plusimgArea = document.getElementById("imgPop");
	var imgArea = document.getElementById("demo");
	var newtag = document.getElementById("newtag");
	var addTag = document.getElementById("addTag");
	var headerpic = document.getElementById("headerpic");
	var tags = [];
	var featuredImageAttachmentId = 0;
	var CategoryId = "";
	var hasThreadCategory;
	ZYFILE.url = Http_Url + 'CMS/UploadFiles';
	var imgFiles = [];
	var wxIds = [];
	var cmsFiles = []


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

	// H5 plus事件处理
	function plusReady() {

	}
	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
	//拍照 
	function getImages() {
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
						name: "uploadkey"+a,
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
						name: "uploadkey"+a,
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

	$("#file").on('change', function(e) {
		var iMaxFilesize = 2097152; //2M
		var oFile = document.getElementById('file').files[0]; //读取文件 
		var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff|image\/jpg|)$/i;
		if(oFile) {
			var reader = new FileReader();
			reader.onload = function() {
				appendFileFeaturedTouch('CMS/UploadFeaturedImage', 0, reader.result, function(data) {
					document.getElementById("deleteImg").style.display = 'inline';
					featuredImageAttachmentId = data.FeaturedImageAttachmentId;
					document.getElementById("headerpic").style.display = 'inline';
				}, oFile.name)
			}
		}
		reader.readAsDataURL(oFile);
		// 下面是关键的关键，通过这个 file 对象生成一个可用的图像 URL
		// 获取 window 的 URL 工具
		var URL = window.URL || window.webkitURL;
		// 通过 file 生成目标 url
		var imgURL = URL.createObjectURL(oFile);
		// 用这个 URL 产生一个 <img> 将其显示出来
		document.getElementById("headerpic").src = imgURL;
		document.getElementById("addhpic").style.display = 'none'
		showLoading();

	})
	document.getElementById("deleteImg").addEventListener('tap', function() {
		document.getElementById("addhpic").style.display = 'inline';
		document.getElementById("headerpic").style.display = 'none';
		document.getElementById("deleteImg").style.display = 'none';
		featuredImageAttachmentId = 0;
	})
	/*facePop.addEventListener('tap', function() {
		document.activeElement.blur();
		facePopover.style.display = 'block';
		bottomBar.style.marginBottom = '180px'
	})*/

	function creatMenuel(data) {
		var fragment = document.createDocumentFragment();
		var li;
		for(var i = 0; i < data.length; i++) {
			li = document.createElement('li');
			li.className = "mui-table-view-cell";
			li.innerHTML = '<a id=' + data[i].CategoryId + ' href="#">' + data[i].CategoryName + '</a>'
			fragment.appendChild(li);
		}
		return fragment;
	}
	function creatWebImg(data) {
		var fragment = document.createDocumentFragment();
		var a;
		for(var i = 0; i < data.length; i++) {
			var a = new Date().getTime();
			div = document.createElement('div');
			div.className = "mui-control-item";
			div.style.width = '150px';
			div.style.height = '200px';
			div.style.paddingTop = '10px';
			div.innerHTML = '<img class="creat-img" data-preview-src="" data-preview-group="1" src="' + data[i] + '"/><img class="closeIcon creat-img-close" src="../img/close.png" id="'+a+'"/>'
			fragment.appendChild(div);
		}
		return fragment;
	}
	function creatImg(data) {
		var fragment = document.createDocumentFragment();
		var div;
		for(var i = 0; i < data.length; i++) {
			var a = new Date().getTime();
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

	function creatTag(data) {
		var fragment = document.createDocumentFragment();
		var span;
		for(var i = 0; i < data.length; i++) {
			span = document.createElement('span');
			span.className = "newTag";
			span.style.marginRight = '5px';
			span.style.fontSize = '14px';
			span.style.marginBottom = '5px';
			span.innerHTML = '' + data[i] + '<span id=' + i + ' style="font-size: 16px;" class="mui-icon mui-icon-closeempty"></span>';
			fragment.appendChild(span);
		}
		return fragment;
	}
	addTag.addEventListener('tap', function(e) {
		e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
		var btnArray = ['取消', '确定'];
		mui.prompt('请输入文章标签', '', '文章标签', btnArray, function(e) {
			if(e.index == 1) {
				if(TrimAll(e.value).length == 0) {
					mui.toast('标签内容不能为空')
					return
				}
				tags.push(e.value);
				newtag.innerHTML = "";
				newtag.appendChild(creatTag(tags));
			}
		})

	})
	mui("#newtag").on('tap', '.mui-icon-closeempty', function(e) {
		tags.splice(e.target.id, 1);
		newtag.innerHTML = "";
		newtag.appendChild(creatTag(tags));
	})
	if(mui.os.wechat) {
		mui('#imgPop').on('tap', '.creat-img', function(e) {
			wx.previewImage({
				current: this.getAttribute('src'),
				urls: wxIds
			});
		})
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
		}else{
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
	document.getElementById("addhpic").addEventListener('tap', function() {
		uploadFeatureImg()
	})
	document.getElementById("headerImg").addEventListener('tap', function() {
		uploadFeatureImg()
	})

	function uploadFeatureImg() {
		if(mui.os.plus) {
			changeHpic()
		} else if(mui.os.wechat) {
			wxChooseImg(1, function(ids) {
				syncUpload(ids, 'CMS/WeChatUploadFiles', function(e, imgSrc) {
					document.getElementById("deleteImg").style.display = 'inline';
					document.getElementById("headerpic").style.display = 'inline';
					document.getElementById("headerpic").src = imgSrc;
					document.getElementById("addhpic").style.display = 'none'
					featuredImageAttachmentId = e;
				})
			})
		} else {
			$("#file").click();
		}
	}

	function changeHpic() {
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "修改标题图",
				cancel: "取消",
				buttons: a
			}, function(b) {
				switch(b.index) {
					case 0:
						break;
					case 1:
						getImage('/CMS/UploadFeaturedImage', function(e, data) {
							document.getElementById("deleteImg").style.display = 'inline';
							document.getElementById("headerpic").style.display = 'inline';
							document.getElementById("headerpic").src = e;
							document.getElementById("addhpic").style.display = 'none'
							featuredImageAttachmentId = data.FeaturedImageAttachmentId;
						});
						break;
					case 2:
						galleryImg('/CMS/UploadFeaturedImage', function(e, data) {
							document.getElementById("deleteImg").style.display = 'inline';
							document.getElementById("headerpic").style.display = 'inline';
							document.getElementById("headerpic").src = e;
							document.getElementById("addhpic").style.display = 'none'
							console.log(data)
							featuredImageAttachmentId = data.FeaturedImageAttachmentId;
						});
						break;
					default:
						break
				}
			})
		}
	}

	var pickdata = [];
	var picker = new mui.PopPicker();

	function getRootCategories() {
		var waiting = showWaiting();
		getData('CMS/GetArticleCategories', {}, function(data) {
			closeWaiting(waiting);
			if(data.Type == 1) {
				if(data.Data && typeof(data.Data) == 'object') {
					if(data.Data && data.Data.length != 0) {
						hasThreadCategory = true;
						CategoryId = data.Data[0].CategoryId;
						Categorytext.innerHTML = data.Data[0].CategoryName;
						for(var i = 0; i < data.Data.length; i++) {
							pickdata.push({
								value: data.Data[i].CategoryId,
								text: data.Data[i].CategoryName
							})
						}
						picker.setData(pickdata);
					} else {
						hasThreadCategory = false
					}
				} else {
					mui.toast(data.Data);
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
	var sectionId;
	var currid = "";
	//B页面onload从服务器获取列表数据；
	window.onload = function() {
		files = [];
		//获取url中的targetId参数
		if(mui.os.plus) {
			mui.plusReady(function() {
				var self = plus.webview.currentWebview();
				getRootCategories();
				//关闭等待框
				plus.nativeUI.closeWaiting();
				//显示当前页面
				mui.currentWebview.show();
			});
		} else {
			getRootCategories();
		}
		if(mui.os.wechat) {
			var currUrl = location.href.split('#')[0];
			weChatLogin(currUrl)
		}
	}

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
	Category.addEventListener('tap', function() {
		picker.show(function(selectItems) {
			CategoryId = selectItems[0].value;
			Categorytext.innerHTML = selectItems[0].text;
		})
	})
	commenttextarea.addEventListener('focus', function() {
		//facePopover.style.display = 'none';
		bottomBar.style.display = 'inherit'
	})
	creatBtn.addEventListener('tap', function() {
		upload()
	})

	function CreateContentItem(title, body, tags, attachmentIds) {
		var params = {
			CategoryId: CategoryId,
			Subject: title,
			Body: body,
			Tags: tags,
			AttachmentIds: attachmentIds,
			FeaturedImageAttachmentId: featuredImageAttachmentId
		};
		var waitings = showWaiting();
		postDatawithToken('CMS/CreateContentItem', params, function(data) {
			closeWaiting(waitings);
			mui('#creat_Btn').button('reset');
			if(data.Type == 1) {
				mui.toast(data.Data);
				if(mui.os.plus) {
					var wobj = plus.webview.getWebviewById("myNews.html");
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
	var task = null;
	var title = "";
	var body = "";
	var tagstrs = "";
	var newListTouch = [];
	// 上传文件
	function upload() {
		if(hasThreadCategory && CategoryId == "") {
			mui.toast("请选择文章栏目")
			return
		}
		title = TrimAll(document.getElementById("title").value);
		body = TrimAll(commenttextarea.value);
		if(title == "") {
			mui.toast("文章标题不能为空")
			return
		}
		if(body == "") {
			mui.toast("文章内容不能为空")
			return
		}
		if(tags.length > 0) {
			tagstrs = tags.join(';')
		}

		if(mui.os.plus) {
			filesUploadforApp('/CMS/UploadFiles', function(e) {
				if(e == '') {
					CreateContentItem(title, body, tagstrs, "");
				} else {
					CreateContentItem(title, body, tagstrs, e);
				}
			})
		} else if(mui.os.wechat) {
			if(imgFiles.length == 0) {
				CreateContentItem(title, body, tagstrs, "");
			} else {
				var attachmentIds = [];
				var i = 0;
				syncUpload(wxIds, 'CMS/WeChatUploadFiles', function(e) {
					i++;
					attachmentIds.push(e)
					if(wxIds.length == 0) {
						CreateContentItem(title, body, tagstrs, attachmentIds.join(';'));
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
				appendFileTouch('/CMS/UploadFiles',0,touchArray,function(e){
					CreateContentItem(title, body, tagstrs,e);
				})
			}else{
				CreateContentItem(title, body, tagstrs,"");
			}					

		}

	}

	function onCompletes(response) {
		setTimeout(function() {
			hideLoading()
		}, 500)

		CreateContentItem(title, body, tagstrs, attachmentIds.join(';'));
	}

	function onFailures() {
		mui.toast('文件上传失败，请重试！');
		return
	}
}