var home = {
	init: function() {
		mui.init({
			keyEventBind: {
				backbutton: false //关闭back按键监听
			},
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},
			pullRefresh: {
				container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#bf0a10', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: 50, //可选,默认50.触发下拉刷新拖动距离,
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					callback: function() {
						setTimeout(function() {
							getHomeData(true);
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						}, 1500);
					}
				}
			}
		});
		getHomeData(false);
		document.addEventListener("plusready", function() {
			checkArguments(true)
		})
		var morewz = document.getElementById("morewz");
		var moretz = document.getElementById("moretz");
		var creatSitemFragment = function(data) {
			var bigContainers = '<div class="mui-slider-item mui-slider-item-duplicate">' +
				'						<a class="divImg" href="#"><img src=' + getImgUrl(data[data.length - 1].FeaturedImage) + ' /></a>' +
				'					</div>';
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ('<div class="mui-slider-item" id=' + data[i].ItemId + ' title=' + data[i].ContentModel + '>' +
					'						<a class="divImg" href="#"><img id=' + data[i].ItemId + ' title=' + data[i].ContentModel + ' src=' + getImgUrl(data[i].FeaturedImage) + ' /></a>' +
					'					</div>');
				bigContainers += itemContainer;
			}
			bigContainers += '<div class="mui-slider-item mui-slider-item-duplicate">' +
				'<a class="divImg" href="#">' +
				'<img src=' + getImgUrl(data[0].FeaturedImage) + '>' +
				'</a>' +
				'</div>';
			return bigContainers;

		}
		var creatIndicatorFragment = function(data) {
			var bigContainers = '<div class="mui-indicator mui-active"></div>';
			for(var i = 1; i < data.length; i++) {
				var itemContainer = "";
				itemContainer += ('<div class="mui-indicator"></div>');
				bigContainers += itemContainer;
			}
			return bigContainers;

		}
		var createSlideFragment = function(data) {
			var newArr = [];
			//过滤掉外链
			for(var i = 0; i < data.length; i++) {
				if(data[i].FeaturedImage != "") {
					newArr.push(data[i])
				}
			}
			var fragment = document.createDocumentFragment();
			var div;
			var slideItems = "";
			if(newArr.length > 0) {
				slideItems = creatSitemFragment(newArr);
			}
			var indicator = creatIndicatorFragment(newArr);
			div = document.createElement('div');
			div.className = 'mui-slider';
			div.innerHTML = '<div class="mui-slider-group mui-slider-loop">' + slideItems +
				'				</div>' +
				'				<div class="mui-slider-indicator">' + indicator +
				'				</div>';
			fragment.appendChild(div);
			return fragment;
		};
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

		var morewz = document.getElementById("morewz");
		morewz.addEventListener('tap', function() {
			if(mui.os.plus) {
				var homePage = plus.webview.getWebviewById('home.html');
				var enterPage = plus.webview.getLaunchWebview(); //入口文件
				var mainPage = plus.webview.getWebviewById('main');
				if(enterPage || mainPage) {
					enterPage && enterPage.evalJS("changeTab('news.html')")
					mainPage && mainPage.evalJS("changeTab('news.html')")
				}
				homePage.hide();
				var detailPage = plus.webview.getWebviewById('news.html');
				plus.webview.show(detailPage, "", 300);
				var tabNews = getlsData('tab-news');
				if(tabNews == 'false') {
					mui.fire(detailPage, 'show', {
						show: true
					})
					setlsData('tab-news', 'true');
					//setlsData('tIndex',3)
				}
				setTimeout(function() {
					detailPage.evalJS("changeTab(0)")
				}, 500)
			} else {
				window.parent.skipPage('news.html')
			}

		})
		var moretz = document.getElementById("moretz");
		moretz.addEventListener('tap', function() {
			if(mui.os.plus) {
				var homePage = plus.webview.getWebviewById('home.html');
				var enterPage = plus.webview.getLaunchWebview(); //入口文件
				var mainPage = plus.webview.getWebviewById('main');
				if(enterPage || mainPage) {
					enterPage && enterPage.evalJS("changeTab('post.html')")
					mainPage && mainPage.evalJS("changeTab('post.html')")
				}
				homePage.hide();
				var detailPage = plus.webview.getWebviewById('post.html');
				plus.webview.show(detailPage, "", 300);
				var tabPost = getlsData('tab-post');
				if(tabPost == 'false') {
					mui.fire(detailPage, 'show', {
						show: true
					})
					setlsData('tab-post', 'true');
					//setlsData('tIndex',3)
				}
				setTimeout(function() {
					detailPage.evalJS("changeTab(1)")
				}, 500)
			} else {
				window.parent.skipPage('post.html')
			}

		})

		function getHomeData(isRefresh) {
			if(!isRefresh) {
				showLoading('', '', '#ffffff', '50px');
			}
			getDatawithToken('User/HomePage', {}, function(data) {
				var homeSlider = document.getElementById("homeSlider");
				homeSlider.innerHTML='';
				if(data.Data.specialContentItems.length > 0) {
					homeSlider.appendChild(createSlideFragment(data.Data.specialContentItems));
				}
				var gallery = mui('.mui-slider');
				gallery.slider({
					interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
				});
				var table = document.getElementById('tz');
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					hideLoading();
					hideErr();
					if(data.Data && typeof(data.Data) == 'object') {
						morewz.style.display = (data.Data.ContentItems == null || data.Data.ContentItems.length < 5) ? 'none' : 'inherit';
						moretz.style.display = (data.Data.SpecialThreads == null || data.Data.SpecialThreads.length < 5) ? 'none' : 'inherit';
						if(data.Data.SpecialThreads) {
							table.innerHTML = '';
							table.appendChild(createFragment(data.Data.SpecialThreads));
						} else {
							document.getElementById("home_tz").style.display = 'none';
						}
						if(data.Data.ContentItems) {
							document.getElementById('wz').innerHTML = '';
							creatNewElement(data.Data.ContentItems);
						} else {
							document.getElementById("home_wz").style.display = 'none';
						}
					} else {
						showErr(data.Data, '', '#FFFFFF', '50px')
						mui.toast(data.Data);
					}

				} else if(data.Type == 0) {
					hideLoading();
					//登录失败
					//mui.toast("请登录后再进行操作");
					return;
				} else {
					//逻辑错误
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
						showErr('错误代码：' + err, '', '#FFFFFF', '50px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#FFFFFF', '50px');
					hideLoading()
				}
			})
		}
		var creatNewElement = function(data) {
			var fragment = document.getElementById('wz');
			var li;
			var userAvatar = "";
			for(var i = 0; i < data.length; i++) {
				var dis = 'none';
				var imgUrl='';
				if(data[i].FeaturedImage.length > 0) {
					dis = 'block'
					imgUrl=getImgUrl(data[i].FeaturedImage);
				} else {
					if(data[i].ContentModel==3){
						//组图
						if(data[i].FirstImage){
							dis = 'block'
							imgUrl=getImgUrl(data[i].FirstImage);
						}else{
							dis = 'none'
						}
					}else{
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
		};
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
					'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
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

		mui("#homeSlider").on('tap', '.mui-slider-item', function(e) {
			var id = this.getAttribute('id');
			var type = parseInt(this.getAttribute('title'));
			var urlId = 'newsDetail.html';
			var baseUrl = 'newsDetail.html?ContentItemId=' + id;
			switch(type) {
				case 1:
				case 5:
					urlId = 'newsDetail.html';
					baseUrl = 'newsDetail.html?ContentItemId=' + id;
					break;
				case 2:
					urlId = 'videoDetail.html';
					baseUrl = 'videoDetail.html?ContentItemId=' + id;
					break;
				case 3:
					urlId = 'imgsDetail.html';
					baseUrl = 'imgsDetail.html?ContentItemId=' + id;
					break;
				case 4:
					urlId = 'newsDetail.html';
					baseUrl = 'newsDetail.html?ContentItemId=' + id;
					break;
				default:
					urlId = 'threadDetail.html';
					baseUrl = 'threadDetail.html?threadId=' + id;
					break;
			}
			var curl = shareUrl + baseUrl;
			setlsData('currUrl', curl);
			if(type == 0) {
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
						threadId: id,
						currId: 'home.html'
					}
				})
			} else {
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
						ContentItemId: id
					}
				})
			}

		})

		mui("#wz").on('tap', '.mui-table-view-cell', function(e) {
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

		mui("#tz").on('tap', '.mui-table-view-cell', function(e) {
			var threadId = this.getAttribute("id");
			var baseUrl = 'threadDetail.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?threadId=' + threadId;
			var curl = shareUrl + baseUrl + '?threadId=' + threadId;
			setlsData('currUrl', curl);
			mui.openWindow({
				url: url,
				id: 'threadDetail.html',
				show: {
					autoShow: false,
					aniShow: 'fade-in'
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
					currId: 'home.html'
				}
			})

		})
		document.getElementById("search").addEventListener('tap', function() {
			mui.openWindow({
				url: 'search.html',
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

	}
}