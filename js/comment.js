/**
 * 评论
 */
var com={
	isFavorited : true
}
var isScore = false;
var pageUrl = window.location.pathname;
pageUrl = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.length);

var bigContainer = document.querySelector('body');
var commentedObjectId = 0;
var tenantTypeId = '';
var commentsNum = 0;
var floorNumber = 0;
/**
 * 初始值
 * @param {Object} id 被评论对象Id
 * @param {Object} type 被评论对象类型
 * @param {Object} num 评论数
 */
function setIdandType(id, type, num) {
	commentedObjectId = id;
	tenantTypeId = type;
	commentsNum = num;
	if(pageUrl == 'documentDetail.html' || pageUrl == 'docImgsDetail.html' || pageUrl == 'docVideoDetail.html') {
		document.getElementById("docsupportNum").innerHTML = num;
		if(!mui.os.plus) {
			document.getElementById("docshare").style.display = 'none';
		}
	} else {
		document.getElementById("supportNum").innerHTML = num
	}

}

function docCanDownload(canDownload) {
	if(!canDownload) {
		document.getElementById("docdownload").style.display = 'none';
		if(!mui.os.plus) {
			document.getElementById("docfavor").style.textAlign = 'center';
			document.getElementById("docfavor").style.paddingLeft = 0
		}
	}
}

function docCanComment(canComment) {
	if(document.getElementById("jgb")) {
		document.getElementById("jgb").style.display = canComment ? 'inherit' : 'none';
	}
	if(document.getElementById("commentList")) {
		document.getElementById("commentList").style.display = canComment ? 'inherit' : 'none';
	}
	if(!canComment) {
		document.getElementById("docmorecom").style.display = 'none';
		if(!mui.os.plus) {
			document.getElementById("docstart").style.textAlign = 'center';
			document.getElementById("docstart").style.paddingLeft = 0
		}
	}
}
/**
 * 构建底部评论框
 */
function creatCommentBar() {
	var div = document.createElement('div');
	div.innerHTML = '<div class="bdsharebuttonbox" style="display:none">' +
		'<a href="#" class="bds_more" data-cmd="more"></a>' +
		'<a id="qq" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a>' +
		'<a id="sina" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a>' +
		'<a id="weixin" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a>' +
		'</div>' +
		'	<a id="editComment">' +
		'				<div class="jh-comment-edit">' +
		'					<i class="fa fa-pencil mui-icon mui-icon-bars mui-pull-right" aria-hidden="true"></i>' +
		'				</div>' +
		'			</a>' +
		'			<div class="jh-comment-right">' +
		'				<a id="morecom"><span class="mui-icon mui-icon-chat comment_menu"><span id="supportNum" class="jh-bar-comment-num">' + commentsNum + '</span></span>' +
		'					</a>' +
		'					<a id="favorNew" onclick="favorOperation()" style="padding-left: 16px;float: left;"><span id="favorNews" class="mui-icon mui-icon-extra mui-icon-extra-heart comment_menu"></span></a>' +
		'					<a id="shares" style="float: right;padding-right: 14px;">' +
		'						<span class="mui-icon mui-icon-extra mui-icon-extra-share comment_menu"></span></a>' +
		'				</div>';
	document.querySelector('.jh-bar-comment') && document.querySelector('.jh-bar-comment').appendChild(div);

}

function creatCommentBarforDoc() {
	var div = document.createElement('div');
	div.className = 'nav';
	div.innerHTML = '<div class="bar-item" id="docmorecom" style="text-align: left;">' +
		'                  <span class="mui-icon mui-icon-chat comment_menu"><span id="docsupportNum" class="jh-bar-comment-num">99</span></span>' +
		'                </div>' +
		'                <div class="bar-item" id="docfavor" style="text-align: left;padding-left: 10px;">' +
		'                	<span class="mui-icon mui-icon-extra mui-icon-extra-heart comment_menu"></span>' +
		'                </div>' +
		'                <div class="bar-item" id="docshare" style="text-align: center">' +
		'                    <span class="mui-icon mui-icon-extra mui-icon-extra-share comment_menu"></span>' +
		'                </div>' +
		'                 <div class="bar-item" id="docstart" style="text-align: right;padding-right: 10px;">' +
		'                	<span class=" mui-icon fa fa-star-o comment_menu"></span>' +
		'                </div>' +
		'                <div class="bar-item" id="docdownload" onclick="download_doc()" style="text-align: right;">' +
		'                    <span class="mui-icon fa fa-arrow-down comment_menu"></span>' +
		'                </div>';
	document.querySelector('.jh-bar-comment') && document.querySelector('.jh-bar-comment').appendChild(div);

}

/**
 * 构建评论弹出窗
 */
function creatCommentPop() {
	var div = document.createElement('div');
	div.id = 'popView_comment';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
	div.innerHTML = '<div class="pop_view">' +
		'	<textarea rows="5" autofocus="autofocus" name="textarea" placeholder="输入评论" id="comment-textarea" autofocus="autofocus"></textarea>' +
		'	<div class="mui-text-center" style="margin-top:-12px;">' +
		'		<button id="cancelCom" class="mui-btn" style="margin-right: 20px;padding:6px 20px;padding-top: 8px;">取消</button>' +
		'		<button id="sendCom"  class="mui-btn mui-btn-primary" style="margin-left: 20px;padding:6px 20px;padding-top: 8px;">发送</button>' +
		'	</div>' +
		'</div>';
	bigContainer.appendChild(div);
}
/**
 * 构建分享弹出窗
 */
function creatSharePop() {
	var div = document.createElement('div');
	div.id = 'popView_share';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
	div.innerHTML = '<div class="pop_view_share">' +
		'				<div class="pop_view_item" id=1>' +
		'					<img src="../img/weixin-icon.png" srcset="../img/weixin-icon@2x.png 2x" />' +
		'					<div>微信好友</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=0>' +
		'					<img src="../img/pyy-icon.png" srcset="../img/pyy-icon@2x.png 2x" />' +
		'					<div>微信朋友圈</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=3>' +
		'					<img src="../img/qq-icon.png" srcset="../img/qq-icon@2x.png 2x" />' +
		'					<div>QQ空间</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id=2>' +
		'					<img src="../img/weibo-icon.png" srcset="../img/weibo-icon@2x.png 2x" />' +
		'					<div>微博</div>' +
		'				</div>' +
		'			</div>';
	bigContainer.appendChild(div);
}
/**
 * 构建分享弹出窗（浏览器）
 */
function creatSharePop1() {
	var div = document.createElement('div');
	div.id = 'popView_share1';
	div.style.backgroundColor = '#FFFFFF';
	div.className = 'box mui-popover mui-popover-action mui-popover-bottom';
	div.innerHTML = '<div  class="pop_view_share">' +
		'				<div class="pop_view_item" id="weixinBtn">' +
		'					<img src="../img/weixin-icon.png" srcset="../img/weixin-icon@2x.png 2x" />' +
		'					<div>微信好友</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="weixinpBtn">' +
		'					<img src="../img/pyy-icon.png" srcset="../img/pyy-icon@2x.png 2x" />' +
		'					<div>微信朋友圈</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="qqBtn">' +
		'					<img src="../img/qq-icon.png" srcset="../img/qq-icon@2x.png 2x" />' +
		'					<div>QQ空间</div>' +
		'				</div>' +
		'				<div class="pop_view_item" id="sinaBtn">' +
		'					<img src="../img/weibo-icon.png" srcset="../img/weibo-icon@2x.png 2x" />' +
		'					<div>微博</div>' +
		'				</div>' +
		'			</div>';
	bigContainer.appendChild(div);
	document.getElementById("weixinBtn").addEventListener('tap', function() {
		document.getElementById("weixin").click()
	})
	document.getElementById("weixinpBtn").addEventListener('tap', function() {
		document.getElementById("weixin").click()
	})
	document.getElementById("qqBtn").addEventListener('tap', function() {
		document.getElementById("qq").click()
	})
	document.getElementById("sinaBtn").addEventListener('tap', function() {
		document.getElementById("sina").click()
	})
}
/**
 * 构建子评论
 * @param {Object} data 子评论对象
 */
var creatChidFragment = function(data) {
	//子评论
	var bigContainers = "<div id='childList'>";
	var itemLen = '';
	for(var i = 0; i < data.length; i++) {
		var itemContainer = "";
		var dis = '';
		if(i > 1) {
			dis = 'none'
		} else {
			dis = 'block';
		}
		itemContainer += ("<p class='"+ data[i].User +"' id='" + data[i].CommentId + "'style='display:" + dis + "'>" + data[i].User + "回复" + data[i].Owner + "： " + data[i].Body + "</p>");
		bigContainers += itemContainer;
	}
	bigContainers += '</div>'
	if(data.length > 2) {
		itemLen = "<h5 class='mui-text-center' style='margin-top:10px;margin-bottom:0'>"+
		"<span>共<span id='comLen'>" + data.length + "</span>条评论</span><a class='showState'> 展开</a></h5>";
		return bigContainers += itemLen;
	} else {
		return bigContainers;
	}
}
/**
 * 构建评论元素
 * @param {Object} data
 */
var createComFragment = function(data, downcount) {
	var fragment = document.createDocumentFragment();
	var div;
	var lastDiv=false;
	for(var i = 0; i < data.length; i++) {
		downcount++;
		if(i==data.length-1){lastDiv=true}
		fragment.appendChild(creatsingleCom(data[i], i, downcount,lastDiv));
	}
	return fragment;
};
function defaultAvator(A){
	A.src='../img/avatar.jpg'
}
function setLastBoard(){
	var comments=document.getElementById("commentArea").querySelectorAll('.comment_content');
	mui.each(comments, function(index, item) {
		if(index==comments.length-2){
			comments[index].style.borderBottom='1px solid #e4e4e4'
		}
		if(index==comments.length-1){
			comments[index].style.borderBottom='none'
		}
	});
}
/**
 * 构建单个评论元素
 * @param {Object} data
 * @param {Object} i
 */

function creatsingleCom(data, i, downcount) {
	if(downcount == 1) {
		floorNumber = downcount;
	} else {
		floorNumber = floorNumber;
		floorNumber++;
	}

	var fragment = document.createDocumentFragment();
	var div;
	div = document.createElement('div');
	div.className = 'comment_body';
	var child;
	var dis = 'none';
	if(data.ChildComments != null) {
		dis = 'block';
		child = creatChidFragment(data.ChildComments)
	} else {
		dis = 'none';
	}
	var userAvator = data.Avatar == "" ? "../img/avatar.jpg" : getImgUrl(data.Avatar);
	if(tenantTypeId == 'Thread') {
		div.innerHTML = '<div class="comment_img">' +
			'		    		<img class="creator_img_comment " id=' + data.UserId + ' src=' + userAvator + ' onerror="defaultAvator(this);">' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User.substring(0,12) + '</h5>' +
			'					<h5 class="comment_top_right">' + (floorNumber) + '楼</h5>' +
			'				</div>' +
			'				<p id=' + data.CommentId + ' title="parent" class="'+ data.User +'">' +
			'					' + data.Body + '' +
			'				</p>' +
			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
			'				<div class="comment_top">' +
			'			    	<h5 class="comment_top_left">' + data.DateCreated + '</h5>' +
			'					<h5 class="comment_top_right">回复( ' + data.ChildCommentCount + ' )</h5>' +
			'				</div>' +
			'			</div>';
	} else {
		div.innerHTML = '<div class="comment_img">' +
			'		    		<img class="creator_img_comment " id=' + data.UserId + ' src=' + userAvator + ' onerror="defaultAvator(this);">' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User.substring(0,12) + '</h5>' +
			'					<h5 class="comment_top_right">' + data.DateCreated + '</h5>' +
			'				</div>' +
			'				<p id=' + data.CommentId + ' title="parent" class="'+ data.User +'">' +
			'					' + data.Body + '' +
			'				</p>' +
			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
			'			</div>';
	}

	fragment.appendChild(div);

	return fragment;
}
if(pageUrl == 'pointDetail.html' || pageUrl == 'imageVote.html' || pageUrl == 'textVote.html'){
	
}else{
	if(pageUrl == 'documentDetail.html' || pageUrl == 'docImgsDetail.html' || pageUrl == 'docVideoDetail.html') {
		creatCommentBarforDoc()
	} else {
		creatCommentBar();
	}
}

creatCommentPop();
creatSharePop();
creatSharePop1();
if(!mui.os.plus) {
	if(pageUrl == 'pointDetail.html' || pageUrl == 'imageVote.html' || pageUrl == 'textVote.html'){
	
	}else{
		if(document.getElementById("morecom")) {
			document.getElementById("morecom").firstElementChild.style.width = 'auto';
		}
		if(document.querySelector('.jh-comment-right')) {
			document.querySelector('.jh-comment-right').style.width = '100%';
			document.querySelector('.jh-comment-right').style.padding = '0 10px 0 10px';
			document.getElementById("shares").style.display = 'none';
			document.getElementById("favorNew").style.float = 'right';
		}
		if(document.querySelector('.jh-comment-edit')) {
			document.querySelector('.jh-comment-edit').style.display = 'none';
		}
	}	
}
//if(!mui.os.wechat && !mui.os.plus) {
//	document.getElementById("morecom").firstElementChild.style.width='33%';
//	document.getElementById("favorNew").firstElementChild.style.width='33%';
//	document.getElementById("shares").firstElementChild.style.width='33%';
//	document.getElementById("morecom").firstElementChild.style.textAlign='left';
//	document.getElementById("shares").firstElementChild.style.textAlign='right';
//	document.querySelector('.jh-comment-right').style.padding = '0 10px 0 10px';
//	document.getElementById("favorNew").style.width='33%';
//	document.getElementById("shares").style.width='33%';
//	document.getElementById("favorNew").style.float='none';
//	document.getElementById("favorNew").style.paddingLeft='0';
//	document.getElementById("shares").style.float='none';
//	document.getElementById("shares").style.paddingRight='0';
//	document.querySelector('.jh-comment-edit').style.display = 'none';
//	document.querySelector('.jh-comment-right').style.width = '100%';
//}

function canComment(isComment) {
	document.getElementById("jgb").style.display = !isComment ? 'inherit' : 'none';
	document.getElementById("commentList").style.display = !isComment ? 'inherit' : 'none';
	if(isComment) {
		if(mui.os.plus) {
			if(document.querySelector('.jh-comment-edit')) {
				document.querySelector('.jh-comment-edit').style.display = 'none';
				document.getElementById("morecom").firstElementChild.style.width = '33%';
				document.getElementById("favorNew").firstElementChild.style.width = '33%';
				document.getElementById("shares").firstElementChild.style.width = '33%';
				document.getElementById("morecom").firstElementChild.style.textAlign = 'left';
				document.getElementById("shares").firstElementChild.style.textAlign = 'right';
				document.querySelector('.jh-comment-right').style.padding = '0 10px 0 10px';
				document.getElementById("favorNew").style.width = '33%';
				document.getElementById("shares").style.width = '33%';
				document.getElementById("favorNew").style.float = 'none';
				document.getElementById("favorNew").style.paddingLeft = '0';
				document.getElementById("shares").style.float = 'none';
				document.getElementById("shares").style.paddingRight = '0';
				document.querySelector('.jh-comment-edit').style.display = 'none';
				document.querySelector('.jh-comment-right').style.width = '100%';
				document.getElementById("morecom").firstElementChild.classList.add('mui-disabled');
			}

		} else {
			if(document.getElementById("morecom")) {
				document.getElementById("morecom").firstElementChild.classList.add('mui-disabled');

			}
		}
	}

}
var docmorecomment = document.getElementById("docmorecomment");
var morecomment = document.getElementById("morecomment");
var morecom = document.getElementById("morecom");
var docmorecom = document.getElementById("docmorecom");
var cancelCom = document.getElementById("cancelCom");
var sendCom = document.getElementById("sendCom");
var commentText = document.getElementById("comment-textarea");
var favorNews = document.getElementById("favorNews");
var docfavor = document.getElementById("docfavor");
var docstart = document.getElementById("docstart");
var editComment = document.getElementById("editComment");
var confirmScore = document.getElementById("confirmScore");
var scoreTitle = document.getElementById("scoreTitle")

mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
	if(mui.os.plus) {
		mui('#popView_share').popover('toggle');
		shareHref(this.getAttribute('id'),function(){});
	}

})

mui("#commentArea").on('tap', '.showState', function(e) {
	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
	mui.each(allp, function(index, item) {
		if(item.style.display == 'block' && index > 1) {
			e.target.innerHTML=' 展开'
			item.style.display = 'none'
		} else {
			e.target.innerHTML=' 收起'
			item.style.display = 'block'
		}

	})
})
mui("#commentAreas").on('tap', '.showState', function(e) {
	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
	mui.each(allp, function(index, item) {
		if(item.style.display == 'block' && index > 1) {
			e.target.innerHTML=' 展开'
			item.style.display = 'none'
		} else {
			e.target.innerHTML=' 收起'
			item.style.display = 'block'
		}
	})
})
var parentId = 0;

function creatsingleChilCom(data, i) {
	var p = document.createElement("p");
	p.id = data.CommentId;
	p.className=data.User;
	p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
	return p;
}
docmorecom && docmorecom.addEventListener('tap', function() {
	moreComment();
})
morecomment && morecomment.addEventListener('tap', function() {
	moreComment();
})
morecom && morecom.addEventListener('tap', function() {
	moreComment();
})

function moreComment() {
	var baseUrl = 'commentsDetail_main.html';
	var url = mui.os.plus ? baseUrl : baseUrl + '?commentedObjectId=' + commentedObjectId + '&tenantTypeId=' + tenantTypeId;
	mui.openWindow({
		url: url,
		id: 'commentsDetail_main.html',
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
			commentedObjectId: commentedObjectId,
			tenantTypeId: tenantTypeId
		}
	})
}
editComment && editComment.addEventListener('tap', function() {
	var islog = getlsData('isLogin');
	parentId = 0;
	if(islog == 'true') {
		document.getElementById('popView_comment').getElementsByTagName('textarea')[0].placeholder = "输入评论";
		mui('#popView_comment').popover('toggle');
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}
})

cancelCom && cancelCom.addEventListener('tap', function() {
	mui('#popView_comment').popover('toggle');
})

sendCom && sendCom.addEventListener('tap', function() {
	if(document.getElementById('sendCom').title){
		parentId = 0;
	}
	mui('#popView_comment').popover('toggle');
	submitComment(parentId);
})
document.getElementById("docshare") && document.getElementById("docshare").addEventListener('tap', function() {
	if(mui.os.plus) {
		mui('#popView_share').popover('toggle');
	} else {
		mui('#popView_share1').popover('toggle');
	}

})
document.getElementById("shares") && document.getElementById("shares").addEventListener('tap', function() {
	if(mui.os.plus) {
		mui('#popView_share').popover('toggle');
	} else {
		mui('#popView_share1').popover('toggle');
	}

})
docfavor && docfavor.addEventListener('tap', function() {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		DocFavoriteOperation(commentedObjectId)
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}

})

function DocFavoriteOperation(id) {
	var waiting = showWaiting();
	postDatawithToken('Document/DocumentHandle?documentId=' + id + '&method=favorite', {}, function(data) {
		closeWaiting(waiting);
		if(data.Type == 1) {
			favorDoc(!com.isFavorited);
			com.isFavorited = !com.isFavorited;
			mui.toast(data.Data);
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
function favorOperation(){
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		ThreadFavoriteOperation(commentedObjectId)
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}
}

function ThreadFavoriteOperation(id) {
	var path = (tenantTypeId == 'Thread') ? 'Post/ThreadFavoriteOperation?threadId=' : 'CMS/FavoriteContentItem?contentItemId=';
	if(tenantTypeId == 'Event'){
		var path='Event/FavoriteEvent?eventId='
	}
	var waiting = showWaiting();
	postDatawithToken(path + id, {}, function(data) {
		closeWaiting(waiting);
		if(data.Type == 1) {
			favorThread(!com.isFavorited);
			com.isFavorited = !com.isFavorited;
			mui.toast(data.Data);
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
function eventFavoriteOperation(id) {
	var path = (tenantTypeId == 'Thread') ? 'Post/ThreadFavoriteOperation?threadId=' : 'CMS/FavoriteContentItem?contentItemId=';
	var waiting = showWaiting();
	postDatawithToken(path + id, {}, function(data) {
		closeWaiting(waiting);
		if(data.Type == 1) {
			favorThread(!com.isFavorited);
			com.isFavorited = !com.isFavorited;
			mui.toast(data.Data);
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

function SetStarReview(id, num) {
	var waiting = showWaiting();
	postDatawithToken('Document/SetStarReview?documentId=' + id + '&RateNumber=' + num, {}, function(data) {
		closeWaiting(waiting);
		if(data.Type == 1) {
			mui('#scorePop').popover('hide');
			isScore = true;
			setTimeout(function() {
				ScoreDoc(isScore, userStarReview)
			}, 500)
			mui.toast(data.Data);
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

function favorDoc(status) {
	if(status) {
		docfavor.firstElementChild.className = 'mui-icon mui-icon-extra mui-icon-extra-heart-filled comment_menu';
	} else {
		docfavor.firstElementChild.className = 'mui-icon mui-icon-extra mui-icon-extra-heart comment_menu';
	}
}

function ScoreDoc(status, num) {
	if(status) {
		docstart.firstElementChild.className = 'mui-icon fa fa-star comment_menu';
		$("#starts").raty({
			readOnly: true,
			score: num,
			path: 'img', //图片路径  
			starOn: '../../img/pf-on.png', //黄色星星图片（可自定义）  
			starOff: '../../img/pf-off.png'
		});
		scoreTitle.innerHTML = '您已对本文档进行了评价';
		confirmScore.style.borderColor = '#999999';
		confirmScore.style.backgroundColor = '#999999';
		confirmScore.innerHTML = '无法再次评价';
		confirmScore.setAttribute("disabled", "disabled")
	} else {
		scoreTitle.innerHTML = '请对本文档进行评价';
		confirmScore.innerHTML = '确定';
		docstart.firstElementChild.className = 'mui-icon fa fa-star-o comment_menu';
		confirmScore.removeAttribute("disabled");
	}
}
confirmScore && confirmScore.addEventListener('tap', function() {
	console.log(userStarReview);
	if(userStarReview > 0) {
		SetStarReview(commentedObjectId, userStarReview)
	} else {
		mui.toast('请对该文档进行评价')
	}

})

function favorThread(status) {
	if(status) {
		favorNews.className = 'mui-icon mui-icon-extra mui-icon-extra-heart-filled comment_menu';
	} else {
		favorNews.className = 'mui-icon mui-icon-extra mui-icon-extra-heart comment_menu';
	}
}

function DownloadDocument(id) {
	var waiting = showWaiting();
	postDatawithToken('Document/DownloadDocument?documentId=' + id, {}, function(data) {
		closeWaiting(waiting);
		if(data.Type == 1) {
			if(mui.os.plus) {
				docDownloadTask(data.Data, documentTitle, function(task) {
					if(task.state == 3) {
						if(document.getElementById("downloadPro")) {
							var pro = Number(task.downloadedSize / task.totalSize);
							var progress = pro.toFixed(2);
							progress = progress * 100;
							document.getElementById("downloadPro").style.display = 'block';
							mui("#downloadPro").progressbar().setProgress(progress);
						}
					}
					if(task.state == 4) {
						if(document.getElementById("downloadPro")) {
							document.getElementById("downloadPro").style.display = 'none';
							mui("#downloadPro").progressbar().hide();
						}
					}

				})
				isDownload=true;
			} else {
				isDownload=true;
				download(data.Data, document.getElementById("documentTitle").innerText, location.href.split('#')[0])
			}
		} else if(data.Type == 0) {
			//登录失败
			mui.toast("请登录后再进行操作");
			closeWaiting(waiting);
			login();
			return;
		} else {
			//逻辑错误
			mui.toast(data.Data);
			closeWaiting(waiting);
			return;
		}
	}, function(err) {
		closeWaiting(waiting);
	})
}
/**
 * 
 * @param {Object} url
 */
function docDownloadTask(url, title, callback) {
	var dtask = null;
	var url = getImgUrl(url);
	var options = {
		method: "GET",
		filename: "_downloads/" + title
	};
	plus.io.resolveLocalFileSystemURL("_downloads/" + title, function(entry) {
		entry.file(function(file) {
			if(file.size != 0) {
				//存在
				plus.io.resolveLocalFileSystemURL("_downloads/" + title, function(entry) {
					plus.runtime.openFile(entry.fullPath, {}, function(e) {
						plus.runtime.openURL(url)
					});
				}, function(e) {
					//mui.toast('出错了')
				});
			}
		});
	}, function(e) {
		var waiting = showWaiting();
		dtask = plus.downloader.createDownload(url, options);
		dtask.addEventListener("statechanged", function(task, status) {
			callback(task);
			closeWaiting(waiting);
			switch(task.state) {
				case 1:
					console.log("开始下载...");
					break;
				case 2:
					console.log("链接到服务器...");
					break;
				case 3:
					//mui.toast("下载数据更新:");
					break;
				case 4:
					mui.toast("下载完成！");
					plus.io.resolveLocalFileSystemURL(task.filename, function(entry) {
						closeWaiting(waiting);
						plus.runtime.openFile(entry.fullPath, {}, function(e) {
							//plus.nativeUI.alert("无法打开此文件：" + e.emssage);
							plus.runtime.openURL(url)
						});
					}, function(e) {
						console.log(JSON.stringify(e));
						closeWaiting(waiting);
						mui.toast('出错了')
					});
					break;
			}
		});
		dtask.start();
	});

}
var docdownload = document.getElementById("docdownload");
function download_doc(){
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		if(isDownload&&isDownload) {
			DownloadDocument(commentedObjectId)
		} else {
			if(ManagerLevel == 0) {
				if(canDownload) {
					mui('#canDownloadPop').popover('toggle');
					setPopHeight('canDownloadPop')
				} else {
					mui('#downloadPop').popover('toggle');
					setPopHeight('downloadPop')
				}
				
			} else {
				DownloadDocument(commentedObjectId)
			}
		}

	} else {
		login()
	}
}
//docdownload && docdownload.addEventListener('tap', function() {
//	
//
//})
var confirmDownload = document.getElementById("confirmDownload");
var cancelDownload = document.getElementById("cancelDownload");
var closeDownload = document.getElementById("closeDownload");
var docstart = document.getElementById("docstart");
confirmDownload && confirmDownload.addEventListener('tap', function() {
	mui('#canDownloadPop').popover('toggle');
	DownloadDocument(commentedObjectId)
})
cancelDownload && cancelDownload.addEventListener('tap', function() {
	mui('#canDownloadPop').popover('toggle');
})
closeDownload && closeDownload.addEventListener('tap', function() {
	mui('#downloadPop').popover('toggle');
})
docstart && docstart.addEventListener('tap', function() {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		mui('#scorePop').popover('toggle');
		setPopHeight('scorePop')
	} else {
		login()
	}

})

function submitComment(pid) {
	var comBody = TrimAll(commentText.value);
	if(comBody.length == 0) {
		mui.toast('评论内容不能为空！');
		return;
	}
	var params = {
		ParentId: pid,
		CommentedObjectId: commentedObjectId,
		TenantTypeId: tenantTypeId,
		Body: comBody
	}
	CreateComment(params)
}
var parentId = 0;
/**
 * 0直接点击下方tab评论（1级）
 * 1点击一级评论
 * 2点击二级评论
 */
var type = 0;
var ii = 0;
var elm;
var elmt;
mui("#commentArea").on('tap', '.comment_content p', function(e) {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		if(this.getAttribute('title') == 'parent') {
			type = 1;
			elmt = e.target.parentElement.parentElement;
		} else {
			type = 2;
			elm = e.target.parentElement;
			elmt = e.target.parentElement.parentElement;
		}
		parentId = this.getAttribute('id');
		document.getElementById('popView_comment').getElementsByTagName('textarea')[0].placeholder = '回复'+this.className;
		mui('#popView_comment').popover('toggle');
		if(document.getElementById("sendCom").title){
			document.getElementById("sendCom").removeAttribute("title");
		}
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}

})
/**
 * type 0 父级评论（1级） 1点击父评论进行子评论 2点击子评论进行二级子评论
 * @param {Object} params
 */
function CreateComment(params) {
	switch(params.TenantTypeId){
		case 'Question':
			var action = 'Ask/CreateComment';
		break;
		case 'Answer':
			var action = 'Ask/CreateComment';
		break;
		case 'Document':
			var action = 'Document/CreateComment';
		break;
		case 'Vote':
			var action = 'Vote/CreateComment';
		break;
		case 'Event':
			var action = 'Event/CreateComment';
		break;
		case 'PointMall':
			var action = 'PointMall/CreateComment';
		break;
		default:
			var action = 'Comment/CreateComment';
		break;
	}
	postDatawithToken(action, params, function(data) {
		document.getElementById("comment-textarea").value = '';
		if(data.Type == 1 && data.Data.ApprovalStatus == 40) {
			ii++;
			switch(type) {
				case 0:
					var commentArea=document.getElementById("commentArea");
					if(commentArea.parentElement.parentElement!=null){
						if(commentArea.parentElement.parentElement.querySelector('#errForList')){
							commentArea.parentElement.parentElement.querySelector('#errForList').style.display='none';
						}
					}
					document.getElementById("commentArea") && commentArea.appendChild(creatsingleCom(data.Data, ii,true))
					break;
				case 1:
					var elm = elmt.querySelector('.jh-comment-reply');
					if(elmt.querySelector('.jh-comment-reply').style.display != 'block') {
						elmt.querySelector('.jh-comment-reply').style.display = 'block';
						elm.innerHTML = '';
					}
					if(elm.querySelector('h5') && elm.querySelector('.mui-text-center')) {
						var childElm = elm.querySelector('#childList');
						childElm.appendChild(creatsingleChilCom(data.Data));
						var comNumber = elm.querySelector('#comLen').innerText;
						comNumber++;
						elm.querySelector('#comLen').innerText = comNumber;
					} else {
						elm.appendChild(creatsingleChilCom(data.Data))
					}
					type = 0;
					break;
				case 2:
					elm = elmt;
					if(elm.querySelector('h5') && elm.querySelector('.mui-text-center')) {
						var childElm = elm.querySelector('#childList');
						childElm.appendChild(creatsingleChilCom(data.Data));
						var comNumber = elm.querySelector('#comLen').innerText;
						comNumber++;
						elm.querySelector('#comLen').innerText = comNumber;
					} else {
						if(elm.querySelector('.jh-comment-reply')) {
							elm = elm.querySelector('.jh-comment-reply')
						}
						elm.appendChild(creatsingleChilCom(data.Data))
					}
					type = 0;
					break;
				default:
					break;
			}
			if(pageUrl == 'documentDetail.html' || pageUrl == 'docImgsDetail.html' || pageUrl == 'docVideoDetail.html') {
				document.getElementById("docsupportNum").innerHTML++;
			} else {
				document.getElementById("supportNum").innerHTML++;
			}
			document.getElementById("comment-textarea").blur();
			if(document.getElementById("noCom")){
				document.getElementById("noCom").style.display='none'
			}
			setLastBoard()
		} else if(data.Type == 0) {
			//登录失败
			mui.toast("请登录后再进行操作");
			document.getElementById("comment-textarea").blur();
			login();
			return;
		} else if(data.Data.ApprovalStatus != 40) {
			mui.toast('请耐心等待通过审核')
			document.getElementById("comment-textarea").blur();
			return;

		} else {
			//逻辑错误
			mui.toast(data.Data);
			document.getElementById("comment-textarea").blur();
			return;
		}
	}, function(err) {

	})
}
