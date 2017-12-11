/**
 * 在网页中打开app使用了mLink
 */
var bigContainer = document.querySelector('body');
var nav=document.querySelector('header');
		
function creatBanner() {
	var value = sessionStorage.getItem("openApp"); 
	if(value==null||value==undefined){
		var div = document.createElement('div');
		div.id = 'openApp_Banner';
		div.className = 'jh-openApp-Banner';
		div.innerHTML = '<div class="jh-openAppBanner-left">' +
			'<span id="closeBanner" class="mui-icon mui-icon-close" style="color: #ffffff;font-size: 18px;"></span>' +
			'<img src="../img/180.png" class="jh-openApp-close" data-bd-imgshare-binded="1">'+
			'<span style="color: white;margin-left:6px;font-size: 13px;">近乎移动端</span>' +
			'</div>' +
			'<div class="jh-openAppBanner-right">' +
			'<a id="btnOpenApp" style="color: #ffffff;" href="">立即打开</a>' +
			'</div >';
		bigContainer.insertBefore(div, bigContainer.childNodes[0]);
		bigContainer.style.marginTop='50px';
		nav.style.top='50px';
		if(pageName()[0]=='question-solved'){
			document.getElementById("refreshContainer").style.marginTop='50px';
		}
		var closeBanner=document.getElementById("closeBanner");
		closeBanner.addEventListener('tap',function(e){
			sessionStorage.setItem("openApp", "true");
			if(pageName()[0]=='question-solved'){
				document.getElementById("refreshContainer").style.marginTop='0';
			}
			document.getElementById("openApp_Banner").style.display='none';
			bigContainer.style.marginTop='0';
			nav.style.top='0'
		})
	}
	
}


function initOpenApp(name, id, other) {
	var value = sessionStorage.getItem("openApp"); 
	
	if(value==null||value==undefined){
		var options = {
			mlink: "AchY",
			button: document.querySelector('a#btnOpenApp'),
			autoLaunchApp: false,
			autoRedirectToDownloadUrl: true,
			downloadWhenUniversalLinkFailed: false,
			inapp: true,
			cparams: {
				name: name,
				id: id,
				other: other ? JSON.stringify(other) : {}
			}
		}
		new Mlink(options);
	}
}

var _id = 0;
var _name = 'newsDetail';
var creatnew = false;
var Extras = null;
var HttpUrl = "http://demo.jinhusns.com/WeChat";
//var HttpUrl = "http://www.fanggaoming.cn/WeChat";
var shareUrl=HttpUrl + '/html/';
// 判断启动方式
function checkArguments(isFirst) {
	var args = plus.runtime.arguments;
	if(args) {
		var str = args.substring(8, args.length);
		// 处理args参数，如打开新页面等
		var otherParams = getUrlParam('mw_cp_other', str);
		var otherParmesArr = {};
		if(otherParams != null) {
			otherParams = decodeURIComponent(otherParams);
			otherParmesArr = otherParams;
		}
		var name = getUrlParam('mw_cp_name', str);
		var id = getUrlParam('mw_cp_id', str);
		var urlId = name + '.html';
//		alert('_id:'+_id);
//		alert('id:'+id);
//		alert('_name:'+_name);
//		alert('name:'+name);
		if(name != null) {
			if(name == _name && id == _id) {
				creatnew = false;
			} else {
				creatnew = true;
			}
			var baseUrl = urlId + '?ContentItemId=' + id;
			var curl = shareUrl + baseUrl;
			if(name == 'threadDetail') {
				baseUrl = urlId + '?threadId=' + id;
				curl = shareUrl+ urlId + '?threadId=' + id;
			}
			if(name == 'question-solved') {
				baseUrl = urlId + '?questionId=' + id;
				curl = shareUrl+ urlId + '?questionId=' + id;
			}
			if(name == 'documentDetail'||name == 'docImgsDetail'||name == 'docVideoDetail') {
				baseUrl = urlId + '?documentId=' + id;
				curl = shareUrl+ urlId + '?documentId=' + id;
			}
			if(name=='eventThreadDetail'){
				baseUrl = urlId + '?threadId=' + id +'&'+'ThreadType='+otherParmesArr.ThreadType+'&'+'AssociateId='+otherParmesArr.AssociateId;
				curl = shareUrl + baseUrl + '?threadId=' + id+'&'+'ThreadType='+otherParmesArr.ThreadType+'&'+'AssociateId='+otherParmesArr.AssociateId;
			}
			if(name=='eventDetail'){
				baseUrl = urlId + '?eventId=' + id;
				curl = shareUrl+ urlId + '?eventId=' + id;
			} 
			if(name=='textVote'||name=='imageVote'){
				baseUrl = urlId + '?voteId=' + id;
				curl = shareUrl+ urlId + '?voteId=' + id;
			}
			if(name=='pointDetail'){
				baseUrl = urlId + '?productId=' + id;
				curl = shareUrl+ urlId + '?productId=' + id;
			}
			_id = id;
			_name = name;
			setlsData('currUrl', curl);
			if(name == 'threadDetail'&&otherParmesArr==null) {
				Extras = {
					threadId: id,
					currId: 'postList.html'
				}
			}else if(name == 'threadDetail'&&otherParmesArr!=null){
				Extras={
					threadId: id,
					ThreadType:otherParmesArr.ThreadType,
					AssociateId:otherParmesArr.AssociateId,
					currId: 'postList.html'
				}
			}else if(name == 'question-solved') {
				Extras = {
					questionId: id,
					currId: 'question-solved.html'
				}
			}else if(name == 'documentDetail'||name == 'docImgsDetail'||name == 'docVideoDetail'){
				Extras = {
					documentId: id,
					currId: 'document.html',
					type:'document.html'
				}
			}else if(name=='eventDetail'){
				Extras={
					eventId: id,
					currId: 'event.html'
				}
			}else if(name == 'eventThreadDetail'){
				Extras={
					threadId: id,
					ThreadType:otherParmesArr.ThreadType,
					AssociateId:otherParmesArr.AssociateId,
					currId: 'postList.html'
				}
			}else if(name=='textVote'||name=='imageVote'){
				Extras = {
					voteId: id,
					tabIndex: 0
				}
			}else if(name=='pointDetail'){
				Extras = {
					productId: id
				}
			}else {
				Extras = {
					ContentItemId: id
				}
			}
			mui.openWindow({
				url: (isFirst)?baseUrl:'html/'+baseUrl,
				id: urlId,
				show: {
					autoShow: true
				},
				createNew: creatnew,
				waiting: {
					options: {
						loading: {
							height: '35px'
						}
					}
				},
				extras: Extras
			})
		}

	}
}

/**
 * 解决当页面成功唤起app之后，我们再切换回来浏览器，发现跳转到了下载页面。
 */
//$(document).on('visibilitychange webkitvisibilitychange', function() {
//	var tag = document.hidden || document.webkitHidden;
//	if(tag) {
//		clearTimeout(timer);
//	}
//})
//
//$(window).on('pagehide', function() {
//	clearTimeout(timer);
//})
//document.getElementById("GoToAppButton").addEventListener('tap', function() {
//	if(mui.os.wechat) {
//		alert('请在浏览器中打开此链接')
//	}
//	applink(appstore);
//})