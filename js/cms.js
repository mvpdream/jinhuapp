var pageUrl=window.location.pathname;
pageUrl=pageUrl.substring(pageUrl.lastIndexOf('/')+1,pageUrl.length);
/**
 * 资讯列表（主页）
 */
if(pageUrl=='news.html'){
		(function($) {
			$(document).imageLazyload({
				placeholder: '../img/lazy.png'
			});
		})(mui);
		window.addEventListener('touchstart', function(e) {
			e.preventDefault();
		});
		window.addEventListener('touchmove', function(e) {
			e.preventDefault();
		});
		var ids = [];
		if(mui.os.plus) {
			window.addEventListener('show', function(event) {
				getsectionType()
			})

		} else {
			getsectionType();

		}

		var selel = document.getElementsByClassName("mui-control-item mui-active");
		var creatTypes = function(data) {
			var newArr = [];
			var newData = [{
				CategoryId: '0',
				CategoryName: "最新"
			}, {
				CategoryId: 'hot',
				CategoryName: "热门"
			}];
			var newdata = newData.concat(data)
			var fragment = document.getElementById('alltypes');
			var div;
			fragment.innerHTML = '';
			for(var i = 0; i < newdata.length; i++) {
				div = document.createElement('div');
				div.className = 'mui-col-xs-4';
				div.style.padding = '10px';
				div.innerHTML = '<div class="typeitem" id=' + newdata[i].CategoryId + '>' + newdata[i].CategoryName + '</div>';
				fragment.appendChild(div);
			}

		}

		function creatContent(data) {
			var box = document.getElementById("contentArea");
			var tabitems = creatTabItem(data);
			var groupitem = creatGroupItem(data);
			box.innerHTML = '<div id="slider" class="mui-slider mui-fullscreen">' +
				'				<div id="sliderSegmentedControl" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted jh-scroll-wrapper" style="margin-right: 50px;">' +
				'					<div class="mui-scroll" id="SectionType" style="padding-right: 50px;">' +
				'						<a class="mui-control-item mui-active" href="#itemmobile" id="0">' +
				'							最新' +
				'						</a>' +
				'						<a class="mui-control-item" href="#item0mobile" id="hot">' +
				'							热门' +
				'						</a>' +
				'                        ' + tabitems + '' +
				'					</div>' +
				'					<div id="switchColumn" onclick="changeSwith()">' +
				'						<span class="mui-icon mui-icon-arrowdown"></span>' +
				'					</div>' +
				'				</div>' +
				'				<div class="mui-slider-group" id="sliderGroup">' +
				'					<div id="itemmobile" class="mui-slider-item mui-control-content mui-active">' +
				'						<div class="mui-scroll-wrapper">' +
				'							<div class="mui-scroll">' +
				'								<ul class="mui-table-view">' +
				'									<div class="mui-loading">' +
				'										<div class="mui-spinner">' +
				'										</div>' +
				'									</div>' +
				'								</ul>' +
				'							</div>' +
				'						</div>' +
				'					</div>' +
				'					<div id="item0mobile" class="mui-slider-item mui-control-content">' +
				'						<div class="mui-scroll-wrapper">' +
				'							<div class="mui-scroll">' +
				'								<ul class="mui-table-view">' +
				'									<div class="mui-loading">' +
				'										<div class="mui-spinner">' +
				'										</div>' +
				'									</div>' +
				'								</ul>' +
				'							</div>' +
				'						</div>' +
				'					</div>' +
				'                        ' + groupitem + '' +
				'				</div>';
			mui('.mui-slider').slider();
			var deceleration = mui.os.ios ? 0.003 : 0.0009;
			mui('.mui-scroll-wrapper.mui-slider-indicator.mui-segmented-control').scroll({
				scrollY: false,
				scrollX: true,
				indicators: false,
				deceleration: deceleration,
				snap: '.mui-control-item'
			});
			document.querySelector('.mui-slider').addEventListener('slide', function(event) {
				var index = event.detail.slideNumber;
				if(index != 0) {
					var item = document.getElementById("item" + (index - 1) + "mobile");
					//item.querySelector('.mui-pull-bottom-wrapper').style.display = 'none';
					if(item.querySelector('.mui-loading')) {
						if(index == 1) {
							GetNews(0, false, 4)
						} else {
							GetNews(ids[index], false, 0)
						}

					}

				}
				setlsData('newtabid', ids[index])

			});				
			document.getElementById("switchColumn").addEventListener('tap', function() {
					changeSwith()
				})
			document.getElementById("switchColumns").addEventListener('tap', function() {
				changeSwith()
			})
			mui.plusReady(function() {
				//				var bacc = plus.webview.defauleHardwareAccelerated();
				//				alert('硬件加速：'+bacc)
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
									//document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
									if(selel[0].id == 'hot') {
										GetNews(0, false, 4, true)
									} else {
										GetNews(selel[0].id, false, 0, true)
									}
									setTimeout(function() {
										self.endPullDownToRefresh();
									}, 1000);
								}
							},
							up: {
								show: false,
								callback: function() {
									var self = this;
									if(selel[0].id == 'hot') {
										GetNews(0, true, 4, false)
									} else {
										GetNews(selel[0].id, true, 0, false)
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

		}
		var creatTabItem = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				var hrefs = "#item" + (i + 1) + "mobile";
				itemContainer = '<a class="mui-control-item" href=' + hrefs + ' id=' + data[i].CategoryId + '>' + data[i].CategoryName.substring(0, 10) + '</a>'
				bigContainers += itemContainer;
			}
			return bigContainers;
		}

		var creatGroupItem = function(data) {
			var bigContainers = "";
			for(var i = 0; i < data.length; i++) {
				var itemContainer = "";
				var ids = "item" + (i + 1) + "mobile";
				itemContainer = '<div id=' + ids + ' class="mui-slider-item mui-control-content">' +
					'						<div class="mui-scroll-wrapper">' +
					'							<div class="mui-scroll">' +
					'								<ul class="mui-table-view">' +
					'									<div class="mui-loading">' +
					'										<div class="mui-spinner">' +
					'										</div>' +
					'									</div>' +
					'								</ul>' +
					'							</div>' +
					'						</div>' +
					'					</div>'
				bigContainers += itemContainer;
			}
			return bigContainers;
		}

		var creatNewElement = function(data, id) {
			var fragment = document.getElementById(id);
			var cfragment = fragment.firstElementChild;
			var finel = cfragment.firstElementChild.querySelector('.mui-table-view');
			var li;
			var userAvatar = '';
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

				finel.appendChild(li);
			}
		};

		function changeSwith() {
			var moreType = document.getElementById("moreType");
			var types = document.getElementById("contentArea");
			if(types.style.display == "block") {
				types.style.display = "none";
				moreType.style.display = "block";
			} else {
				types.style.display = "block";
				moreType.style.display = "none";
			}

		}
		mui("#alltypes").on('tap', '.mui-col-xs-4', function(e) {
			changeColumn(e.target.id);
			changeSwith();
		})

		function changeColumn(index) {
			var index = ids.indexOf(index);
			var scrollColumn = document.getElementById("SectionType");
			var addcolumn = document.getElementById("alltypes");
			var a = scrollColumn.getElementsByTagName('a');
			var div = addcolumn.querySelectorAll('.mui-col-xs-4');
			for(var i = 0; i < a.length; i++) {
				a[i].className = "mui-control-item";
				div[i].className = "mui-col-xs-4";
			}
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index); //跳转到第index张图片，index从0开始；
			gallerys.slider().gotoItem(index);
			a[index].className = "mui-control-item mui-active";
			div[index].className = "mui-col-xs-4 typeItemActive";

		}

		var page = 1;
		var idName = "";

		function GetNews(categoryId, more, type, isRefresh) {
			if(isRefresh == null) {
				isRefresh = false
			}
			if(!more && !isRefresh) {
				showLoading('', '', '#FFFFFF', '100px', '1');
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
				categoryId: categoryId,
				includeCategoryDescendants: true,
				pageSize: 10,
				pageIndex: page,
				type: type
			};
			getData('CMS/GetContentItems', params, function(data) {
				hideLoading();
				hideErr();
				var bottomTip = document.querySelectorAll('.mui-pull-bottom-tips');
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						hideErrForList('', idName);
						creatNewElement(data.Data, idName);
					} else {
						if(data.Data=='栏目下暂时没有更多资讯'){
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'none';
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').firstElementChild.style.display = 'none';
							document.getElementById(idName).querySelector('.mui-pull-loading').innerHTML=data.Data
						}else{
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').style.display = 'block';
							document.getElementById(idName).querySelector('.mui-pull-bottom-tips').firstElementChild.style.display = 'block';
						}
						if(!more) {
							var errForList = showErrForList(data.Data, '', '', idName);
							if(errForList) {
								fragment.appendChild(showErrForList(data.Data, '', '', idName))
							}
						}
					}
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

		function getsectionType() {
			showLoading('', '', '#FFFFFF', '50px', '1');
			getData('CMS/GetRootCategories', {}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						if(data.Data.length > 0) {
							creatContent(data.Data)
							creatTypes(data.Data)
							GetNews(0, false, 0)
						}
						mui('#SectionType .mui-control-item').each(function(index, element) {
							ids.push(element.id)
						})
					} else {
						showErr(data.Data, '', '#FFFFFF', '50px')
						mui.toast(data.Data);
					}

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

		mui.init({
			keyEventBind: {
				backbutton: false //关闭back按键监听
			},
			gestureConfig: {
				swipeBack: true //启用右滑关闭功能
			},

		});
		document.getElementById("search").addEventListener('tap', function() {
			mui.openWindow({
				url: 'search.html?type=news',
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

		function changeTab(id) {
			var index = ids.indexOf(id.toString());
			mui('.mui-slider').slider();
			var gallery = mui('#sliderSegmentedControl');
			var gallerys = mui('#slider');
			gallery.scroll().gotoPage(index); //跳转到第index张图片，index从0开始；
			gallerys.slider().gotoItem(index);
		}	
}
/**
 * 普通资讯详情
 */
var newsDetail = {
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
					jsApiList: ['previewImage','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					success: function(res) {
						//alert(JSON.stringify(res))
						// 以键值对的形式返回，可用的api值true，不可用为false
					}
				});
			});
			wx.error(function(res) {
				//alert(JSON.stringify(res))
			});
		}

		//window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{},"image":{"viewList":["qzone","tsina","weixin"],"viewText":"分享到：","viewSize":"32"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.querySelector('.jh-detail-content').style.minHeight = height + 'px';
		var NewsName = document.getElementById("NewsName");
		var newsTitle = document.getElementById("newsTitle");
		var Author = document.getElementById("Author");
		var DateCreated = document.getElementById("DateCreated");

		var commentArea = document.getElementById("commentArea");
		var new_detail = document.getElementById("new_detail");
		var userAvator = document.getElementById("userAvator");
		var supportArea = document.getElementById("supportArea");
		var tags = document.getElementById("tags");
		var tagsContainer = document.getElementById("tagsContainer");
		var hittimes = document.getElementById("hittimes");
		var attitudeCount = document.getElementById("attitudeCount");

		var DownloadProgress = document.getElementById("downloadProgress");
		var attachments = document.getElementById("attachments");
		var userid = 0;
		var attitudeNum = 0;
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
		if(mui.os.wechat) {
			mui("#new_detail").on('tap', 'img', function(e) {
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

		var contentItemId;
		var currId = "";
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					//关闭等待框
					var self = plus.webview.currentWebview();
					contentItemId = self.ContentItemId;
					getDetail(contentItemId)
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				contentItemId = getUrlParam('ContentItemId');
				//document.getElementById("GoToAppButton").href='jhapp://newDetail.html?ContentItemId='+contentItemId;
				getDetail(contentItemId)
			}
			if(!mui.os.plus) {
				initOpenApp('newsDetail', contentItemId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)

			}

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

		function creatAttachment(data) {
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

		function createTags(data) {
			var fragment = document.createDocumentFragment();
			var a;
			for(var i = 0; i < data.length; i++) {
				a = document.createElement('a');
				a.style.marginLeft = (i == 0) ? '0' : '10px'
				a.id = data[i].Id;
				a.innerHTML = '<span class="label label-default mui-ellipsis-1">' + data[i].TagName + '</span>';
				fragment.appendChild(a);
			}
			return fragment;
		};
		var isFavorited = false;
		var isAttitude = false;
		var supportnum = 0;

		function getDetail(id) {
			showLoading('', '', '#FFFFFF', '50px');
			getDatawithToken('CMS/CMSNewsDetail', {
				contentItemId: id
			}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						var data = data.Data;
						setIdandType(contentItemId, 'ContentItem', data.CommentCount)
						ii = data.Comments.length;
						userAvator.src = data.Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Avatar);
						userid = data.UserId;
						new_detail.innerHTML = '';
						new_detail.innerHTML = getBodyImgUrl(data.Body);
						wximgEl.innerHTML = data.Body;
						NewsName.innerHTML = data.CategoryName.substring(0, 15);
						hittimes.innerHTML = data.HitTimes;
						if(data.Tags.length > 0) {
							tagsContainer.style.display = 'block';
							tags.appendChild(createTags(data.Tags))
						} else {
							tagsContainer.style.display = 'none';
						}
						isAttitude = data.IsAttitude;
						changeSupport(data.IsAttitude);
						newsTitle.innerHTML = data.Subject;
						Author.innerText = data.Author;
						DateCreated.innerText = data.DatePublished;
						attitudeCount.innerText = data.AttitudeCount;
						attitudeNum = data.AttitudeCount;
						if(data.Attachments && data.Attachments.length > 0) {
							attachments.style.display = 'block';
							attachments.appendChild(creatAttachment(data.Attachments));
						} else {
							attachments.style.display = 'none';
						}

						if(data.Comments && data.Comments.length < 5) {
							morecomment.style.display = 'none';
						} else {
							morecomment.style.display = 'block';
						}
						commentArea.appendChild(createComFragment(data.Comments));
						setShareInfo(getlsData('currUrl'), data.Subject, data.Subject, 'http://upload.cankaoxiaoxi.com/2017/0524/1495629970905.jpg?q=75');
						com.isFavorited = data.IsFavorited;
						favorThread(data.IsFavorite);
						canComment(data.IsComment);
					} else {
						showErr(data.Data, '', '#FFFFFF', '50px');
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
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

//		function canComment(isComment) {
//			document.getElementById("jgb").style.display = !isComment ? 'inherit' : 'none';
//			document.getElementById("commentList").style.display = !isComment ? 'inherit' : 'none';
//			document.getElementById("commentBar").style.display = !isComment ? 'table' : 'none';
//		}

		function attitudeContentItem(contentItemid) {
			postDatawithToken('CMS/AttitudeContentItem?contentItemId=' + contentItemid, {}, function(data) {
				if(data.Type == 1) {
					//mui.toast(data.Data);
					changeSupport(true);
				} else if(data.Type == 2) {
					//mui.toast(data.Data);
					changeSupport(false);
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

		function changeSupport(isattitude) {
			supportArea.querySelector('a').className = isattitude ? 'active' : '';
			document.getElementById("support").parentElement.style.borderColor = isattitude ? '#bf0a10' : '#ccc';
			attitudeCount.style.color = isattitude ? '#bf0a10' : '#ccc';
			isAttitude = isattitude;
			if(isattitude) {
				attitudeNum = attitudeNum + 1;
				attitudeCount.innerText = attitudeNum;
			} else {
				attitudeNum = attitudeNum - 1;
				attitudeCount.innerText = attitudeNum;
			}
		}
		supportArea.addEventListener('tap', function() {
			attitudeContentItem(contentItemId)
		})
		mui("#attachments").on('tap', 'a', function(e) {
			if(mui.os.plus) {
				startDownloadTask(this.getAttribute('id'))
			} else {
				download(this.getAttribute('id'), this.getAttribute('title'), location.href.split('#')[0])
			}

		})
		mui("#tags").on('tap', 'span', function(e) {
			var tagname = e.target.innerText;
			var baseUrl = 'newsBytag_main.html';
			var url = mui.os.plus ? baseUrl : baseUrl + '?Tagname=' + tagname;
			mui.openWindow({
				url: url,
				id: 'newsBytag_main.html',
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
					Tagname: tagname
				}
			})
		});

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
 * 图片资讯详情
 */
var imgDetail = {
	init: function() {
		if(!mui.os.plus) {
			creatBanner();
		}
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.querySelector('.jh-detail-content').style.minHeight = height + 'px';
		mui.init();
		var attachments = [];
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
		if(mui.os.wechat) {
			mui("#slider").on('tap', 'img', function(e) {
				var imgUrl = e.detail.target.currentSrc;
				var imgs = [];
				for(var i = 0; i < attachments.length; i++) {
					imgs.push(attachments[i].DirectlyUrl)
				}
				wx.previewImage({
					current: imgUrl,
					urls: imgs
				});
			})
		}

		window._bd_share_config = {
			"common": {
				"bdSnsKey": {},
				"bdText": "",
				"bdMini": "2",
				"bdMiniList": false,
				"bdPic": "",
				"bdStyle": "0",
				"bdSize": "32"
			},
			"share": {},
			"image": {
				"viewList": ["qzone", "tsina", "weixin"],
				"viewText": "分享到：",
				"viewSize": "32"
			},
			"selectShare": {
				"bdContainerClass": null,
				"bdSelectMiniList": ["qzone", "tsina", "weixin"]
			}
		};
		with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
		var sliderGroups = document.getElementById("sliderGroups");
		var createImgItem = function(data) {
			var fragment = document.createDocumentFragment();
			var div;
			for(var i = 0; i < data.Attachments.length; i++) {
				var discription = data.Attachments[i].Discription == null ? "" : data.Attachments[i].Discription;
				div = document.createElement('div');
				div.className = 'mui-slider-item';
				div.innerHTML = '<div style="text-align:center;max-width: 100%;"><img src=' + getImgUrl(data.Attachments[i].DirectlyUrl) + '  data-preview-src="" data-preview-group="1" /></div>' +
					'<h4 class="jh-detail-title mui-content-padded" id="newsTitle" style="color: #CBCBCB;">' + data.Subject + '</h4>' +
					'<div class="detail_content mui-content-padded" id="v_detail" style="color: #CBCBCB;">' + discription + '</div>';
				fragment.appendChild(div);
			}
			return fragment;
		};

		
		var isAttitude = false;
		var supportnum = 0;

		function getDetail(id) {
			showLoading('', '', '#000000', '50px');
			getDatawithToken('CMS/CMSNewImgDetail', {
				contentItemId: id
			}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						var data = data.Data;
						setIdandType(contentItemId, 'ContentItem', data.CommentCount)
						sliderGroups.appendChild(createImgItem(data))
						setShareInfo(getlsData('currUrl'), data.Subject, data.Subject);
						com.isFavorited = data.IsFavorited;
						favorThread(data.IsFavorite);
						document.getElementById("commentBar").style.display = (data.IsComment) ? 'none' : 'table';
						mui("#slider").slider({
							interval: 0
						});
						attachments = data.Attachments;
					} else {
						showErr(data.Data, '', '#000000', '50px');
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					showErr(data.Data, '', '#000000', '50px');
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#000000', '50px');
					} else {
						showErr('错误代码：' + err, '', '#000000', '50px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#000000', '50px');
					hideLoading()
				}
			})
		}

		var contentItemId;
		var currId = "";
		//B页面onload从服务器获取列表数据；
		window.onload = function() {
			//获取url中的targetId参数
			if(mui.os.plus) {
				mui.plusReady(function() {
					//关闭等待框
					var self = plus.webview.currentWebview();
					contentItemId = self.ContentItemId;
					getDetail(contentItemId)
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				contentItemId = getUrlParam('ContentItemId');
				getDetail(contentItemId)
			}
			if(!mui.os.plus) {
				initOpenApp('imgsDetail', contentItemId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}
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
 * 视频资讯
 */
var videoDetail = {
	init: function() {
		if(!mui.os.plus) {
			creatBanner();
		}
		var height = document.documentElement.clientHeight || document.body.clientHeight;
		document.querySelector('.jh-detail-content').style.minHeight = height + 'px';
		mui.init();
		//mui.bvd();
		var videoArea = document.getElementById("videoArea");
		var contentItemId;
		var currId = "";

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
					//关闭等待框
					var self = plus.webview.currentWebview();
					contentItemId = self.ContentItemId;
					getDetail(contentItemId)
					plus.nativeUI.closeWaiting();
					//显示当前页面
					mui.currentWebview.show();
				});
			} else {
				contentItemId = getUrlParam('ContentItemId');
				getDetail(contentItemId)
			}
			if(!mui.os.plus) {
				initOpenApp('videoDetail', contentItemId)
			}
			if(mui.os.wechat) {
				var currUrl = location.href.split('#')[0];
				weChatLogin(currUrl)
			}

		}

		window._bd_share_config = {
			"common": {
				"bdSnsKey": {},
				"bdText": "",
				"bdMini": "2",
				"bdMiniList": false,
				"bdPic": "",
				"bdStyle": "0",
				"bdSize": "32"
			},
			"share": {},
			"image": {
				"viewList": ["qzone", "tsina", "weixin"],
				"viewText": "分享到：",
				"viewSize": "32"
			},
			"selectShare": {
				"bdContainerClass": null,
				"bdSelectMiniList": ["qzone", "tsina", "weixin"]
			}
		};
		with(document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];

		var NewsName = document.getElementById("NewsName");
		var newsTitle = document.getElementById("newsTitle");

		var commentArea = document.getElementById("commentArea");
		var new_detail = document.getElementById("new_detail");

		var isFavorited = false;
		var isAttitude = false;
		var supportnum = 0;

		function creatVideoEl(vimg, vurl) {
			var div;
			div = document.createElement('div');
			div.className = 'bad-video';

			div.innerHTML = '<video id="video" poster=' + vimg + ' webkit-playsinline playsinline class="myVideo">' +
				'	<source src=' + vurl + ' type=\'video/mp4\'>' +
				'	<source src=\'1.webm\' type="video/webm"></source>' +
				'	<p>设备不支持</p>' +
				'</video>';
			videoArea.appendChild(div);
		}

		function getDetail(id) {
			showLoading('', '', '#000000', '50px');
			getDatawithToken('CMS/CMSNewVideoDetail', {
				contentItemId: id
			}, function(data) {
				hideLoading();
				hideErr();
				if(data.Type == 1) {
					if(data.Data && typeof(data.Data) == 'object') {
						var data = data.Data;
						setIdandType(contentItemId, 'ContentItem', data.CommentCount);
						creatVideoEl(getImgUrl(data.FeaturedImage), getImgUrl(data.Url));
						var myVid = document.getElementById("video");
						mui.bvd();
						newsTitle.innerHTML = data.Subject;
						document.getElementById("v_detail").innerHTML = data.Summary;
						setShareInfo(getlsData('currUrl'), data.Subject, data.Subject);
						com.isFavorited = data.IsFavorited;
						favorThread(data.IsFavorite);
						document.getElementById("commentBar").style.display = (data.IsComment) ? 'none' : 'table';
					} else {
						showErr(data.Data, '', '#000000', '50px');
						mui.toast(data.Data);
					}
				} else if(data.Type == 0) {
					//登录失败
					mui.toast("请登录后再进行操作");
					login();
					return;
				} else {
					//逻辑错误
					showErr(data.Data, '', '#000000', '50px');
					mui.toast(data.Data);
					return;
				}
			}, function(err) {
				hideLoading();
				mui.plusReady(function() {
					if(plus.networkinfo.getCurrentType() == 1 || plus.networkinfo.getCurrentType() == 2) {
						mui.toast('网络异常，请检查网络设置!');
						showErr('没有网络连接', '', '#000000', '50px');
					} else {
						showErr('错误代码：' + err, '', '#000000', '50px');
						hideLoading()
					}
				})
				if(!mui.os.plus) {
					showErr('错误代码：' + err, '', '#000000', '50px');
					hideLoading()
				}
			})
		}
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
 * 标签内列表（父）
 */
var newsBytag_main = {
	init: function() {
		var tagname = "";

		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					tagname = self.Tagname;
					document.getElementById("tagName").innerHTML = tagname.substring(0, 10);
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				tagname = getUrlParam('Tagname')
				document.getElementById("tagName").innerHTML = tagname.substring(0, 10);
			}
			var baseUrl = 'newsBytag_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?Tagname=' + tagname;
			mui.init({
				subpages: [{
					url: url,
					id: 'newsBytag_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						Tagname: tagname
					}
				}]

			});

		}

	}
}
/**
 * 标签内列表（子）
 */
var newsBytag_sub={
	init:function(){
		var tagname = "";
			function login (){
			if(mui.os.wechat){
					var currUrl = location.href.split('#')[0];
					getCode(currUrl)
			}else{
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
						var self = plus.webview.getWebviewById('newsBytag_main.html');
						tagname = self.Tagname;
						loadData(0, tagname)
						//关闭等待框                                                                                                               
						plus.nativeUI.closeWaiting();
						//显示当前页面                                                                                                              
						mui.currentWebview.show();
					});
				} else {
					tagname = getUrlParam('Tagname');
					loadData(0, tagname)
				}
				if(mui.os.wechat){
					var currUrl = location.href.split('#')[0];
					weChatLogin(currUrl)
				}

			}
			var createFragment = function(data) {
				var fragment = document.createDocumentFragment();
				var li;
				var userAvatar="";
				for(var i = 0; i < data.length; i++) {
					var dis = 'none';
					if(data[i].FeaturedImage.length > 0) {
						dis = 'block'
					} else {
						dis = 'none'
					}
					userAvatar = data[i].Avatar==""?"../img/avatar.jpg":getImgUrl(data[i].Avatar);
					li = document.createElement('li');
					li.className = 'mui-table-view-cell jh-news-list';
					li.id = data[i].ContentItemId;
					li.title = data[i].ContentModel;
					li.innerHTML = '<div class="divImg" style="display:' + dis + ';padding: 5px 0 5px 0"><img style="display:' + dis + '" src=' + getImgUrl(data[i].FeaturedImage) + '  ></div>' +
						'										<h5 class="listTitle">' + data[i].Subject + '</h5>' +
						'										<ul class="mui-list-inline text-muted jh-itemBottm-left">' +
						'											<li><img class="creator_img" style="height:1.5rem" src=' + userAvatar + '></li>' +
						'											<li>' + data[i].Author + '</li>' +
						'											<li>' + data[i].DatePublished + '</li>' +						
						'										</ul>'+
						'	<div class="jh-itemBottm-right text-muted">'+
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
					tagName: id,
					pageIndex: page,
				}
				if(type!=2){
					showLoading('','','#FFFFFF');
				}
				
				getData('CMS/GetContentItemByTagName', params, function(data) {
					hideLoading();
					hideErr();
					if(data.Type == 1) {
						if(data.Data && typeof(data.Data) == 'object') {
							if(data.Data.length>0){
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
							if(type!=2){
								showErr(data.Data,'','#FFFFFF','50px');
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
						mui.toast(data.Data);
						if(type!=2){
							showErr(data.Data,'','#FFFFFF','50px');
						}
						
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						return;
					}
				}, function(err) {
					hideLoading()
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					mui.plusReady(function(){
						if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							showErr('没有网络连接','','#FFFFFF','50px');
						}else{
							showErr('错误代码：'+err,'','#FFFFFF','50px');
							hideLoading()
						}
					})
				if(!mui.os.plus){
					showErr('错误代码：'+err,'','#FFFFFF','50px');
					hideLoading()
				}
				})

			}
			
			mui.plusReady(function() {
				mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType =parseInt(this.getAttribute("title"));
					var urlId = 'newsDetail';
					var baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
					switch(contentItemType) {
						case 1:
							urlId = 'newsDetail';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
						case 2:
							urlId = 'videoDetail';
							baseUrl = 'videoDetail.html?ContentItemId=' + contentItemId;
							break;
						case 3:
							urlId = 'imgsDetail';
							baseUrl = 'imgsDetail.html?ContentItemId=' + contentItemId;
							break;
						default:
							urlId = 'newsDetail';
							baseUrl = 'newsDetail.html?ContentItemId=' + contentItemId;
							break;
					}
					var curl = shareUrl+baseUrl;
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
							ContentItemId: contentItemId
						}
					})

				});
			})
			if(!mui.os.plus) {
				mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
					var contentItemId = this.getAttribute('id');
					var contentItemType =parseInt(this.getAttribute("title"));
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
					var curl = shareUrl+baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({ url: baseUrl, id: urlId });
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
					loadData(1, tagname)
					mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
				}, 1500);

			}

			function upFresh() {
				setTimeout(function() {
					loadData(2, tagname)
					mui('#refreshContainer').pullRefresh().endPullupToRefresh();
				}, 1500);

			}
	}
}
/**
 * 评论列表（父）
 */
var commentsDetail_main={
	init:function(){
		var commentedObjectId = 0;
		var tenantTypeId = '';
		window.onload = function() {
			//获取url中的targetId参数                                                                                                           
			if(mui.os.plus) {
				mui.plusReady(function() {
					var self = plus.webview.currentWebview();
					commentedObjectId = self.commentedObjectId;
					tenantTypeId = self.tenantTypeId;
					//关闭等待框                                                                                                               
					plus.nativeUI.closeWaiting();
					//显示当前页面                                                                                                              
					mui.currentWebview.show();
				});
			} else {
				commentedObjectId = getUrlParam('commentedObjectId');
				tenantTypeId = getUrlParam('tenantTypeId');
			}
			var baseUrl = 'commentsDetail_sub.html'
			var url = mui.os.plus ? baseUrl : baseUrl + '?commentedObjectId=' + commentedObjectId + '&tenantTypeId=' + tenantTypeId;
			mui.init({
				subpages: [{
					url: url,
					id: 'commentsDetail_sub.html',
					styles: {
						top: '51px',
						bottom: '0px',
					},
					extras: {
						commentedObjectId: commentedObjectId,
						tenantTypeId: tenantTypeId
					}
				}]

			});

		}
	}
}
/**
 * 评论列表（子）
 */
var commentsDetail_sub={
	init:function(){
		function login() {
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
			mui.init({
				pullRefresh: {
					container: '#pullrefresh',
					down: {
						callback: pulldownRefresh
					},
					up: {
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});
			var page = 1;
			var commentAreas = document.getElementById("commentArea");
			showLoading('', '', '#FFFFFF');

			function getDetail(commentedObjectId, tenantTypeId, more,downcount) {
				if(more) {
					page++;
				} else {
					page = 1;
				}
				var params = {
					commentedObjectId: commentedObjectId,
					tenantTypeId: tenantTypeId,
					pageIndex: page
				}
				getData('Comment/GetCommentsDetail', params, function(data) {
					hideLoading()
					if(data.Type == 1) {
						if(data.Data && typeof(data.Data) == 'object') {
							hideErrForList('','pullrefresh');
							var data = data.Data;
							if(data.length > 0) {
								if(more) {
									commentAreas.appendChild(createComFragment(data))
								} else {
									commentAreas.innerHTML = '';
									commentAreas.appendChild(createComFragment(data,downcount))
								}

							} else {
								if(!more){
									var errForList=showErrForList('暂无数据','','','pullrefresh');
									if(errForList){
										document.getElementById("pullrefresh").appendChild(showErrForList('暂无数据','','','pullrefresh'))
									}
								}
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
						var errForList=showErrForList(data.Data,'','','pullrefresh');
						if(errForList){
							document.getElementById("pullrefresh").appendChild(showErrForList(data.Data,'','','refreshContainer'))
						}
						mui.toast(data.Data);
						return;
					}
				}, function(err) {
					hideLoading()
					mui.plusReady(function(){
						if(plus.networkinfo.getCurrentType()==1||plus.networkinfo.getCurrentType()==2){
							mui.toast('网络异常，请检查网络设置!');
							showErr('没有网络连接','','#FFFFFF');
						}else{
							showErr('错误代码：'+err,'','#FFFFFF');
							hideLoading()
						}
					})
				if(!mui.os.plus){
					showErr('错误代码：'+err,'','#FFFFFF');
					hideLoading()
				}
				})
			}

			mui("#commentAreas").on('tap', '.creator_img_comment', function(e) {
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

			var commentedObjectId = 0;
			var tenantTypeId = '';
			//B页面onload从服务器获取列表数据；                                                                                                            
			window.onload = function() {
				//获取url中的targetId参数                                                                                                           
				if(mui.os.plus) {
					mui.plusReady(function() {
						var self = plus.webview.getWebviewById('commentsDetail_main.html');
						commentedObjectId = self.commentedObjectId;
						tenantTypeId = self.tenantTypeId;
						getDetail(commentedObjectId, tenantTypeId, false);
						setIdandType(commentedObjectId, tenantTypeId, 0)
						//关闭等待框                                                                                                               
						plus.nativeUI.closeWaiting();
						//显示当前页面                                                                                                              
						mui.currentWebview.show();
					});
				} else {
					commentedObjectId = getUrlParam('commentedObjectId');
					tenantTypeId = getUrlParam('tenantTypeId');
					getDetail(commentedObjectId, tenantTypeId, false);
					setIdandType(commentedObjectId, tenantTypeId, 0)
				}

			}
			if(document.querySelector('.jh-comment-right')){
				document.querySelector('.jh-comment-right').style.display = 'none';
			}
			if(document.querySelector('.jh-comment-edit')){
				document.querySelector('.jh-comment-edit').style.display = 'block';
				document.querySelector('.jh-comment-edit').style.width = '100%';
			}
			
			/**                                                                                                                               
			 * 下拉刷新具体业务实现                                                                                                                     
			 */
			var downcount = 0;
			function pulldownRefresh() {
				setTimeout(function() {
					getDetail(commentedObjectId, tenantTypeId, false,downcount);
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed                                             
				}, 1500);
			}
			var count = 0;
			/**                                                                                                                               
			 * 上拉加载具体业务实现                                                                                                                     
			 */
			function pullupRefresh() {
				setTimeout(function() {
					getDetail(commentedObjectId, tenantTypeId, true);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。                                                                                                                              
				}, 1500);
			}
	}
}

