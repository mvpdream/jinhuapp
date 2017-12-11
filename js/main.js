// mui初始化
mui.init({
	gestureConfig: {
		swipeBack: true //启用右滑关闭功能
	}
});
// 处理从后台恢复
document.addEventListener('newintent', function() {
	checkArguments();
}, false);
window.onload = function() {
	if(mui.os.wechat) {
		var currUrl = location.href.split('#')[0];
		weChatLogin(currUrl)
	}
}
// 兼容性样式调整
var _domReady = false;
document.addEventListener('DOMContentLoaded', function() {
	_domReady = true;
	compatibleAdjust();
}, false);
var _adjust = false;

function compatibleAdjust() {
	if(_adjust || !window.plus || !_domReady) {
		return;
	}
	_adjust = true;
	// iOS平台特效
	if(mui.os.ios) {
		document.getElementById('content').className = 'scontent'; // 使用div的滚动条
		if(navigator.userAgent.indexOf('StreamApp') >= 0) { // 在流应用模式下显示返回按钮
			document.getElementById('back').style.visibility = 'visible';
		}
	}
	setTimeout(function() {
		plus.navigator.closeSplashscreen();
	}, 200);
}
getApplicationsEnabled();
//监听消息开始
document.addEventListener("plusready", function() {
	compatibleAdjust();
	// 监听点击消息事件
	plus.push.addEventListener("click", function(msg) {
		if(mui.os.ios) {
			var vData = msg.payload
		} else {
			var vData = JSON.parse(msg.payload);
		}
		var objId = vData.RelativeObjectId;
		switch(vData.NoticeTypeKey) {
			case 'NewThreadReply':
				urlId = 'threadDetail.html';
				var baseUrl = mui.os.plus ? urlId : urlId + '?threadId=' + objId;
				var curl = shareUrl + baseUrl + '?threadId=' + objId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: 'html/'+urlId,
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
				var userid = vData.ReceiverId;
				var baseUrl = 'myThreads.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me';
				userNewsandThread(baseUrl, url, userid)
				break;
			case 'CMSArticleApproved':
			case 'CMSArticleDisApproved':
				var userid = vData.ReceiverId;
				var baseUrl = 'myNews.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me';
				userNewsandThread(baseUrl, url, userid)
				break;
			case 'FollowUser':
				var userid = vData.ReceiverId;
				var baseUrl = 'userFollows_main.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me&type=userfollower';
				mui.openWindow({
					url: 'html/'+url,
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
				var userid = vData.ReceiverId;
				var baseUrl = 'userComments.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?userId=' + userid + '&username=me';
				mui.openWindow({
					url: 'html/'+url,
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
						userId: userid,
						username: 'me'
					}
				})
				break;
			case 'NewAnswer':
			case 'NewAskQuestionComment':
			case 'NewAskAnswerComment':
			case 'NewAskComment':
			case 'SetBestAnswer':
			case 'AskUser':
			case 'AskQuestionApproved':
			case 'AskAnswerApproved':
				var questionId = objId;
				var baseUrl = 'question-solved.html';
				var url = mui.os.plus ? baseUrl : baseUrl + '?questionId=' + questionId;
				var curl = shareUrl + baseUrl + '?questionId=' + questionId;
				setlsData('currUrl', curl);
				mui.openWindow({
					url: 'html/'+url,
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
				case 'DocumentManagerApproved':
				case 'DocumentManagerDisapproved':
				case 'NewDocumentComment':
					var documentId = objId;
					var baseUrl = 'documentDetail.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?documentId=' + documentId;
					var curl = shareUrl + baseUrl + '?documentId=' + documentId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: 'html/'+url,
						id: baseUrl,
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
							documentId: documentId,
							currId: 'document.html',
							type: 'document.html'
						}
					})
					break;
				case 'EventApproved':
				case 'EventDisapproved':
				case 'NewParticipate':
				case 'EventManagerApproved':
					var eventId = objId;
					var urlId = 'eventDetail.html';
					var baseUrl = 'eventDetail.html?eventId=' + eventId;
					var curl = shareUrl + baseUrl;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: 'html/'+baseUrl,
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
							eventId: eventId,
							currId: 'event.html'
						}
					})
					break;
				case 'TaskApproved':
				case 'TaskDisapproved':
					var baseUrl = 'pointTask.html';
					mui.openWindow({
						url: 'html/'+baseUrl,
						id: baseUrl,
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
					break;
				case 'MedalApproved':
				case 'MedalDisapproved':
				case 'MedalAward':
				case 'MedalRecovered':
					var baseUrl = 'medalShop.html';
					mui.openWindow({
						url: 'html/'+baseUrl,
						id: baseUrl,
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
					break;
				case 'CancelOrder':
				case 'ConfirmOrder':
				case 'CompleteOrder':
					var productId = objId;
					var baseUrl = 'pointDetail.html';
					var url = mui.os.plus ? baseUrl : baseUrl + '?productId=' + productId;
					var curl = shareUrl + baseUrl + baseUrl + '?productId=' + productId;
					setlsData('currUrl', curl);
					mui.openWindow({
						url: 'html/'+url,
						id: 'pointDetail.html',
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
							productId: productId
						}
					})
					break;
			default:
				var baseUrl = 'userNotice_main.html';
				var url = mui.os.plus ? baseUrl : baseUrl;
				mui.openWindow({
					url:'html/'+ url,
					id: 'userNotice_main.html',
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

					}
				})
				break;
		}
	}, false);
	//监听在线消息事件
	//			plus.push.addEventListener("receive", function(msg) {
	//				if(msg.aps) { // Apple APNS message
	//					alert("接收到在线APNS消息：");
	//				} else {
	//					alert("接收到在线透传消息：");
	//				}
	//				mui.toast(msg);
	//			}, false);
}, false);

function newsDetail(urlId, baseUrl, id) {
	var curl = shareUrl + baseUrl;
	setlsData('currUrl', curl);
	mui.openWindow({
		url: 'html/'+baseUrl,
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
		url: 'html/'+baseUrl,
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
//setInterval(getNoticeNum(), 60000); //1min
mui.plusReady(function() {
	setTimeout(function() {
		plus.navigator.closeSplashscreen();
	}, 500);
	var first = null;
	mui.back = function() {
		if(!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 2000);
		} else {
			if(new Date().getTime() - first < 2000) {
				plus.runtime.quit();
			}
		}
	}
	getDatawithToken('User/GetSiteSettings', {}, function(data) {
		if(data.Type == 1) {
			openPage(data.Data.EnableAnonymousBrowse)
		} else if(data.Type == 0) {
			//登录失败
			hideLoading();
			return;
		} else {
			hideLoading();
			//逻辑错误
			mui.toast(data.Data);
			return;
		}
	}, function(data) {
		setErr('','',false)
	});

	function openPage(enableAnonymousBrowse) {
		//判断是否允许匿名访问
		if(!enableAnonymousBrowse && getlsData('isLogin') == 'false') {
			mui.openWindow({
				url: 'html/login.html',
				id: 'login.html',
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
})

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
//var subpages = ['home.html', 'news.html', 'post.html', 'ask.html','document.html','vote.html','event.html','mine.html'];
var subpages = ['home.html', 'news.html', 'post.html', 'apply.html','mine.html'];
var subpage_style = {
	top: '0px',
	bottom: '56px'
};
var aniShow = {};
// 当前激活选项
var activeTab = subpages[0];
var title = document.getElementById("title");

if(mui.os.plus) {
	// 创建子页面，首个选项卡页面显示，其它均隐藏；
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var ismine = self.isMine;	
		for(var i = 0; i < subpages.length; i++) {
			var temp = {};
			if(plus.webview.getWebviewById(subpages[i])){
				plus.webview.getWebviewById(subpages[i]).close();
			}
			var sub = plus.webview.create('html/'+subpages[i], subpages[i], subpage_style);
			if(ismine && ismine) {
				var alltabs = document.querySelectorAll(".mui-tab-item");
				for(var ii = 0; ii < alltabs.length; ii++) {
					if(ii != alltabs.length - 1) {
						alltabs[ii].classList.remove('mui-active');
					} else {
						alltabs[ii].classList.add('mui-active');
					}
				}
				if(i != alltabs.length - 1) {
					sub.hide();
				} else {
					temp[subpages[i]] = "true";
					mui.extend(aniShow, temp);
				}
				activeTab = subpages[subpages.length - 1];
				var detailPage = plus.webview.getWebviewById('mine.html');
				mui.fire(detailPage, 'show', {
					show: true
				})

			} else {
				if(i > 0) {
					sub.hide();
				} else {
					temp[subpages[i]] = "true";
					mui.extend(aniShow, temp);
				}
			}
			self.append(sub);
		}
		setlsData('Loginoperation', false);
	});
} else {
	// 创建iframe代替子页面
	currentTab = 'home.html';
	var ismine = getUrlParam('isMine');
	var categories=getUrlParam('categories');
	var alltabs = document.querySelectorAll(".mui-tab-item");
	var currentTab = getlsData('homepageEntrance');
	if(currentTab == null) {
		currentTab = 'home.html';
	}
	if(ismine && ismine == 'true'&&getlsData('Loginoperation')== 'true') {
		currentTab = 'mine.html';
	}
	if(categories!=null){
		currentTab=categories+'.html';
	}
	for(var ii = 0; ii < alltabs.length; ii++) {
		if(currentTab != alltabs[ii].getAttribute('href')) {
			alltabs[ii].classList.remove('mui-active');
		} else {
			alltabs[ii].classList.add('mui-active');
		}
	}
	createIframe('.mui-content', {
		url: 'html/'+currentTab,
		style: subpage_style
	});
	activeTab =currentTab;
	setlsData('Loginoperation', false);
}

function skipPage(pageid) {
	if(mui.os.plus) {
		var self = plus.webview.currentWebview();
		var index = subpages.indexOf(pageid);
		for(var i = 0; i < subpages.length; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			var alltabs = document.querySelectorAll(".mui-tab-item");
			for(var ii = 0; ii < alltabs.length; ii++) {
				if(ii != index) {
					alltabs[ii].classList.remove('mui-active');
				} else {
					alltabs[ii].classList.add('mui-active');
				}
			}
			if(i != index) {
				sub.hide();
			} else {
				temp[subpages[i]] = "true";
				mui.extend(aniShow, temp);
			}
			activeTab = subpages[index];
			var detailPage = plus.webview.getWebviewById(pageid);
			mui.fire(detailPage, 'show', {
				show: true
			})
			self.append(sub);
		}
	} else {
		var index = subpages.indexOf(pageid);
		var alltabs = document.querySelectorAll(".mui-tab-item");
		for(var ii = 0; ii < alltabs.length; ii++) {
			if(ii != index) {
				alltabs[ii].classList.remove('mui-active');
			} else {
				alltabs[ii].classList.add('mui-active');
			}
		}
		activeTab = subpages[index];
		createIframe('.mui-content', {
			url: 'html/'+pageid,
			style: subpage_style
		});
	}

}
var news = false;
var post = false;
//var ask = false;
var mine = false;
//var document=false;
//var vote=false;
//var event=false;
var apply = false;
// 选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if(targetTab == activeTab) {
		return;
	}
	setlsData('homepageEntrance', targetTab);
	//更换标题
	//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	if(mui.os.plus) {
		//若为iOS平台或非首次显示，则直接显示
		var detailPage = plus.webview.getWebviewById(targetTab);
		if(detailPage.id == "news.html" && !news) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			news = true;
		}
		if(detailPage.id == "post.html" && !post) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			post = true;
		}
//		if(detailPage.id == "ask.html" && !ask) {
//			mui.fire(detailPage, 'show', {
//				show: true
//			})
//			ask = true;
//		}
//		if(detailPage.id == "document.html" && !document) {
//			mui.fire(detailPage, 'show', {
//				show: true
//			})
//			document = true;
//		}
//		if(detailPage.id == "vote.html" && !vote) {
//			mui.fire(detailPage, 'show', {
//				show: true
//			})
//			vote = true;
//		}
//		if(detailPage.id == "event.html" && !vote) {
//			mui.fire(detailPage, 'show', {
//				show: true
//			})
//			event = true;
//		}
		if(detailPage.id == "apply.html" && !apply) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			apply=true;
		}
		if(detailPage.id == "mine.html" && !mine) {
			mui.fire(detailPage, 'show', {
				show: true
			})
			mine = true;
		}
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
	} else {
		// 创建iframe代替子页面
		createIframe('.mui-content', {
			url: 'html/'+targetTab,
			style: subpage_style
		});
	}
	//更改当前活跃的选项卡
	activeTab = targetTab;
	setlsData('tab-news', news)
	setlsData('tab-post', post)
});
setlsData('tab-news', news)
setlsData('tab-post', post)

function changeTab(tab) {
	var alltabs = document.querySelectorAll(".mui-tab-item");
	for(var ii = 0; ii < alltabs.length; ii++) {
		if(alltabs[ii].getAttribute('href') != tab) {
			alltabs[ii].classList.remove('mui-active');
		} else {
			alltabs[ii].classList.add('mui-active');
		}
	};
	activeTab = tab;
}

function getNoticeNum() {
	getDatawithToken('User/GetMyNotice?pageIndex=' + 1, {}, function(data) {
		if(data.Type == 1) {
			if(data.Data && typeof(data.Data) == 'object') {
				if(data.Data.length != 0 && data.Data.NoticeCount) {
					document.getElementById("noticeNum").style.display = 'inherit';
					document.getElementById("noticeNum").innerHTML = data.Data.NoticeCount
				} else {
					document.getElementById("noticeNum").style.display = 'none';
					document.getElementById("noticeNum").innerHTML = "";
				}

			} else {
				mui.toast(data.Data);
			}

		} else if(data.Type == 0) {
			//mui.toast("请登录后再进行操作");
			return;
		} else {
			//逻辑错误
			mui.toast(data.Data);
			return;
		}
	}, function(err) {

	})
}

function getApplicationsEnabled(){
	getData('User/GetApplicationsEnabled', {}, function(data) {
		if(data.Type == 1) {
			if(data.Data.length!=0){
				var applications=data.Data.split(',');
				askEnabled=(applications.indexOf('Ask')!=-1)?true:false;
				documentEnabled=(applications.indexOf('Document')!=-1)?true:false;
				eventEnabled=false;
				voteEnabled=false;
				getData('User/GetEventVoteApplicationsEnabled',{},function(data){
					eventEnabled=(applications.indexOf('Event')!=-1&&data.Data.showEventNav)?true:false;
					voteEnabled=(applications.indexOf('Vote')!=-1&&data.Data.showVoteNav)?true:false;
					pointMallEnabled=(applications.indexOf('PointMall')!=-1)?true:false;
					var enabledArr={
						askEnabled:askEnabled,
						documentEnabled:documentEnabled,
						eventEnabled:eventEnabled,
						voteEnabled:voteEnabled,
						pointMallEnabled:pointMallEnabled
					}
					setlsData('ApplicationsEnabled',JSON.stringify(enabledArr))
				},function(err){
					pointMallEnabled=(applications.indexOf('PointMall')!=-1)?true:false;
					var enabledArr={
						askEnabled:askEnabled,
						documentEnabled:documentEnabled,
						eventEnabled:eventEnabled,
						voteEnabled:voteEnabled,
						pointMallEnabled:pointMallEnabled
					}
					setlsData('ApplicationsEnabled',JSON.stringify(enabledArr))
				})
				if(!askEnabled&&!documentEnabled&&!eventEnabled&&!voteEnabled){
					if(document.getElementById("apply")){
						document.getElementById("apply").style.display='none'
					}	
				}
			}
			
		} else if(data.Type == 0) {
			//mui.toast("请登录后再进行操作");
			return;
		} else {
			//逻辑错误
			mui.toast(data.Data);
			return;
		}
	}, function(err) {

	})
}

// 自定义事件，模拟点击“首页选项卡”
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