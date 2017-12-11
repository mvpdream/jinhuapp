/**
 * 评论
 */
var com={
	isFavorited : true
}
//var isFavorited = true;
function login (){
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
	document.getElementById("supportNum").innerHTML = num
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
		'					<a id="favorNew" style="padding-left: 16px;float: left;"><span id="favorNews" class="mui-icon mui-icon-extra mui-icon-extra-heart comment_menu"></span></a>' +
		'					<a id="shares" style="float: right;padding-right: 14px;">' +
		'						<span class="mui-icon mui-icon-extra mui-icon-extra-share comment_menu"></span></a>' +
		'				</div>';
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
		'		<button id="sendCom" class="mui-btn mui-btn-primary" style="margin-left: 20px;padding:6px 20px;padding-top: 8px;">发送</button>' +
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
	var itemLen='';
	for(var i = 0; i < data.length; i++) {
		var itemContainer = "";
		var dis = '';
		if(i > 1) {
			dis = 'none'
		} else {
			dis = 'block';
		}
		itemContainer += ("<p id='" + data[i].CommentId + "' style='display:" + dis + "'>" + data[i].User + "回复" + data[i].Owner + "： " + data[i].Body + "</p>");
		bigContainers += itemContainer;
	}
	bigContainers += '</div>'
	if(data.length > 2) {
		itemLen= "<h5 class='mui-text-center'><a>共<span id='comLen'>" + data.length + "</span>条评论>></a></h5>";
		return bigContainers += itemLen;
	} else {
		return bigContainers;
	}
}
/**
 * 构建评论元素
 * @param {Object} data
 */
var createComFragment = function(data,downcount,callback) {
	var fragment = document.createDocumentFragment();
	var div;
	for(var i = 0; i < data.length; i++) {
		downcount++;
		fragment.appendChild(creatsingleCom(data[i], i,downcount));
	}
	
	return fragment;
	
};
/**
 * 构建单个评论元素
 * @param {Object} data
 * @param {Object} i
 */

function creatsingleCom(data, i,downcount) {
	if(downcount == 1){
		floorNumber = downcount;
	}else{
		floorNumber = floorNumber;
		floorNumber++;
	}
	
	
	//floorNumber = i + 1;

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
			'		    		<img class="creator_img_comment " id=' + data.UserId + ' src=' + userAvator + '>' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User + '</h5>' +
			'					<h5 class="comment_top_right">' + (floorNumber) + '楼</h5>' +
			'				</div>' +
			'				<p id='+data.CommentId+' title="parent">' +
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
			'		    		<img class="creator_img_comment " id=' + data.UserId + ' src=' + userAvator + '>' +
			'			    	</div>' +
			'			    	<div class="comment_content">' +
			'			    		<div class="comment_top">' +
			'			    			<h5 class="comment_top_left">' + data.User + '</h5>' +
			'					<h5 class="comment_top_right">' + data.DateCreated + '</h5>' +
			'				</div>' +
			'				<p id='+data.CommentId+' title="parent">' +
			'					' + data.Body + '' +
			'				</p>' +
			'               <div id="childCom' + i + '" class="jh-comment-reply" style="display:' + dis + '">' + child + '</div>' +
			'			</div>';
	}

	fragment.appendChild(div);

	return fragment;
}
creatCommentBar();
creatCommentPop();
creatSharePop();
creatSharePop1();
if(!mui.os.plus) {
	if(document.getElementById("morecom")){
		document.getElementById("morecom").firstElementChild.style.width='auto';
	}
	if(document.querySelector('.jh-comment-right')){
		document.querySelector('.jh-comment-right').style.width = '100%';
		document.querySelector('.jh-comment-right').style.padding = '0 10px 0 10px';
		document.getElementById("shares").style.display = 'none';
		document.getElementById("favorNew").style.float = 'right';
	}
	if(document.querySelector('.jh-comment-edit')){
		document.querySelector('.jh-comment-edit').style.display = 'none';
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


var morecomment = document.getElementById("morecomment");
var morecom = document.getElementById("morecom");
var cancelCom = document.getElementById("cancelCom");
var sendCom = document.getElementById("sendCom");
var commentText = document.getElementById("comment-textarea");
var favorNews = document.getElementById("favorNews")
var editComment = document.getElementById("editComment");

mui(".pop_view_share").on('tap', '.pop_view_item', function(e) {
	if(mui.os.plus) {
		mui('#popView_share').popover('toggle');
		shareHref(this.getAttribute('id'));
	}

})

mui("#commentArea").on('tap', '.mui-text-center', function(e) {
	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
	mui.each(allp, function(index, item) {
		if(item.style.display == 'block' && index > 1) {
			item.style.display = 'none'
		} else {
			item.style.display = 'block'
		}

	})
})
mui("#commentAreas").on('tap', '.mui-text-center', function(e) {
	var allp = e.target.parentElement.parentElement.querySelectorAll('p');
	mui.each(allp, function(index, item) {
		if(item.style.display == 'block' && index > 1) {
			item.style.display = 'none'
		} else {
			item.style.display = 'block'
		}
	})
})
var parentId = 0;

function creatsingleChilCom(data, i) {
	var p = document.createElement("p");
	p.id = data.CommentId;
	p.innerHTML = '' + data.User + ' 回复 ' + data.Owner + ' ： ' + data.Body + '';
	return p;
}

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

	mui('#popView_comment').popover('toggle');
	submitComment(parentId);

})
document.getElementById("shares") && document.getElementById("shares").addEventListener('tap', function() {
	if(mui.os.plus) {
		mui('#popView_share').popover('toggle');
	} else {
		mui('#popView_share1').popover('toggle');
	}

})
favorNews && favorNews.addEventListener('tap', function() {
	var islog = getlsData('isLogin');
	if(islog == 'true') {
		ThreadFavoriteOperation(commentedObjectId)
	} else {
		mui.toast('请登录后再进行操作');
		login();
	}

})

function ThreadFavoriteOperation(id) {
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

function favorThread(status) {
	if(status) {
		favorNews.className = 'mui-icon mui-icon-extra mui-icon-extra-heart-filled comment_menu';
	} else {
		favorNews.className = 'mui-icon mui-icon-extra mui-icon-extra-heart comment_menu';
	}
}

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
		if(this.getAttribute('title')=='parent'){
			type = 1;
			elmt = e.target.parentElement.parentElement;
		}else{
			type = 2;
			elm = e.target.parentElement;
			elmt = e.target.parentElement.parentElement;
		}
		parentId = this.getAttribute('id');
		mui('#popView_comment').popover('toggle');
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
	postDatawithToken('Comment/CreateComment', params, function(data) {
		document.getElementById("comment-textarea").value = '';
		if(data.Type == 1 && data.Data.ApprovalStatus == 40) {
			ii++;
			switch(type) {
				case 0:
					document.getElementById("commentArea") && commentArea.appendChild(creatsingleCom(data.Data, ii))
					break;
				case 1:
					elm = elmt.querySelector('.jh-comment-reply');
					if(elmt.querySelector('.jh-comment-reply').style.display != 'block'){
						elmt.querySelector('.jh-comment-reply').style.display = 'block';
						elm.innerHTML = '';
					}
					if(elm.querySelector('h5')&&elm.querySelector('.mui-text-center')){
						var childElm=elm.querySelector('#childList');
						childElm.appendChild(creatsingleChilCom(data.Data));
						var comNumber=elm.querySelector('#comLen').innerText;
						comNumber++;
						elm.querySelector('#comLen').innerText=comNumber;
					}else{
						elm.appendChild(creatsingleChilCom(data.Data))
					}
					type = 0;
					break;
				case 2:
					elm = elmt;
					if(elm.querySelector('h5')&&elm.querySelector('.mui-text-center')){
						var childElm=elm.querySelector('#childList');
						childElm.appendChild(creatsingleChilCom(data.Data));
						var comNumber=elm.querySelector('#comLen').innerText;
						comNumber++;
						elm.querySelector('#comLen').innerText=comNumber;
					}else{
						elm.appendChild(creatsingleChilCom(data.Data))
					}
					type = 0;
					break;
				default:
					break;
			}
			document.getElementById("supportNum").innerHTML++;
			document.getElementById("comment-textarea").blur();
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

